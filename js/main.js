// Hamburger Menu Navigation Button
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = mobileMenuButton.querySelectorAll('span');
    
    let isMenuOpen = false;
    
    // Toggle mobile menu function
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Show mobile menu
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('animate-fade-in');
            
            // Animate hamburger to X
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            
            // Add aria-expanded for accessibility
            mobileMenuButton.setAttribute('aria-expanded', 'true');
        } else {
            // Hide mobile menu
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('animate-fade-in');
            
            // Reset hamburger lines
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
            
            // Update aria-expanded for accessibility
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Add click event listener to mobile menu button
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on menu links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mobileMenuButton.contains(event.target) || mobileMenu.contains(event.target);
        
        if (!isClickInsideNav && isMenuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Handle window resize - close mobile menu if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && isMenuOpen) { // 768px is md breakpoint
            toggleMobileMenu();
        }
    });
    
    // Initialize aria-expanded attribute
    mobileMenuButton.setAttribute('aria-expanded', 'false');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
