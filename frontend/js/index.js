/**
 * Index Page - Template Library
 */

let allTemplates = [];

// Load templates on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
    updateStats();
});

/**
 * Load all templates and display
 */
function loadTemplates() {
    allTemplates = TemplateStorage.getAll();
    displayTemplates(allTemplates);
}

/**
 * Display templates in grid
 */
function displayTemplates(templates) {
    const grid = document.getElementById('templatesGrid');
    const emptyState = document.getElementById('emptyState');

    if (templates.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    grid.innerHTML = templates.map(template => `
        <div class="col-md-4 fade-in">
            <div class="card template-card" onclick="viewTemplate('${template.id}')">
                <span class="badge bg-primary">${template.fields.length} fields</span>
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas fa-file-alt text-primary"></i>
                        ${escapeHtml(template.name)}
                    </h5>
                    <p class="card-text text-muted small">
                        ${template.description || 'No description'}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small class="text-muted">
                            <i class="fas fa-clock"></i>
                            ${formatDate(template.updatedAt || template.createdAt)}
                        </small>
                        <div class="btn-group" onclick="event.stopPropagation()">
                            <button class="btn btn-sm btn-outline-primary" 
                                    onclick="editTemplate('${template.id}')" 
                                    title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" 
                                    onclick="useTemplate('${template.id}')" 
                                    title="Generate PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteTemplate('${template.id}')" 
                                    title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Search templates
 */
function searchTemplates() {
    const query = document.getElementById('searchInput').value;
    const filtered = TemplateStorage.search(query);
    displayTemplates(filtered);
}

/**
 * Update statistics
 */
function updateStats() {
    const stats = TemplateStorage.getStats();
    
    document.getElementById('totalTemplates').textContent = stats.count;
    document.getElementById('storageUsed').textContent = stats.sizeKB + ' KB';
    document.getElementById('lastUpdated').textContent = 
        stats.lastUpdated ? formatDate(stats.lastUpdated) : 'Never';
}

/**
 * View template details
 */
function viewTemplate(id) {
    const template = TemplateStorage.getById(id);
    if (!template) return;

    const details = `
        <strong>Name:</strong> ${template.name}<br>
        <strong>Fields:</strong> ${template.fields.length}<br>
        <strong>Created:</strong> ${formatDate(template.createdAt)}<br>
        <strong>Updated:</strong> ${formatDate(template.updatedAt)}<br><br>
        <strong>Fields:</strong><br>
        ${template.fields.map(f => `- ${f.name} (${f.type})`).join('<br>')}
    `;

    if (confirm(`Template Details:\n\n${template.name}\nFields: ${template.fields.length}\n\nEdit this template?`)) {
        editTemplate(id);
    }
}

/**
 * Edit template
 */
function editTemplate(id) {
    window.location.href = `designer.html?id=${id}`;
}

/**
 * Use template for PDF generation
 */
function useTemplate(id) {
    window.location.href = `generate.html?template=${id}`;
}

/**
 * Delete template
 */
function deleteTemplate(id) {
    const template = TemplateStorage.getById(id);
    if (!template) return;

    if (confirm(`Delete template "${template.name}"?\n\nThis action cannot be undone.`)) {
        TemplateStorage.delete(id);
        showNotification('Template deleted successfully', 'success');
        loadTemplates();
        updateStats();
    }
}

/**
 * Export all templates
 */
function exportTemplates() {
    const json = TemplateStorage.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdf-templates-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Templates exported successfully', 'success');
}

/**
 * Import templates
 */
function importTemplates() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

/**
 * Do import from file
 */
function doImport() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const count = TemplateStorage.import(e.target.result, true);
            showNotification(`${count} templates imported successfully`, 'success');
            loadTemplates();
            updateStats();
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
        } catch (error) {
            alert('Import failed: ' + error.message);
        }
    };
    reader.readAsText(file);
}

/**
 * Clear all templates
 */
function clearAllTemplates() {
    if (confirm('Delete ALL templates?\n\nThis action cannot be undone!')) {
        if (confirm('Are you ABSOLUTELY sure? This will delete everything!')) {
            TemplateStorage.clear();
            showNotification('All templates cleared', 'warning');
            loadTemplates();
            updateStats();
        }
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create toast element
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

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
