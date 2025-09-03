import { DOM, Events, Utils as CoreUtils } from './core.js';

/* SmoothScroll class */
class SmoothScroll {
    constructor(options = {}) {
        this.options = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
            offset: 0,
            ...options
        };
        
        this.boundMethods = {
            handleAnchorClick: this.handleAnchorClick.bind(this)
        };
        
        this.initialize();
        CoreUtils.debug('SmoothScroll initialized');
    }
    
    /* Initialize smooth scrolling */
    initialize() {
        const anchorLinks = DOM.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(anchor => {
            Events.addEventListener(
                anchor,
                'click',
                this.boundMethods.handleAnchorClick
            );
        });
        
        CoreUtils.debug(`Initialized smooth scrolling for ${anchorLinks.length} anchor links`);
    }
    
    /* Handle anchor link clicks */
    handleAnchorClick(event) {
        event.preventDefault();
        
        const href = event.currentTarget.getAttribute('href');
        const target = DOM.querySelector(href);
        
        if (target) {
            this.scrollToElement(target);
            CoreUtils.debug(`Smooth scrolling to: ${href}`);
        } else {
            CoreUtils.debug(`Target element not found: ${href}`);
        }
    }
    
    /* Scroll to element */
    scrollToElement(element, customOptions = {}) {
        if (!element) return;
        
        const scrollOptions = {
            ...this.options,
            ...customOptions
        };
        
        /* Handle offset if specified */
        if (scrollOptions.offset !== 0) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - scrollOptions.offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: scrollOptions.behavior
            });
        } else {
            element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...scrollOptions
        });
        }
    }
    
    /* Scroll to top of page */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: this.options.behavior
        });
    }
    
    /* Destroy smooth scroll instance */
    destroy() {
        const anchorLinks = DOM.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(anchor => {
            Events.removeEventListener(
                anchor,
                'click',
                this.boundMethods.handleAnchorClick
            );
        });
        
        CoreUtils.debug('SmoothScroll destroyed');
    }
}

/* FormValidator class */
class FormValidator {
    constructor() {
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/,
            url: /^https?:\/\/.+/,
            number: /^\d+$/
        };
        
        CoreUtils.debug('FormValidator initialized');
    }
    
    /* Validate email address */
    validateEmail(email) {
        return this.validationRules.email.test(email);
    }
    
    /* Validate phone number */
    validatePhone(phone) {
        return this.validationRules.phone.test(phone);
    }
    
    /* Validate URL */
    validateUrl(url) {
        return this.validationRules.url.test(url);
    }
    
    /* Validate required field */
    validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    /* Validate minimum length */
    validateMinLength(value, minLength) {
        return value && value.length >= minLength;
    }
    
    /* Validate maximum length */
    validateMaxLength(value, maxLength) {
        return !value || value.length <= maxLength;
    }
    
    /* Validate form field based on type */
    validateField(field) {
        const value = field.value;
        const type = field.type || field.dataset.validate;
        const required = field.hasAttribute('required');
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        /* Check required */
        if (required && !this.validateRequired(value)) {
            return {
                isValid: false,
                message: 'This field is required'
            };
        }
        
        /* Skip other validations if field is empty and not required */
        if (!value && !required) {
            return { isValid: true, message: '' };
        }
        
        /* Check length constraints */
        if (minLength && !this.validateMinLength(value, parseInt(minLength))) {
            return {
                isValid: false,
                message: `Minimum length is ${minLength} characters`
            };
        }
        
        if (maxLength && !this.validateMaxLength(value, parseInt(maxLength))) {
            return {
                isValid: false,
                message: `Maximum length is ${maxLength} characters`
            };
        }
        
        /* Check type-specific validation */
        switch (type) {
            case 'email':
                if (!this.validateEmail(value)) {
                    return {
                        isValid: false,
                        message: 'Please enter a valid email address'
                    };
                }
                break;
            case 'tel':
            case 'phone':
                if (!this.validatePhone(value)) {
                    return {
                        isValid: false,
                        message: 'Please enter a valid phone number'
                    };
                }
                break;
            case 'url':
                if (!this.validateUrl(value)) {
                    return {
                        isValid: false,
                        message: 'Please enter a valid URL'
                    };
                }
                break;
            case 'number':
                if (!this.validationRules.number.test(value)) {
                    return {
                        isValid: false,
                        message: 'Please enter a valid number'
                    };
                }
                break;
        }
        
        return { isValid: true, message: '' };
    }
    
    /* Validate entire form */
    validateForm(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        const errors = [];
        let isValid = true;
        
        fields.forEach(field => {
            const result = this.validateField(field);
            if (!result.isValid) {
                isValid = false;
                errors.push({
                    field: field.name || field.id,
                    message: result.message,
                    element: field
                });
            }
        });
        
        return { isValid, errors };
    }
}

/* LocalStorage utility class */
class StorageManager {
    constructor(prefix = 'app_') {
        this.prefix = prefix;
        this.isAvailable = this.checkAvailability();
        
        CoreUtils.debug(`StorageManager initialized with prefix: ${prefix}`);
    }
    
    /* Check if localStorage is available */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            CoreUtils.debug('localStorage not available');
            return false;
        }
    }
    
    /* Get prefixed key */
    getPrefixedKey(key) {
        return `${this.prefix}${key}`;
    }
    
    /* Set item in localStorage */
    setItem(key, value) {
        if (!this.isAvailable) return false;
        
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.getPrefixedKey(key), serializedValue);
            return true;
        } catch (e) {
            CoreUtils.debug('Failed to set localStorage item:', e);
            return false;
        }
    }
    
    /* Get item from localStorage */
    getItem(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;
        
        try {
            const item = localStorage.getItem(this.getPrefixedKey(key));
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            CoreUtils.debug('Failed to get localStorage item:', e);
            return defaultValue;
        }
    }
    
    /* Remove item from localStorage */
    removeItem(key) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.removeItem(this.getPrefixedKey(key));
            return true;
        } catch (e) {
            CoreUtils.debug('Failed to remove localStorage item:', e);
            return false;
        }
    }
    
    /* Clear all items with prefix */
    clear() {
        if (!this.isAvailable) return false;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            CoreUtils.debug('Failed to clear localStorage:', e);
            return false;
        }
    }
}

/* Initialize utility modules */
export function initializeUtils(options = {}) {
    const utils = {
        smoothScroll: null,
        formValidator: null,
        storage: null
    };
    
    try {
        /* Initialize smooth scrolling */
        if (options.enableSmoothScroll !== false) {
            utils.smoothScroll = new SmoothScroll(options.smoothScrollOptions);
        }
        
        /* Initialize form validator */
        if (options.enableFormValidation !== false) {
            utils.formValidator = new FormValidator();
        }
        
        /* Initialize storage manager */
        if (options.enableStorage !== false) {
            utils.storage = new StorageManager(options.storagePrefix);
        }
        
        CoreUtils.debug('Utils module initialized successfully');
        return utils;
    } catch (error) {
        CoreUtils.debug('Failed to initialize utils:', error);
        return utils;
    }
}

/* Export classes for direct usage */
export {
    SmoothScroll,
    FormValidator,
    StorageManager
};

/* Export default for convenience */
export default {
    SmoothScroll,
    FormValidator,
    StorageManager,
    initializeUtils
};