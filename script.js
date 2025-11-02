// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Check if elements exist before proceeding
    if (!darkModeToggle) {
        console.error('Dark mode toggle button not found');
        return;
    }

    const toggleIcon = darkModeToggle.querySelector('i');
    const toggleText = darkModeToggle.querySelector('span');

    // Check for saved theme or prefer-color-scheme
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });

    // Resources Dropdown Functionality - MOBILE OPTIMIZED
    const resourcesBtn = document.querySelector('.resources-btn');
    const dropdown = document.querySelector('.dropdown-content');

    // Only add dropdown functionality if elements exist
    if (resourcesBtn && dropdown) {
        const resourcesDropdown = resourcesBtn.closest('.resources-dropdown');

        // Set initial state
        dropdown.style.display = 'none';

        // Touch-friendly dropdown toggle
        resourcesBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
        });

        // Close dropdown when touching outside
        document.addEventListener('touchstart', function (e) {
            if (resourcesDropdown && !resourcesDropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        document.addEventListener('click', function (e) {
            if (resourcesDropdown && !resourcesDropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        // Close dropdown after selecting a link (mobile)
        dropdown.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                // Small delay to allow navigation
                setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            }
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Add active state to current page in navigation
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

    // Handle resources dropdown active state
    const resourcesDropdown = document.querySelector('.resources-dropdown');
    if (resourcesDropdown && currentPage === 'resources.html') {
        const resourcesBtn = resourcesDropdown.querySelector('.resources-btn');
        if (resourcesBtn) {
            resourcesBtn.classList.add('active');
        }
    }
});