document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (if needed)
    const createMobileMenu = () => {
        const nav = document.querySelector('nav');
        const menuItems = document.querySelector('.menu');
        
        // Only proceed if we have navigation
        if (!nav || !menuItems) return;
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle Menu');
        
        // Insert button before menu
        nav.insertBefore(mobileMenuBtn, menuItems);
        
        // Toggle menu on click
        mobileMenuBtn.addEventListener('click', function() {
            menuItems.classList.toggle('show');
            this.classList.toggle('active');
        });
        
        // Add necessary styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .menu {
                    display: none;
                    width: 100%;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem 0;
                }
                
                .menu.show {
                    display: flex;
                }
                
                .mobile-menu-btn {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 30px;
                    height: 21px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                }
                
                .mobile-menu-btn span {
                    display: block;
                    width: 100%;
                    height: 3px;
                    background-color: #333;
                    border-radius: 3px;
                    transition: all 0.3s;
                }
                
                .mobile-menu-btn.active span:nth-child(1) {
                    transform: translateY(9px) rotate(45deg);
                }
                
                .mobile-menu-btn.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-btn.active span:nth-child(3) {
                    transform: translateY(-9px) rotate(-45deg);
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Check if we're on mobile and create menu if needed
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
            createMobileMenu();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
