document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true,    // whether animation should happen only once - while scrolling down
    });

    // Initialize Lucide Icons
    lucide.createIcons();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Function to apply theme (called on load and on toggle)
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        // Re-create icons if they change with the theme
        // (e.g., sun/moon icon itself might need this if not handled by CSS visibility)
        lucide.createIcons(); 
    }

    // Check saved theme in localStorage or system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Language Toggle
    const languageToggle = document.getElementById('language-toggle');
    const currentLangText = document.getElementById('current-lang-text');
    let currentLanguage = localStorage.getItem('language') || 'pt';
    const typedSubtitleElement = document.getElementById('typed-subtitle');
    let typingInterval; 

    const subtitleTexts = {
        pt: typedSubtitleElement.getAttribute('data-lang-pt'),
        en: typedSubtitleElement.getAttribute('data-lang-en')
    };

    function typeEffect(element, text, speed = 100) {
        clearInterval(typingInterval); 
        let charIndex = 0;
        element.innerHTML = ''; 

        function type() {
            if (charIndex < text.length) {
                element.innerHTML = text.substring(0, charIndex + 1) + '<span class="blinking-cursor">|</span>';
                charIndex++;
                typingInterval = setTimeout(type, speed);
            } else {
                element.innerHTML = text; 
            }
        }
        type();
    }

    function updateTexts(lang) {
        document.querySelectorAll('[data-lang-pt]').forEach(el => {
            // Skip the typed element here, it's handled by typeEffect
            if (el.id === 'typed-subtitle') return; 
            
            const translationKey = lang === 'pt' ? 'langPt' : 'langEn';
            if (el.dataset[translationKey]) {
                el.innerText = el.dataset[translationKey];
                if (el.tagName === 'TITLE') document.title = el.dataset[translationKey];
            }
        });
        currentLangText.innerText = lang.toUpperCase();
        htmlElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

        // (Re)start typed effect for the current language
        typeEffect(typedSubtitleElement, lang === 'pt' ? subtitleTexts.pt : subtitleTexts.en);

        // Update tooltips for theme and language toggles
        const themeTooltipBasePt = 'Mudar Tema';
        const themeTooltipBaseEn = 'Change Theme';
        themeToggle.setAttribute('data-tooltip', lang === 'pt' ? themeTooltipBasePt : themeTooltipBaseEn);
        
        const langTooltipBasePt = 'Mudar Idioma (EN)';
        const langTooltipBaseEn = 'Change Language (PT)';
        languageToggle.setAttribute('data-tooltip', lang === 'pt' ? langTooltipBasePt : langTooltipBaseEn);
    }
    
    languageToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
        localStorage.setItem('language', currentLanguage);
        updateTexts(currentLanguage);
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile Menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksMobile = mobileMenu.querySelectorAll('a'); // Corrected selector

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        // Update icon based on menu visibility
        icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
        lucide.createIcons(); // Re-render icons
    });

    // Close mobile menu when a link is clicked
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            // Reset menu icon to 'menu'
            mobileMenuButton.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons(); // Re-render icons
        });
    });

    // Smooth scroll for navbar links
    document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initial text setup based on current language
    updateTexts(currentLanguage); 
});