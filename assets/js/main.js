/**
 * KEMI HUANG - Personal Website
 * Main JavaScript
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all modules
    initTheme();
    initNavigation();
    initMobileNav();
    initScrollEffects();
    initTypewriter();
    initParticles();
    initQRCode();
    initRevealAnimations();
    initLoader();   /* ← loader after everything is ready */
    initCursor();   /* ← custom cursor */
});

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Navigation - Active Link & Scroll Effect
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function closeMobileNav() {
        mobileNav?.classList.remove('active');
        navToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function toggleMobileNav() {
        mobileNav?.classList.toggle('active');
        const isOpen = mobileNav?.classList.contains('active');
        navToggle.innerHTML = isOpen 
            ? '<i data-lucide="x"></i>' 
            : '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    navToggle?.addEventListener('click', toggleMobileNav);

    // Close mobile nav when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav when clicking outside (on the backdrop/overlay area)
    mobileNav?.addEventListener('click', (e) => {
        // Only close if clicking directly on the mobile-nav (backdrop), not its children
        if (e.target === mobileNav) {
            closeMobileNav();
        }
    });

    // Close mobile nav when clicking anywhere else on the page
    document.addEventListener('click', (e) => {
        if (!mobileNav?.classList.contains('active')) return;
        if (!mobileNav?.contains(e.target) && !navToggle?.contains(e.target)) {
            closeMobileNav();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

/**
 * Scroll Effects - Smooth scroll for anchor links
 */
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Typewriter Effect for Hero Subtitle
 */
function initTypewriter() {
    const typewriterText = document.querySelector('.typewriter-text');
    if (!typewriterText) return;

    const phrases = [
        'AR Designer & Developer',
        'Unity3D Enthusiast',
        'Computer Engineering Master',
        'Cross-border Creative Technologist'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * Particle Background Effect - Gentle Mouse Following
 */
function initParticles() {
    const canvas = document.getElementById('webgl');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    // Particle geometry
    const COUNT   = 1800;
    const geo     = new THREE.BufferGeometry();
    const pos     = new Float32Array(COUNT * 3);
    const col     = new Float32Array(COUNT * 3);

    /* gradient: far = vivid blue, near = vivid purple-pink */
    const FAR_R=0.00, FAR_G=0.25, FAR_B=1.00;
    const NEAR_R=0.95, NEAR_G=0.20, NEAR_B=1.00;

    for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 12;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        const t = (pos[i * 3 + 2] + 3) / 6;   // 0 (far) → 1 (near)
        col[i * 3]     = FAR_R  + (NEAR_R - FAR_R)  * t;
        col[i * 3 + 1] = FAR_G  + (NEAR_G - FAR_G)  * t;
        col[i * 3 + 2] = FAR_B  + (NEAR_B - FAR_B)  * t;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    // Build a soft-circle sprite texture so each star is a proper dot
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sc = spriteCanvas.getContext('2d');
    const grd = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0,   'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.9)');
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    sc.fillStyle = grd;
    sc.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
        size:           0.03,
        map:            spriteTex,
        transparent:    true,
        opacity:        0.6,
        vertexColors:   true,
        sizeAttenuation: true,
        alphaTest:      0.01,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        // Bounded drift (sine never exceeds ±0.08) + mouse-driven offset
        points.rotation.y  = Math.sin(t * 0.18) * 0.08 + mouseX;
        points.rotation.x  = Math.sin(t * 0.11) * 0.05 - mouseY;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) renderer.setAnimationLoop(null);
        else renderer.setAnimationLoop(animate);
    });
}

/**
 * QR Code Generator
 */
function initQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    // Get current URL for QR code
    const url = window.location.href || 'https://kemiii.github.io';

    // Create QR code
    new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark: '#171717',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });
}

/**
 * Reveal Animations on Scroll (Intersection Observer)
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.timeline-item, .portfolio-card, .photo-item, .skill-category, .language-item, .contact-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add stagger delay for grid items
                if (entry.target.classList.contains('photo-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Smooth Page Load
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/**
 * Loader
 */
function initLoader() {
    const loaderEl  = document.getElementById('loader');
    const countEl   = document.getElementById('loaderCount');
    const barEl     = document.getElementById('loaderBar');
    if (!loaderEl || !countEl || !barEl) return;

    let prog = 0;
    const iv = setInterval(() => {
        prog = Math.min(prog + Math.random() * 15 + 3, 100);
        countEl.textContent = Math.floor(prog);
        barEl.style.width   = prog + '%';
        if (prog >= 100) {
            clearInterval(iv);
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(loaderEl, {
                        yPercent: -100,
                        duration: 0.9,
                        ease: 'power3.inOut',
                        onComplete: () => { loaderEl.style.display = 'none'; }
                    });
                } else {
                    loaderEl.style.transition = 'opacity 0.5s';
                    loaderEl.style.opacity    = '0';
                    setTimeout(() => { loaderEl.style.display = 'none'; }, 500);
                }
            }, 200);
        }
    }, 55);
}

/* ─── Custom Cursor ─────────────────────────────────────────── */
function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function animCursor() {
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animCursor);
    })();

    /* hover 放大 */
    const hoverTargets = 'a, button, .work-item, .photo-item, .skill-tag, .nav-link, .theme-toggle, [role="button"]';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

/**
 * Console Easter Egg
 */
console.log('%c KEMI HUANG ', 'background: #7c3aed; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c AR Designer & Developer ', 'background: #8b5cf6; color: white; padding: 5px 10px; border-radius: 3px;');
console.log('Welcome to my personal website! Feel free to explore.');
console.log('GitHub: https://github.com/KeMiii');
console.log('Email: kemi24678@gmail.com');


