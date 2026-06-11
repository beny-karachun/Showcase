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

// Scrolling Animated Road Timeline + Category Filter Integration
class RoadTimeline {
    constructor() {
        this.container = document.querySelector('.road-container');
        if (!this.container) return;
        this.svg = this.container.querySelector('.road-svg');
        this.rows = Array.from(this.container.querySelectorAll('.project-row'));
        this.marker = this.svg.querySelector('.road-marker');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Path elements
        this.paths = {
            bgShoulder: this.svg.querySelector('.road-shoulder-bg'),
            bgTarmac: this.svg.querySelector('.road-tarmac-bg'),
            bgDivider: this.svg.querySelector('.road-divider-bg'),
            activeShoulder: this.svg.querySelector('.road-shoulder-active'),
            activeTarmac: this.svg.querySelector('.road-tarmac-active'),
            activeDivider: this.svg.querySelector('.road-divider-active')
        };
        
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        // Setup filter click listeners
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                if (filter === this.currentFilter) return;
                
                this.currentFilter = filter;
                
                // Toggle active filter button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter rows (add/remove filtered-out class)
                this.rows.forEach(row => {
                    const category = row.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        row.classList.remove('filtered-out');
                    } else {
                        row.classList.add('filtered-out');
                        row.classList.remove('active'); // reset active animation status on hide
                    }
                });
                
                // Rebuild the road geometry for the filtered list of rows
                requestAnimationFrame(() => {
                    this.buildRoad();
                    this.onScroll();
                });
            });
        });
        
        this.buildRoad();
        
        // Global listeners
        window.addEventListener('resize', () => {
            this.buildRoad();
            this.onScroll();
        });
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        
        // Initial draw trigger
        setTimeout(() => this.onScroll(), 100);
    }
    
    buildRoad() {
        const W = this.container.offsetWidth;
        const H = this.container.offsetHeight;
        
        // Update viewBox
        this.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        
        const isMobile = window.innerWidth <= 768;
        const points = [];
        
        // Filter visible rows
        const visibleRows = this.rows.filter(row => !row.classList.contains('filtered-out'));
        
        // Road starts at top center (or top-left on mobile)
        const startX = isMobile ? 40 : W / 2;
        points.push({ x: startX, y: 0 });
        
        // Gather vertical centers for all visible rows
        visibleRows.forEach((row, index) => {
            const rowCenterY = row.offsetTop + row.offsetHeight / 2;
            
            let x;
            if (isMobile) {
                x = 40;
                row.classList.remove('even-row', 'odd-row');
            } else {
                const offset = 60; // road winds 60px left/right
                if (index % 2 === 0) {
                    row.classList.add('even-row');
                    row.classList.remove('odd-row');
                    x = W / 2 - offset;
                } else {
                    row.classList.add('odd-row');
                    row.classList.remove('even-row');
                    x = W / 2 + offset;
                }
                
                // Update connector styles dynamically based on index to toggle correct left/right orientation!
                const connector = row.querySelector('.road-connector');
                if (connector) {
                    if (index % 2 === 0) {
                        connector.style.left = '42%';
                        connector.style.width = '8%';
                        connector.style.transformOrigin = 'right';
                    } else {
                        connector.style.left = '50%';
                        connector.style.width = '8%';
                        connector.style.transformOrigin = 'left';
                    }
                }
            }
            
            points.push({ x, y: rowCenterY });
            row.dataset.centerY = rowCenterY;
        });
        
        // Road ends at bottom center (or bottom-left on mobile)
        const endX = isMobile ? 40 : W / 2;
        points.push({ x: endX, y: H });
        
        // Calculate curve pathing using cubic Bezier spline
        let pathD = '';
        if (points.length > 0) {
            pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const dy = (curr.y - prev.y) / 2;
                
                pathD += ` C ${prev.x} ${prev.y + dy}, ${curr.x} ${curr.y - dy}, ${curr.x} ${curr.y}`;
            }
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
        
        // Draw active road strokes
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
        
        // Trigger active class on visible rows
        const containerScrollTop = -rect.top;
        const triggerY = containerScrollTop + viewportHeight * 0.65;
        
        this.rows.forEach(row => {
            if (row.classList.contains('filtered-out')) return;
            const centerY = parseFloat(row.dataset.centerY || '0');
            // Once activated, we keep it active to avoid blinking and maintain 100% visibility/readability!
            if (triggerY >= centerY) {
                row.classList.add('active');
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize interactive scripts
    new ScrollReveal();
    new SmoothScroll();
    new NavbarScroll();
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
