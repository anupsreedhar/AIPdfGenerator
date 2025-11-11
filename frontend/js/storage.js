/**
 * LocalStorage Helper for Template Management
 * Provides CRUD operations for PDF templates
 */

const TemplateStorage = {
    STORAGE_KEY: 'pdf_templates',
    RECENT_KEY: 'pdf_recent_generations',

    /**
     * Get all templates from localStorage
     * @returns {Array} Array of template objects
     */
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Get template by ID
     * @param {string} id - Template ID
     * @returns {Object|null} Template object or null
     */
    getById(id) {
        const templates = this.getAll();
        return templates.find(t => t.id === id) || null;
    },

    /**
     * Save a template (create or update)
     * @param {Object} template - Template object
     * @returns {Object} Saved template with ID and timestamp
     */
    save(template) {
        const templates = this.getAll();
        
        // Generate ID if new template
        if (!template.id) {
            template.id = this.generateId();
            template.createdAt = new Date().toISOString();
        }
        
        template.updatedAt = new Date().toISOString();

        // Find existing template
        const index = templates.findIndex(t => t.id === template.id);
        
        if (index >= 0) {
            // Update existing
            templates[index] = template;
        } else {
            // Add new
            templates.push(template);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
        return template;
    },

    /**
     * Delete template by ID
     * @param {string} id - Template ID
     * @returns {boolean} Success status
     */
    delete(id) {
        let templates = this.getAll();
        const initialLength = templates.length;
        
        templates = templates.filter(t => t.id !== id);
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
        return templates.length < initialLength;
    },

    /**
     * Clear all templates
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Export templates as JSON
     * @returns {string} JSON string of all templates
     */
    export() {
        const templates = this.getAll();
        return JSON.stringify(templates, null, 2);
    },

    /**
     * Import templates from JSON
     * @param {string} jsonString - JSON string of templates
     * @param {boolean} merge - If true, merge with existing; if false, replace
     * @returns {number} Number of templates imported
     */
    import(jsonString, merge = true) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid format: expected array of templates');
            }

            let templates = merge ? this.getAll() : [];
            
            imported.forEach(template => {
                // Ensure template has required fields
                if (template.name && template.fields) {
                    // Generate new ID to avoid conflicts
                    template.id = this.generateId();
                    template.importedAt = new Date().toISOString();
                    templates.push(template);
                }
            });

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
            return imported.length;
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    },

    /**
     * Search templates by name
     * @param {string} query - Search query
     * @returns {Array} Matching templates
     */
    search(query) {
        const templates = this.getAll();
        const lowerQuery = query.toLowerCase();
        
        return templates.filter(t => 
            t.name.toLowerCase().includes(lowerQuery) ||
            (t.description && t.description.toLowerCase().includes(lowerQuery))
        );
    },

    /**
     * Get storage statistics
     * @returns {Object} Storage stats
     */
    getStats() {
        const templates = this.getAll();
        const dataSize = new Blob([JSON.stringify(templates)]).size;
        
        return {
            count: templates.length,
            sizeBytes: dataSize,
            sizeKB: (dataSize / 1024).toFixed(2),
            sizeMB: (dataSize / 1024 / 1024).toFixed(2),
            lastUpdated: templates.length > 0 
                ? templates.reduce((latest, t) => 
                    new Date(t.updatedAt || t.createdAt) > new Date(latest) 
                        ? (t.updatedAt || t.createdAt) 
                        : latest, 
                    templates[0].updatedAt || templates[0].createdAt)
                : null
        };
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Save recent generation
     * @param {Object} generation - Generation record
     */
    saveRecentGeneration(generation) {
        let recent = this.getRecentGenerations();
        
        generation.timestamp = new Date().toISOString();
        recent.unshift(generation);
        
        // Keep only last 20
        recent = recent.slice(0, 20);
        
        localStorage.setItem(this.RECENT_KEY, JSON.stringify(recent));
    },

    /**
     * Get recent generations
     * @returns {Array} Recent generation records
     */
    getRecentGenerations() {
        const data = localStorage.getItem(this.RECENT_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Clear recent generations
     */
    clearRecentGenerations() {
        localStorage.removeItem(this.RECENT_KEY);
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateStorage;
}
