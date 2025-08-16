// Main class to manage the application
class SecureGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.generateInitialValues();
    }

    // Initialize DOM elements
    initializeElements() {
        // Password elements
        this.passwordOutput = document.getElementById("passwordOutput");
        this.passwordLength = document.getElementById("passwordLength");
        this.includeUppercase = document.getElementById("includeUppercase");
        this.includeLowercase = document.getElementById("includeLowercase");
        this.includeNumbers = document.getElementById("includeNumbers");
        this.includeSymbols = document.getElementById("includeSymbols");
        this.strengthFill = document.getElementById("strengthFill");
        this.strengthText = document.getElementById("strengthText");
        
        // Password buttons
        this.regeneratePassword = document.getElementById("regeneratePassword");
        this.copyPassword = document.getElementById("copyPassword");
        this.increaseLength = document.getElementById("increaseLength");
        this.decreaseLength = document.getElementById("decreaseLength");
        
        // UUID elements
        this.uuidOutput = document.getElementById("uuidOutput");
        this.regenerateUuid = document.getElementById("regenerateUuid");
        this.copyUuid = document.getElementById("copyUuid");
        
        // Toast
        this.toast = document.getElementById("toast");
    }

    // Bind events
    bindEvents() {
        // Password events
        this.regeneratePassword.addEventListener("click", () => this.generatePassword());
        this.copyPassword.addEventListener("click", () => this.copyToClipboard(this.passwordOutput.value, "Password copied!"));
        
        // Length control events
        this.increaseLength.addEventListener("click", () => this.adjustLength(1));
        this.decreaseLength.addEventListener("click", () => this.adjustLength(-1));
        this.passwordLength.addEventListener("input", () => this.generatePassword());
        
        // Option events
        [this.includeUppercase, this.includeLowercase, this.includeNumbers, this.includeSymbols]
            .forEach(checkbox => checkbox.addEventListener("change", () => this.generatePassword()));
        
        // UUID events
        this.regenerateUuid.addEventListener("click", () => this.generateUUID());
        this.copyUuid.addEventListener("click", () => this.copyToClipboard(this.uuidOutput.value, "UUID copied!"));
        
        // Keyboard events
        document.addEventListener("keydown", (e) => this.handleKeyboard(e));
        
        // Auto-select on field click
        this.passwordOutput.addEventListener("click", () => this.passwordOutput.select());
        this.uuidOutput.addEventListener("click", () => this.uuidOutput.select());
    }

    // Generate initial values
    generateInitialValues() {
        this.generatePassword();
        this.generateUUID();
    }

    // Adjust password length
    adjustLength(delta) {
        const currentLength = parseInt(this.passwordLength.value) || 20;
        const newLength = Math.max(4, Math.min(128, currentLength + delta));
        this.passwordLength.value = newLength;
        this.generatePassword();
    }

    // Generate password
    generatePassword() {
        const length = parseInt(this.passwordLength.value) || 20;
        const options = {
            uppercase: this.includeUppercase.checked,
            lowercase: this.includeLowercase.checked,
            numbers: this.includeNumbers.checked,
            symbols: this.includeSymbols.checked
        };

        // Check if at least one option is selected
        if (!Object.values(options).some(option => option)) {
            this.showToast("Select at least one character type!", "error");
            this.includeUppercase.checked = true;
            options.uppercase = true;
        }

        const password = this.createPassword(length, options);
        this.passwordOutput.value = password;
        this.updatePasswordStrength(password);
        this.animateRegeneration(this.regeneratePassword);
    }

    // Create password based on options
    createPassword(length, options) {
        const charSets = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
        };

        let availableChars = "";
        let guaranteedChars = "";

        // Add at least one character of each selected type
        Object.keys(options).forEach(key => {
            if (options[key]) {
                const chars = charSets[key];
                availableChars += chars;
                guaranteedChars += this.getRandomChar(chars);
            }
        });

        // Fill the rest of the password
        let password = guaranteedChars;
        for (let i = guaranteedChars.length; i < length; i++) {
            password += this.getRandomChar(availableChars);
        }

        // Shuffle the password to avoid predictable patterns
        return this.shuffleString(password);
    }

    // Get random character
    getRandomChar(chars) {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Shuffle string
    shuffleString(str) {
        const array = str.split("");
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join("");
    }

    // Update password strength indicator
    updatePasswordStrength(password) {
        const strength = this.calculatePasswordStrength(password);
        const percentage = (strength.score / 5) * 100;
        
        this.strengthFill.style.width = `${percentage}%`;
        this.strengthText.textContent = strength.label;
        
        // Update color based on strength
        const colors = {
            "Very Weak": "#f87171",
            "Weak": "#fb923c",
            "Regular": "#fbbf24",
            "Strong": "#a3e635",
            "Very Strong": "#4ade80"
        };
        
        this.strengthFill.style.background = colors[strength.label] || "#4ade80";
    }

    // Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
            longLength: password.length >= 16,
            veryLongLength: password.length >= 20
        };

        // Score based on criteria
        if (checks.length) score++;
        if (checks.uppercase) score++;
        if (checks.lowercase) score++;
        if (checks.numbers) score++;
        if (checks.symbols) score++;
        if (checks.longLength) score++;
        if (checks.veryLongLength) score++;

        // Reduce score for passwords with repetitive patterns
        if (this.hasRepeatingPatterns(password)) {
            score = Math.max(0, score - 1);
        }

        const labels = ["Very Weak", "Weak", "Regular", "Strong", "Very Strong"];
        const labelIndex = Math.min(Math.floor(score / 1.4), labels.length - 1);

        return {
            score: Math.min(score, 5),
            label: labels[labelIndex]
        };
    }

    // Check for repetitive patterns
    hasRepeatingPatterns(password) {
        // Check for consecutive repeated characters
        for (let i = 0; i < password.length - 2; i++) {
            if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
                return true;
            }
        }

        // Check for simple sequences
        const sequences = ["123", "abc", "ABC", "qwe", "QWE"];
        return sequences.some(seq => password.toLowerCase().includes(seq));
    }

    // Generate UUID v4
    generateUUID() {
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        this.uuidOutput.value = uuid;
        this.animateRegeneration(this.regenerateUuid);
    }

    // Copy to clipboard
    async copyToClipboard(text, message) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }
            
            this.showToast(message, "success");
        } catch (err) {
            console.error("Error copying:", err);
            this.showToast("Error copying to clipboard", "error");
        }
    }

    // Show toast notification
    showToast(message, type = "success") {
        const toastIcon = this.toast.querySelector(".toast-icon");
        const toastMessage = this.toast.querySelector(".toast-message");
        
        // Configure icon based on type
        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle",
            info: "fas fa-info-circle"
        };
        
        toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
        toastMessage.textContent = message;
        
        // Remove previous classes and add new one
        this.toast.className = `toast ${type}`;
        
        // Show toast
        setTimeout(() => {
            this.toast.classList.add("show");
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove("show");
        }, 3000);
    }

    // Animate regeneration button
    animateRegeneration(button) {
        const icon = button.querySelector("i");
        icon.style.transform = "rotate(360deg)";
        icon.style.transition = "transform 0.5s ease";
        
        setTimeout(() => {
            icon.style.transform = "rotate(0deg)";
        }, 500);
    }

    // Handle keyboard events
    handleKeyboard(e) {
        // Ctrl/Cmd + R to regenerate password
        if ((e.ctrlKey || e.metaKey) && e.key === "r") {
            e.preventDefault();
            this.generatePassword();
        }
        
        // Ctrl/Cmd + U to regenerate UUID
        if ((e.ctrlKey || e.metaKey) && e.key === "u") {
            e.preventDefault();
            this.generateUUID();
        }
        
        // Ctrl/Cmd + C when password field is focused
        if ((e.ctrlKey || e.metaKey) && e.key === "c" && document.activeElement === this.passwordOutput) {
            this.copyToClipboard(this.passwordOutput.value, "Password copied!");
        }
        
        // Ctrl/Cmd + C when UUID field is focused
        if ((e.ctrlKey || e.metaKey) && e.key === "c" && document.activeElement === this.uuidOutput) {
            this.copyToClipboard(this.uuidOutput.value, "UUID copied!");
        }
        
        // Arrows to adjust password length
        if (document.activeElement === this.passwordLength) {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                this.adjustLength(1);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                this.adjustLength(-1);
            }
        }
    }
}

// Additional utilities
class Utils {
    // Debounce for performance optimization
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Validate numeric input
    static validateNumericInput(input, min = 1, max = 999) {
        const value = parseInt(input.value);
        if (isNaN(value) || value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }

    // Detect if on mobile device
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detect clipboard API support
    static hasClipboardSupport() {
        return navigator.clipboard && window.isSecureContext;
    }
}

// Accessibility enhancements
class AccessibilityEnhancements {
    static init() {
        // Add improved keyboard navigation
        this.enhanceKeyboardNavigation();
        
        // Add screen reader announcements
        this.addScreenReaderAnnouncements();
        
        // Enhance contrast in high contrast mode
        this.enhanceHighContrastMode();
    }

    static enhanceKeyboardNavigation() {
        // Allow more intuitive Tab navigation
        const focusableElements = document.querySelectorAll(
            "button, input, [tabindex]:not([tabindex=\"-1\"])"
        );
        
        focusableElements.forEach((element, index) => {
            element.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {
                    // Custom navigation logic if needed
                }
            });
        });
    }

    static addScreenReaderAnnouncements() {
        // Create element for announcements
        const announcer = document.createElement("div");
        announcer.setAttribute("aria-live", "polite");
        announcer.setAttribute("aria-atomic", "true");
        announcer.style.position = "absolute";
        announcer.style.left = "-10000px";
        announcer.style.width = "1px";
        announcer.style.height = "1px";
        announcer.style.overflow = "hidden";
        document.body.appendChild(announcer);

        // Function to make announcements
        window.announceToScreenReader = (message) => {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = "";
            }, 1000);
        };
    }

    static enhanceHighContrastMode() {
        // Detect high contrast mode
        if (window.matchMedia("(prefers-contrast: high)").matches) {
            document.body.classList.add("high-contrast");
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize main generator
    window.secureGenerator = new SecureGenerator();
    
    // Initialize accessibility enhancements
    AccessibilityEnhancements.init();
    
    // Add validation to length field
    const passwordLength = document.getElementById("passwordLength");
    passwordLength.addEventListener("blur", () => {
        Utils.validateNumericInput(passwordLength, 4, 128);
    });
    
    // Show keyboard tips on desktop devices
    if (!Utils.isMobile()) {
        console.log("💡 Keyboard Tips:");
        console.log("Ctrl/Cmd + R: Regenerate password");
        console.log("Ctrl/Cmd + U: Regenerate UUID");
        console.log("Ctrl/Cmd + C: Copy (when field is focused)");
        console.log("↑/↓: Adjust password length (when field is focused)");
    }
    
    // Add support information
    if (!Utils.hasClipboardSupport()) {
        console.warn("⚠️ Clipboard API not supported. Using fallback for copying.");
    }
});

// Export for global use if needed
window.SecureGenerator = SecureGenerator;
window.Utils = Utils;

