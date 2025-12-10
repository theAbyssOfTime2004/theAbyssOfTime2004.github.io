/* ============================================
   THEABYSSOFTIME PORTFOLIO
   Main JavaScript
   ============================================ */

(function() {
    'use strict';

    /* --------------------------------------------
       1. THEME TOGGLE
       -------------------------------------------- */

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        function updateThemeIcon(isDark) {
            themeToggle.innerHTML = isDark 
                ? '<span class="theme-icon">🌙</span><span>Dark</span>' 
                : '<span class="theme-icon">☀️</span><span>Light</span>';
        }

        // Get current theme
        let currentTheme = localStorage.getItem('theme') || 
            (prefersDarkScheme.matches ? 'dark' : 'light');

        // Apply theme
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcon(false);
        } else {
            document.body.classList.remove('light-theme');
            updateThemeIcon(true);
        }

        // Toggle handler
        themeToggle.addEventListener('click', () => {
            const isNowLight = document.body.classList.toggle('light-theme');
            updateThemeIcon(!isNowLight);
            localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
        });
    }

    /* --------------------------------------------
       2. CODE RAIN EFFECT (Splash Page)
       -------------------------------------------- */

    function initCodeRain() {
        const codeRain = document.querySelector('.code-rain');
        if (!codeRain) return;

        const codeChars = ['0', '1', '{', '}', '<', '>', '/', '=', '+', '-', '*', '(', ')', ';', 'λ', 'π', '∑', '∫'];
        const columnCount = Math.floor(window.innerWidth / 20);

        for (let i = 0; i < columnCount; i++) {
            createCodeColumn(codeRain, codeChars, i);
        }
    }

    function createCodeColumn(container, chars, index) {
        const span = document.createElement('span');
        span.style.left = `${index * 20}px`;
        span.style.animationDuration = `${Math.random() * 5 + 3}s`;
        span.style.animationDelay = `${Math.random() * 5}s`;
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        container.appendChild(span);
    }

    /* --------------------------------------------
       3. TYPING EFFECT
       -------------------------------------------- */

    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = ['Data Scientist', 'ML Engineer', 'AI Developer', 'Full-stack Dev'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                typingSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    /* --------------------------------------------
       4. PAGE TRANSITIONS
       -------------------------------------------- */

    function initPageTransitions() {
        const enterBtn = document.getElementById('enterBtn');
        
        if (enterBtn) {
            enterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(function() {
                    window.location.href = targetUrl;
                }, 300);
            });
        }

        // Handle internal navigation links with smooth transition
        const internalLinks = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
        
        internalLinks.forEach(function(link) {
            if (link.id === 'enterBtn') return;
            
            link.addEventListener('click', function(e) {
                // Don't prevent default for external links
                if (this.hostname !== window.location.hostname) return;
                
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.2s ease';
                
                setTimeout(function() {
                    window.location.href = targetUrl;
                }, 200);
            });
        });
    }

    /* --------------------------------------------
       5. INTERSECTION OBSERVER FOR ANIMATIONS
       -------------------------------------------- */

    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .project-card, .info-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /* --------------------------------------------
       6. ACTIVE NAV LINK HIGHLIGHTING
       -------------------------------------------- */

    function initActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove active class first
            link.classList.remove('active');
            
            // Determine which page this link points to
            let isProjectsLink = false;
            let isBlogLink = false;
            let isAboutLink = false;
            
            // Check href to determine link type
            if (href.includes('Projects') && !href.includes('Blog')) {
                isProjectsLink = true;
            } else if (href.includes('Blog') && !href.includes('Projects')) {
                isBlogLink = true;
            } else if (href.includes('about.html')) {
                isAboutLink = true;
            } else if (href === 'index.html' || href.endsWith('/index.html')) {
                // For index.html, check the current path to determine which section
                if (currentPath.includes('/Projects/')) {
                    isProjectsLink = true;
                } else if (currentPath.includes('/Blog/')) {
                    isBlogLink = true;
                }
            }
            
            // Check if current path matches the link
            if (isAboutLink) {
                if (currentPath.endsWith('/about.html') || currentPath.endsWith('about.html')) {
                    link.classList.add('active');
                }
            } else if (isProjectsLink) {
                // Check if we're in Projects directory (but not Blog)
                if (currentPath.includes('/Projects/') || currentPath.match(/\/Projects(\/|$)/)) {
                    if (!currentPath.includes('/Blog/')) {
                        link.classList.add('active');
                    }
                }
            } else if (isBlogLink) {
                // Check if we're in Blog directory (but not Projects)
                if (currentPath.includes('/Blog/') || currentPath.match(/\/Blog(\/|$)/)) {
                    if (!currentPath.includes('/Projects/')) {
                        link.classList.add('active');
                    }
                }
            }
        });
    }

    /* --------------------------------------------
       7. SKILL TAG HOVER EFFECTS
       -------------------------------------------- */

    function initSkillTags() {
        const skillTags = document.querySelectorAll('.skill-tag, .tech-tag, .tool-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    /* --------------------------------------------
       8. CONSOLE EASTER EGG
       -------------------------------------------- */

    function initConsoleMessage() {
        console.log('%c👋 Hello, Developer!', 'font-size: 24px; font-weight: bold; color: #58a6ff;');
        console.log('%cWelcome to TheAbyssOfTime\'s Portfolio', 'font-size: 14px; color: #8b949e;');
        console.log('%cInterested in AI/ML, Data Science, and Full-stack Development', 'font-size: 12px; color: #6e7681;');
        console.log('%c📧 Contact: maidang.forwork@gmail.com', 'font-size: 12px; color: #3fb950;');
    }

    /* --------------------------------------------
       9. MOBILE MENU TOGGLE
       -------------------------------------------- */

    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (!menuToggle || !sidebar) return;
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });
    }

    /* --------------------------------------------
       10. GITHUB STATS (Optional - requires API)
       -------------------------------------------- */

    async function fetchGitHubStats() {
        const statsContainer = document.querySelector('.github-stats');
        if (!statsContainer) return;

        const username = 'theAbyssOfTime2004';
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            
            const reposCount = document.querySelector('.repos-count');
            const followersCount = document.querySelector('.followers-count');
            
            if (reposCount) reposCount.textContent = data.public_repos;
            if (followersCount) followersCount.textContent = data.followers;
        } catch (error) {
            console.log('Could not fetch GitHub stats:', error);
        }
    }

    /* --------------------------------------------
       INITIALIZE ALL FUNCTIONS
       -------------------------------------------- */

    document.addEventListener('DOMContentLoaded', function() {
        // Apply saved theme immediately
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Initialize all modules
        initThemeToggle();
        initCodeRain();
        initTypingEffect();
        initPageTransitions();
        initScrollAnimations();
        initActiveNavLink();
        initSkillTags();
        initConsoleMessage();
        initMobileMenu();
        
        // Fade in page
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    });

    // Handle visibility for animations
    document.addEventListener('DOMContentLoaded', function() {
        // Make animated elements visible after they animate
        const style = document.createElement('style');
        style.textContent = '.visible { opacity: 1 !important; }';
        document.head.appendChild(style);
    });

})();
