// Salafi Search - Main JavaScript
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // DARK MODE TOGGLE
    // ========================================
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (!darkModeToggle) {
        console.error('Dark mode toggle button not found');
        return;
    }

    const toggleIcon = darkModeToggle.querySelector('i');
    const toggleText = darkModeToggle.querySelector('span');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-sun';
        if (toggleText) toggleText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-moon';
        if (toggleText) toggleText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    function setupMobileNav() {
        // Remove existing mobile menu if any
        const existingMenu = document.querySelector('.mobile-menu');
        if (existingMenu) existingMenu.remove();

        if (window.innerWidth <= 768 && navContainer && navLinks) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation');

            // Insert at the beginning of nav-container
            navContainer.insertBefore(menuToggle, navContainer.firstChild);

            menuToggle.addEventListener('click', function () {
                navLinks.classList.toggle('mobile-open');
                const icon = this.querySelector('i');
                if (navLinks.classList.contains('mobile-open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-open');
                    const menuBtn = document.querySelector('.mobile-menu');
                    if (menuBtn) {
                        menuBtn.querySelector('i').className = 'fas fa-bars';
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function (e) {
                const menuBtn = document.querySelector('.mobile-menu');
                if (menuBtn && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                    navLinks.classList.remove('mobile-open');
                    menuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });

            // Make resources dropdown work on mobile
            const resourcesBtn = document.querySelector('.resources-btn');
            const resourcesDropdown = document.querySelector('.resources-dropdown');

            if (resourcesBtn && resourcesDropdown) {
                resourcesBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    resourcesDropdown.classList.toggle('active');
                });
            }
        }
    }

    // Initial setup
    setupMobileNav();

    // Re-setup on resize
    window.addEventListener('resize', function () {
        setupMobileNav();
    });

    // ========================================
    // RESOURCES TABS
    // ========================================
    const tabLinks = document.querySelectorAll('.tab-link');
    const resourceSections = document.querySelectorAll('.resource-section');

    if (tabLinks.length > 0) {
        const hash = window.location.hash;
        if (hash) {
            switchTab(hash.substring(1));
        }

        tabLinks.forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                switchTab(target);
                history.pushState(null, null, `#${target}`);
            });
        });

        function switchTab(target) {
            tabLinks.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('href') === `#${target}`) {
                    tab.classList.add('active');
                }
            });

            resourceSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        }

        window.addEventListener('popstate', function () {
            const hash = window.location.hash.substring(1);
            if (hash) {
                switchTab(hash);
            }
        });
    }

    // ========================================
    // ACTIVE NAVIGATION
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link');

    allNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '#')) ||
            (currentPage === 'resources.html' && linkPage.includes('resources.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ========================================
    // SYSTEM THEME LISTENER
    // ========================================
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            if (!submitBtn) return;

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully.');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                alert('Oops! There was a problem sending your message. Please try again.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // POPULAR SEARCHES
    // ========================================
    const popularItems = document.querySelectorAll('.popular-search-item');

    popularItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const searchTerm = this.getAttribute('data-search');

            // Find the Google CSE input and set its value
            const gscInput = document.querySelector('.gsc-input input');
            if (gscInput) {
                gscInput.value = searchTerm;
                gscInput.focus();

                // Try to trigger the search
                const searchButton = document.querySelector('.gsc-search-button-v2');
                if (searchButton) {
                    setTimeout(() => {
                        searchButton.click();
                    }, 300);
                }

                // Scroll to search bar
                const searchContainer = document.querySelector('.gcse-search');
                if (searchContainer) {
                    searchContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
    // ========================================
    // MOBILE BOTTOM NAV - ACTIVE LINK
    // ========================================
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    const currentPageName = window.location.pathname.split('/').pop() || 'index.html';

    bottomNavLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPageName ||
            (currentPageName === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});
