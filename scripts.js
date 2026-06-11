/* ========================================
   PROJECT SHOWCASE - INTERACTIVE SCRIPTS
   ======================================== */

// Particle Animation System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

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

// Card Tilt Effect
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// Scrolling Animated Road Timeline
class RoadTimeline {
    constructor() {
        this.container = document.querySelector('.road-container');
        if (!this.container) return;
        this.svg = this.container.querySelector('.road-svg');
        this.rows = Array.from(this.container.querySelectorAll('.project-row'));
        this.marker = this.svg.querySelector('.road-marker');
        
        // Path elements
        this.paths = {
            bgShoulder: this.svg.querySelector('.road-shoulder-bg'),
            bgTarmac: this.svg.querySelector('.road-tarmac-bg'),
            bgDivider: this.svg.querySelector('.road-divider-bg'),
            activeShoulder: this.svg.querySelector('.road-shoulder-active'),
            activeTarmac: this.svg.querySelector('.road-tarmac-active'),
            activeDivider: this.svg.querySelector('.road-divider-active')
        };
        
        this.init();
    }
    
    init() {
        this.buildRoad();
        
        // Listeners for drawing road and handling resize recalculations
        window.addEventListener('resize', () => {
            this.buildRoad();
            this.onScroll();
        });
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        
        // Run once on startup
        setTimeout(() => this.onScroll(), 100);
    }
    
    buildRoad() {
        const W = this.container.offsetWidth;
        const H = this.container.offsetHeight;
        
        // Set viewBox for scaling
        this.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        
        const isMobile = window.innerWidth <= 768;
        const points = [];
        
        // Road starts at top center (or top-left on mobile)
        const startX = isMobile ? 40 : W / 2;
        points.push({ x: startX, y: 0 });
        
        // Gather vertical centers for all rows
        this.rows.forEach(row => {
            const rowCenterY = row.offsetTop + row.offsetHeight / 2;
            
            let x;
            if (isMobile) {
                x = 40;
            } else {
                const index = parseInt(row.getAttribute('data-index'), 10);
                const offset = 60; // road winds 60px left/right
                x = (index % 2 === 0) ? (W / 2 - offset) : (W / 2 + offset);
            }
            
            points.push({ x, y: rowCenterY });
            row.dataset.centerY = rowCenterY;
        });
        
        // Road ends at bottom center (or bottom-left on mobile)
        const endX = isMobile ? 40 : W / 2;
        points.push({ x: endX, y: H });
        
        // Calculate curve pathing using cubic Bezier spline
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const dy = (curr.y - prev.y) / 2;
            
            pathD += ` C ${prev.x} ${prev.y + dy}, ${curr.x} ${curr.y - dy}, ${curr.x} ${curr.y}`;
        }
        
        // Update SVG paths
        Object.values(this.paths).forEach(path => {
            if (path) path.setAttribute('d', pathD);
        });
        
        // Calculate dimensions for scroll percentage calculation
        if (this.paths.activeTarmac) {
            this.pathLength = this.paths.activeTarmac.getTotalLength();
            
            // Set dash properties on building overlays
            const activePaths = [
                this.paths.activeShoulder,
                this.paths.activeTarmac,
                this.paths.activeDivider
            ];
            
            activePaths.forEach(path => {
                if (path) {
                    path.style.strokeDasharray = this.pathLength;
                    path.style.strokeDashoffset = this.pathLength;
                }
            });
        }
    }
    
    onScroll() {
        if (!this.pathLength) return;
        
        const rect = this.container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress relative to the container
        let progress = 0;
        const totalHeight = rect.height;
        const topThreshold = viewportHeight * 0.75;
        const bottomThreshold = viewportHeight * 0.25;
        
        if (rect.top <= topThreshold) {
            const scrolled = topThreshold - rect.top;
            const scrollableRange = totalHeight + topThreshold - bottomThreshold;
            progress = scrolled / scrollableRange;
        }
        progress = Math.max(0, Math.min(1, progress));
        
        const drawLength = this.pathLength * progress;
        
        // Draw the active road strokes
        const activePaths = [
            this.paths.activeShoulder,
            this.paths.activeTarmac,
            this.paths.activeDivider
        ];
        
        activePaths.forEach(path => {
            if (path) {
                path.style.strokeDashoffset = this.pathLength - drawLength;
            }
        });
        
        // Animate the vehicle/spark marker along the road
        if (this.marker && this.paths.activeTarmac) {
            if (drawLength > 0 && progress < 1) {
                this.marker.style.opacity = '1';
                const point = this.paths.activeTarmac.getPointAtLength(drawLength);
                
                // Rotation tangent calculation
                const nextDist = Math.min(this.pathLength, drawLength + 2);
                const nextPoint = this.paths.activeTarmac.getPointAtLength(nextDist);
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                
                this.marker.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle - 90})`);
            } else if (progress >= 1) {
                const point = this.paths.activeTarmac.getPointAtLength(this.pathLength);
                this.marker.setAttribute('transform', `translate(${point.x}, ${point.y})`);
                this.marker.style.opacity = '1';
            } else {
                this.marker.style.opacity = '0';
            }
        }
        
        // Trigger active slide-in & scale state on project cards
        const containerScrollTop = -rect.top;
        const triggerY = containerScrollTop + viewportHeight * 0.65;
        
        this.rows.forEach(row => {
            const centerY = parseFloat(row.dataset.centerY || '0');
            if (triggerY >= centerY) {
                row.classList.add('active');
            } else {
                row.classList.remove('active');
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Initialize interactive scripts
    new ScrollReveal();
    new SmoothScroll();
    new NavbarScroll();
    new CardTilt();
    new RoadTimeline();
    
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
