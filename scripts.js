/* ========================================
   PROJECT SHOWCASE - INTERACTIVE SCRIPTS
   ======================================== */

// Particle system removed for performance and cleaner presentation

// Scroll Reveal Animation (for other elements)
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.stat-card, .section-header, .about-text');
        this.init();
    }
    
    init() {
        this.elements.forEach(el => el.classList.add('fade-in'));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// Smooth Scroll for Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navbar Scroll Effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.style.background = 'rgba(10, 15, 26, 0.95)';
                this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                this.navbar.style.background = 'rgba(10, 15, 26, 0.8)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Interactive Projects Filtering
class ProjectFilter {
    constructor() {
        this.buttons = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active state
                this.buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                this.cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize interactive scripts
    new ScrollReveal();
    new SmoothScroll();
    new NavbarScroll();
    new ProjectFilter();
    
    console.log('✨ Showcase loaded successfully!');
});

// Add loading transition
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
