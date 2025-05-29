// Aguarda o DOM (Document Object Model) ser completamente carregado e parseado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializa a biblioteca AOS (Animate On Scroll) para animações ao rolar a página
    AOS.init({
        duration: 800, // Duração da animação em milissegundos
        once: true,    // Define se a animação deve ocorrer apenas uma vez (ao rolar para baixo)
    });

    // Renderiza os ícones da biblioteca Lucide que estão no HTML (ex: <i data-lucide="nome-do-icone"></i>)
    lucide.createIcons();

    // --- LÓGICA DE ALTERNÂNCIA DE TEMA (CLARO/ESCURO) ---
    const themeToggle = document.getElementById('theme-toggle'); // Botão de alternância de tema
    const htmlElement = document.documentElement; // Elemento <html> para aplicar a classe 'dark'

    // Função para aplicar o tema (claro ou escuro) na página
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark'); // Adiciona a classe 'dark' para ativar estilos do tema escuro
        } else {
            htmlElement.classList.remove('dark'); // Remove a classe 'dark' para usar estilos do tema claro
        }
        // Re-renderiza os ícones Lucide, pois alguns (como sol/lua) podem mudar com o tema
        lucide.createIcons(); 
    }

    // Verifica se há um tema salvo no localStorage ou usa a preferência do sistema operacional
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) { // Se não houver tema salvo no localStorage
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; // Verifica preferência do SO
    }
    applyTheme(currentTheme); // Aplica o tema determinado
    
    // Event listener para o clique no botão de alternância de tema
    themeToggle.addEventListener('click', () => {
        // Determina o novo tema baseado na presença da classe 'dark'
        const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme); // Aplica o novo tema
        localStorage.setItem('theme', newTheme); // Salva a preferência de tema no localStorage
    });
    
    // --- LÓGICA DE ALTERNÂNCIA DE IDIOMA ---
    const languageToggle = document.getElementById('language-toggle'); // Botão de alternância de idioma
    const currentLangText = document.getElementById('current-lang-text'); // Span que exibe o idioma atual (PT/EN)
    let currentLanguage = localStorage.getItem('language') || 'pt'; // Pega idioma salvo ou usa 'pt' como padrão
    
    const typedSubtitleElement = document.getElementById('typed-subtitle'); // Elemento h2 para o efeito de digitação
    let typingInterval; // Variável para controlar o intervalo da animação de digitação

    // Textos para o subtítulo com efeito de digitação, baseados nos atributos data-lang do HTML
    const subtitleTexts = {
        pt: typedSubtitleElement.getAttribute('data-lang-pt'),
        en: typedSubtitleElement.getAttribute('data-lang-en')
    };

    // Função para o efeito de digitação
    function typeEffect(element, text, speed = 100) {
        clearInterval(typingInterval); // Limpa qualquer animação de digitação anterior para evitar sobreposição
        let charIndex = 0; // Índice do caractere atual a ser digitado
        element.innerHTML = ''; // Limpa o conteúdo do elemento antes de começar a digitar

        function type() {
            if (charIndex < text.length) { // Se ainda houver caracteres para digitar
                // Adiciona o próximo caractere e o cursor piscante
                element.innerHTML = text.substring(0, charIndex + 1) + '<span class="blinking-cursor">|</span>';
                charIndex++;
                typingInterval = setTimeout(type, speed); // Agenda a digitação do próximo caractere
            } else {
                element.innerHTML = text; // Remove o cursor quando a digitação terminar
            }
        }
        type(); // Inicia a função de digitação
    }

    // Função para atualizar todos os textos da página com base no idioma selecionado
    function updateTexts(lang) {
        // Itera sobre todos os elementos que têm o atributo 'data-lang-pt'
        document.querySelectorAll('[data-lang-pt]').forEach(el => {
            // O elemento do subtítulo com efeito de digitação é tratado separadamente pela função typeEffect
            if (el.id === 'typed-subtitle') return; 
            
            // Determina qual atributo data-lang usar (pt ou en)
            const translationKey = lang === 'pt' ? 'langPt' : 'langEn';
            if (el.dataset[translationKey]) { // Verifica se a tradução para o idioma existe
                el.innerText = el.dataset[translationKey]; // Atualiza o texto do elemento
                // Se o elemento for o <title> da página, atualiza o título da aba do navegador
                if (el.tagName === 'TITLE') document.title = el.dataset[translationKey];
            }
        });
        currentLangText.innerText = lang.toUpperCase(); // Atualiza o indicador de idioma (PT/EN)
        htmlElement.lang = lang === 'pt' ? 'pt-BR' : 'en'; // Define o atributo 'lang' do elemento <html>

        // (Re)inicia o efeito de digitação para o subtítulo com o texto do idioma correto
        typeEffect(typedSubtitleElement, lang === 'pt' ? subtitleTexts.pt : subtitleTexts.en);

        // Atualiza os textos dos tooltips dos botões de tema e idioma
        const themeTooltipBasePt = 'Mudar Tema';
        const themeTooltipBaseEn = 'Change Theme';
        themeToggle.setAttribute('data-tooltip', lang === 'pt' ? themeTooltipBasePt : themeTooltipBaseEn);
        
        const langTooltipBasePt = 'Mudar Idioma (EN)';
        const langTooltipBaseEn = 'Change Language (PT)';
        languageToggle.setAttribute('data-tooltip', lang === 'pt' ? langTooltipBasePt : langTooltipBaseEn);
    }
    
    // Event listener para o clique no botão de alternância de idioma
    languageToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt'; // Alterna o idioma
        localStorage.setItem('language', currentLanguage); // Salva a preferência no localStorage
        updateTexts(currentLanguage); // Atualiza os textos na página
    });

    // Define o ano atual no rodapé
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- LÓGICA DO MENU MOBILE ---
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // Botão para abrir/fechar menu mobile
    const mobileMenu = document.getElementById('mobile-menu'); // O contêiner do menu mobile
    const navLinksMobile = mobileMenu.querySelectorAll('a'); // Links dentro do menu mobile

    // Event listener para o clique no botão do menu mobile
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden'); // Alterna a visibilidade do menu
        const icon = mobileMenuButton.querySelector('i'); // Pega o elemento do ícone
        // Muda o ícone (menu/fechar) com base na visibilidade do menu
        icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
        lucide.createIcons(); // Re-renderiza os ícones Lucide
    });

    // Event listener para fechar o menu mobile ao clicar em um link dentro dele
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden'); // Esconde o menu
            // Reseta o ícone do botão para 'menu'
            mobileMenuButton.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons(); // Re-renderiza os ícones Lucide
        });
    });

    // --- LÓGICA DE ROLAGEM SUAVE PARA LINKS INTERNOS DA NAVBAR ---
    document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão do link (salto instantâneo)
            const targetElement = document.querySelector(this.getAttribute('href')); // Encontra o elemento alvo
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); // Rola suavemente até o elemento
            }
        });
    });
    
    // Chama a função para configurar os textos iniciais da página com base no idioma salvo/padrão
    updateTexts(currentLanguage); 
});