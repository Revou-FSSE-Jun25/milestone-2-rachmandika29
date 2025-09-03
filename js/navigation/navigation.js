import { CONSTANTS, DOM, Events, Utils } from "../cores/core.js";

/**
 * MobileNavigation class to handle mobile menu functionality
 */
class MobileNavigation {
  constructor() {
    this.isMenuOpen = false;
    this.elements = {};
    this.boundMethods = {};

    this.initializeElements();
    this.bindMethods();
    this.attachEventListeners();
    this.initializeAccessibility();

    Utils.debug("Mobile navigation initialized");
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      mobileMenuButton: DOM.getElementById("mobile-menu-button"),
      mobileMenu: DOM.getElementById("mobile-menu"),
      hamburgerLines: null,
      mobileMenuLinks: null,
    };

    // Get hamburger lines if button exists
    if (this.elements.mobileMenuButton) {
      this.elements.hamburgerLines =
        this.elements.mobileMenuButton.querySelectorAll("span");
    }

    // Get mobile menu links if menu exists
    if (this.elements.mobileMenu) {
      this.elements.mobileMenuLinks =
        this.elements.mobileMenu.querySelectorAll("a");
    }

    // Validate required elements
    if (!this.elements.mobileMenuButton || !this.elements.mobileMenu) {
      Utils.debug(
        "Mobile navigation elements not found - mobile navigation disabled"
      );
      return false;
    }

    return true;
  }

  /**
   * Bind methods to maintain correct 'this' context
   */
  bindMethods() {
    this.boundMethods = {
      toggleMobileMenu: this.toggleMobileMenu.bind(this),
      handleOutsideClick: this.handleOutsideClick.bind(this),
      handleWindowResize: this.handleWindowResize.bind(this),
      handleMenuLinkClick: this.handleMenuLinkClick.bind(this),
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (!this.elements.mobileMenuButton || !this.elements.mobileMenu) {
      return;
    }

    // Mobile menu button click
    Events.addEventListener(
      this.elements.mobileMenuButton,
      "click",
      this.boundMethods.toggleMobileMenu
    );

    // Mobile menu links click
    if (this.elements.mobileMenuLinks) {
      this.elements.mobileMenuLinks.forEach((link) => {
        Events.addEventListener(
          link,
          "click",
          this.boundMethods.handleMenuLinkClick
        );
      });
    }

    // Outside click to close menu
    Events.addEventListener(
      document,
      "click",
      this.boundMethods.handleOutsideClick
    );

    // Window resize handler
    Events.addEventListener(
      window,
      "resize",
      Utils.debounce(this.boundMethods.handleWindowResize, 250)
    );
  }

  /**
   * Initialize accessibility attributes
   */
  initializeAccessibility() {
    if (this.elements.mobileMenuButton) {
      this.elements.mobileMenuButton.setAttribute(
        CONSTANTS.ARIA.EXPANDED,
        "false"
      );
    }
  }

  /**
   * Toggle mobile menu open/closed state
   */
  toggleMobileMenu() {
    if (!this.elements.mobileMenu || !this.elements.mobileMenuButton) {
      return;
    }

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }

    Utils.debug(`Mobile menu ${this.isMenuOpen ? "opened" : "closed"}`);
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    // Show mobile menu
    this.elements.mobileMenu.classList.remove("hidden");
    this.elements.mobileMenu.classList.add("animate-fade-in");

    // Animate hamburger to X
    this.animateHamburgerToX();

    // Update accessibility
    this.elements.mobileMenuButton.setAttribute(
      CONSTANTS.ARIA.EXPANDED,
      "true"
    );

    // Focus management for accessibility
    if (
      this.elements.mobileMenuLinks &&
      this.elements.mobileMenuLinks.length > 0
    ) {
      this.elements.mobileMenuLinks[0].focus();
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    // Hide mobile menu
    this.elements.mobileMenu.classList.add("hidden");
    this.elements.mobileMenu.classList.remove("animate-fade-in");

    // Reset hamburger lines
    this.resetHamburgerLines();

    // Update accessibility
    this.elements.mobileMenuButton.setAttribute(
      CONSTANTS.ARIA.EXPANDED,
      "false"
    );
  }

  /**
   * Animate hamburger lines to X shape
   */
  animateHamburgerToX() {
    if (
      !this.elements.hamburgerLines ||
      this.elements.hamburgerLines.length < 3
    ) {
      return;
    }

    const lines = this.elements.hamburgerLines;
    lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    lines[1].style.opacity = "0";
    lines[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
  }

  /**
   * Reset hamburger lines to original state
   */
  resetHamburgerLines() {
    if (
      !this.elements.hamburgerLines ||
      this.elements.hamburgerLines.length < 3
    ) {
      return;
    }

    const lines = this.elements.hamburgerLines;
    lines[0].style.transform = "none";
    lines[1].style.opacity = "1";
    lines[2].style.transform = "none";
  }

  /**
   * Handle clicks outside the navigation menu
   * @param {Event} event - Click event
   */
  handleOutsideClick(event) {
    if (!this.isMenuOpen) {
      return;
    }

    const isClickInsideNav =
      this.elements.mobileMenuButton.contains(event.target) ||
      this.elements.mobileMenu.contains(event.target);

    if (!isClickInsideNav) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Handle window resize events
   */
  handleWindowResize() {
    // Close mobile menu if window becomes large (desktop size)
    if (window.innerWidth >= CONSTANTS.MOBILE_BREAKPOINT && this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Handle mobile menu link clicks
   */
  handleMenuLinkClick() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Public method to programmatically close menu
   */
  closeMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Public method to programmatically open menu
   */
  openMenu() {
    if (!this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Get current menu state
   * @returns {boolean} - True if menu is open
   */
  isOpen() {
    return this.isMenuOpen;
  }

  /**
   * Destroy navigation instance and clean up event listeners
   */
  destroy() {
    // Remove event listeners
    if (this.elements.mobileMenuButton) {
      Events.removeEventListener(
        this.elements.mobileMenuButton,
        "click",
        this.boundMethods.toggleMobileMenu
      );
    }

    if (this.elements.mobileMenuLinks) {
      this.elements.mobileMenuLinks.forEach((link) => {
        Events.removeEventListener(
          link,
          "click",
          this.boundMethods.handleMenuLinkClick
        );
      });
    }

    Events.removeEventListener(
      document,
      "click",
      this.boundMethods.handleOutsideClick
    );

    Events.removeEventListener(
      window,
      "resize",
      this.boundMethods.handleWindowResize
    );

    // Reset state
    this.isMenuOpen = false;
    this.elements = {};
    this.boundMethods = {};

    Utils.debug("Mobile navigation destroyed");
  }
}

/**
 * Initialize navigation functionality
 * @returns {MobileNavigation|null} - Navigation instance or null if initialization failed
 */
export function initializeNavigation() {
  try {
    const navigation = new MobileNavigation();
    Utils.debug("Navigation module initialized successfully");
    return navigation;
  } catch (error) {
    Utils.debug("Failed to initialize navigation:", error);
    return null;
  }
}

// Export the class for direct usage if needed
export { MobileNavigation };

// Export default for convenience
export default {
  MobileNavigation,
  initializeNavigation,
};
