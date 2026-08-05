// Mobile-Optimized JavaScript - Desktop remains unchanged
document.addEventListener('DOMContentLoaded', function () {
    // Your existing dark mode code - KEEP AS IS
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

    // === MOBILE-ONLY ENHANCEMENTS ===
    if (window.innerWidth <= 768) {
        initMobileDropdown();
        initMobileNavigation();
    }

    // Your existing resources tabs code - KEEP AS IS
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

    // Your existing active navigation code - KEEP AS IS
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '#')) ||
            (currentPage === 'resources.html' && linkPage.includes('resources.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const resourcesDropdown = document.querySelector('.resources-dropdown');
    if (resourcesDropdown && currentPage === 'resources.html') {
        const resourcesBtn = resourcesDropdown.querySelector('.resources-btn');
        if (resourcesBtn) {
            resourcesBtn.classList.add('active');
        }
    }

    // System theme listener - KEEP AS IS
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
});

// Mobile-only functions
function initMobileDropdown() {
    const resourcesBtn = document.querySelector('.resources-btn');
    const dropdown = document.querySelector('.dropdown-content');

    if (resourcesBtn && dropdown) {
        // Hide dropdown by default on mobile
        dropdown.style.display = 'none';

        resourcesBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!resourcesBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        // Close dropdown after link click
        dropdown.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            }
        });
    }
}

function initMobileNavigation() {
    // Add touch-friendly improvements
    const allButtons = document.querySelectorAll('button, a, .resource-link, .tab-link');

    allButtons.forEach(button => {
        button.style.cursor = 'pointer';
    });
}
