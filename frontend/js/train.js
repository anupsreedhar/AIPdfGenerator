/**
 * ML Training Interface
 */

let trainingApiUrl = 'http://localhost:9000/api/train';
let trainingInterval = null;

// Load on page ready
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    updateStatus();
});

/**
 * Update training status
 */
function updateStatus() {
    const templates = TemplateStorage.getAll();
    document.getElementById('templateCount').textContent = templates.length;
    
    // Check if model exists
    const modelInfo = localStorage.getItem('ml_model_info');
    if (modelInfo) {
        const info = JSON.parse(modelInfo);
        document.getElementById('modelStatus').textContent = 'Trained';
        document.getElementById('modelStatus').className = 'badge bg-success';
        document.getElementById('lastTrained').textContent = formatDate(info.trainedAt);
        
        // Show model info card
        document.getElementById('modelInfoCard').style.display = 'block';
        document.getElementById('modelAccuracy').textContent = info.accuracy || 'N/A';
        document.getElementById('modelEpochs').textContent = info.epochs || 'N/A';
        document.getElementById('modelTemplates').textContent = info.templateCount || 'N/A';
    }
}

/**
 * Start ML training
 */
async function startTraining() {
    const templates = TemplateStorage.getAll();
    
    if (templates.length === 0) {
        alert('No templates found! Please create at least one template first.');
        window.location.href = 'designer.html';
        return;
    }
    
    if (templates.length < 3) {
        if (!confirm(`Only ${templates.length} template(s) found. For better results, create at least 5 templates.\n\nContinue anyway?`)) {
            return;
        }
    }
    
    // Get training parameters
    const epochs = parseInt(document.getElementById('epochs').value);
    const batchSize = parseInt(document.getElementById('batchSize').value);
    const generateSamples = document.getElementById('generateSamples').checked;
    
    // Hide form, show progress
    document.getElementById('trainingForm').style.display = 'none';
    document.getElementById('trainingProgress').style.display = 'block';
    document.getElementById('trainingError').style.display = 'none';
    document.getElementById('trainingComplete').style.display = 'none';
    
    // Clear log
    document.getElementById('trainingLog').innerHTML = '';
    
    try {
        logMessage('🚀 Starting ML training...');
        logMessage(`📊 Templates: ${templates.length}`);
        logMessage(`⚙️ Epochs: ${epochs}, Batch Size: ${batchSize}`);
        logMessage('');
        
        // Prepare training data
        const trainingData = {
            templates: templates,
            config: {
                epochs: epochs,
                batch_size: batchSize,
                generate_synthetic: generateSamples,
                min_templates: 10
            }
        };
        
        logMessage('📤 Sending templates to backend...');
        updateProgress(10, 'Uploading templates...');
        
        // Call training API
        const response = await axios.post(trainingApiUrl, trainingData, {
            headers: {
                'Content-Type': 'application/json'
            },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 10) / progressEvent.total);
                updateProgress(percent, 'Uploading templates...');
            }
        });
        
        logMessage('✅ Templates uploaded successfully');
        updateProgress(20, 'Preparing training data...');
        
        // Start polling for progress
        const taskId = response.data.task_id;
        if (taskId) {
            await pollTrainingProgress(taskId);
        } else {
            // Training completed immediately
            handleTrainingComplete(response.data);
        }
        
    } catch (error) {
        console.error('Training failed:', error);
        handleTrainingError(error);
    }
}

/**
 * Poll training progress
 */
async function pollTrainingProgress(taskId) {
    const statusUrl = trainingApiUrl.replace('/train', `/train/status/${taskId}`);
    
    trainingInterval = setInterval(async () => {
        try {
            const response = await axios.get(statusUrl);
            const status = response.data;
            
            if (status.status === 'running') {
                updateProgress(status.progress || 50, status.message || 'Training...');
                if (status.log) {
                    logMessage(status.log);
                }
            } else if (status.status === 'complete') {
                clearInterval(trainingInterval);
                handleTrainingComplete(status.result);
            } else if (status.status === 'error') {
                clearInterval(trainingInterval);
                throw new Error(status.error);
            }
        } catch (error) {
            clearInterval(trainingInterval);
            handleTrainingError(error);
        }
    }, 2000); // Poll every 2 seconds
}

/**
 * Handle training completion
 */
function handleTrainingComplete(result) {
    logMessage('');
    logMessage('✅ Training completed successfully!');
    logMessage(`📈 Final Accuracy: ${result.accuracy || 'N/A'}`);
    logMessage(`⏱️ Training Time: ${result.training_time || 'N/A'}`);
    
    updateProgress(100, 'Complete!');
    
    // Save model info
    const modelInfo = {
        trainedAt: new Date().toISOString(),
        accuracy: result.accuracy,
        epochs: result.epochs,
        templateCount: result.template_count,
        trainingTime: result.training_time
    };
    localStorage.setItem('ml_model_info', JSON.stringify(modelInfo));
    
    // Show complete screen
    setTimeout(() => {
        document.getElementById('trainingProgress').style.display = 'none';
        document.getElementById('trainingComplete').style.display = 'block';
        
        document.getElementById('finalAccuracy').textContent = result.accuracy || 'N/A';
        document.getElementById('finalEpochs').textContent = result.epochs || 'N/A';
        document.getElementById('finalTime').textContent = result.training_time || 'N/A';
        
        updateStatus();
    }, 1000);
}

/**
 * Handle training error
 */
function handleTrainingError(error) {
    document.getElementById('trainingProgress').style.display = 'none';
    document.getElementById('trainingError').style.display = 'block';
    
    let errorMsg = 'Unknown error occurred';
    
    if (error.response) {
        errorMsg = `Server error: ${error.response.status} - ${error.response.data.detail || error.response.statusText}`;
    } else if (error.request) {
        errorMsg = 'Cannot connect to backend server. Please ensure the Python backend is running.';
    } else {
        errorMsg = error.message;
    }
    
    document.getElementById('errorMessage').textContent = errorMsg;
    logMessage('❌ Error: ' + errorMsg);
}

/**
 * Update progress bar
 */
function updateProgress(percent, message) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
    
    if (message) {
        document.getElementById('progressText').textContent = message;
    }
}

/**
 * Log message to training log
 */
function logMessage(message) {
    const log = document.getElementById('trainingLog');
    const timestamp = new Date().toLocaleTimeString();
    log.innerHTML += `[${timestamp}] ${message}\n`;
    log.scrollTop = log.scrollHeight;
}

/**
 * Reset training UI
 */
function resetTraining() {
    document.getElementById('trainingForm').style.display = 'block';
    document.getElementById('trainingProgress').style.display = 'none';
    document.getElementById('trainingComplete').style.display = 'none';
    document.getElementById('trainingError').style.display = 'none';
    
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
}

/**
 * Load config
 */
function loadConfig() {
    const saved = localStorage.getItem('ml_training_api_url');
    if (saved) {
        // Auto-migrate old port 8000 to new port 9000
        if (saved.includes(':8000')) {
            trainingApiUrl = saved.replace(':8000', ':9000');
            localStorage.setItem('ml_training_api_url', trainingApiUrl);
        } else {
            trainingApiUrl = saved;
        }
        document.getElementById('trainingApiUrl').value = trainingApiUrl;
    }
}

/**
 * Save training config
 */
function saveTrainingConfig() {
    trainingApiUrl = document.getElementById('trainingApiUrl').value;
    localStorage.setItem('ml_training_api_url', trainingApiUrl);
    showNotification('Configuration saved', 'success');
    bootstrap.Modal.getInstance(document.getElementById('configModal')).hide();
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
