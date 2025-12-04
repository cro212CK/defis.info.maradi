// script.js
document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // VARIABLES GLOBALES
    // ===========================================
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentYear = new Date().getFullYear();
    
    // ===========================================
    // 1. NAVIGATION & HEADER
    // ===========================================
    
    // Menu mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.backgroundColor = 'rgba(26, 29, 46, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(26, 29, 46, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Navigation active state
        updateActiveNavLink();
    });
    
    // Active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ===========================================
    // 2. ANIMATIONS HERO SECTION
    // ===========================================
    
    // Typing effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['d\'Excellence', 'Professionnelle', 'Certifiée', 'Innovante'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeEffect() {
            if (isPaused) {
                setTimeout(typeEffect, 1000);
                return;
            }
            
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            typingText.textContent = currentWord.substring(0, charIndex);
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500; // Pause at end
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeEffect();
                }, typeSpeed);
                return;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        // Start typing effect
        setTimeout(typeEffect, 1000);
    }
    
    // Animated counters
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Animate stats when in viewport
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    animateCounter(counter, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // ===========================================
    // 3. GESTION DES ONGLETS FORMATIONS
    // ===========================================
    const formationTabs = document.querySelectorAll('#formations .category-tab');
    const formationGrids = document.querySelectorAll('#formations .formations-grid');
    
    // Initialiser les grids par catégorie
    function initializeFormationGrids() {
        const allFormations = document.querySelectorAll('#toutes .formation-card');
        
        // Pour chaque catégorie, filtrer les formations
        formationGrids.forEach(grid => {
            if (grid.id !== 'toutes') {
                grid.innerHTML = '';
                const category = grid.id;
                
                allFormations.forEach(card => {
                    if (card.dataset.category === category) {
                        const clone = card.cloneNode(true);
                        grid.appendChild(clone);
                    }
                });
            }
        });
    }
    
    // Gérer le clic sur les onglets de formations
    formationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            formationTabs.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active à l'onglet cliqué
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            // Cacher toutes les grids d'abord
            formationGrids.forEach(grid => {
                grid.classList.remove('active');
                grid.style.display = 'none';
            });
            
            // Afficher la grid correspondante
            const targetGrid = document.querySelector(`#formations #${category}`);
            if (targetGrid) {
                targetGrid.classList.add('active');
                targetGrid.style.display = 'flex';
                
                // Animer les cartes
                setTimeout(() => {
                    const cards = targetGrid.querySelectorAll('.formation-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 10);
            }
            
            // Réinitialiser la position de défilement
            const scrollWrapper = document.querySelector('#formations .scroll-wrapper');
            if (scrollWrapper) {
                scrollWrapper.scrollLeft = 0;
            }
        });
    });
    
    // Initialiser les grids de formations
    initializeFormationGrids();
    
    // ===========================================
    // 4. GESTION DES ONGLETS BOUTIQUE
    // ===========================================
    const boutiqueTabs = document.querySelectorAll('#boutique .category-tab');
    const boutiqueGrids = document.querySelectorAll('#boutique .boutique-grid');
    
    boutiqueTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            boutiqueTabs.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active à l'onglet cliqué
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            // Cacher toutes les grids d'abord
            boutiqueGrids.forEach(grid => {
                grid.classList.remove('active');
                grid.style.display = 'none';
            });
            
            // Afficher la grid correspondante
            const targetGrid = document.querySelector(`#boutique #${category}`);
            if (targetGrid) {
                targetGrid.classList.add('active');
                targetGrid.style.display = 'flex';
                
                // Animer les cartes
                setTimeout(() => {
                    const cards = targetGrid.querySelectorAll('.product-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 10);
            }
            
            // Réinitialiser la position de défilement
            const scrollWrapper = document.querySelector('#boutique .scroll-wrapper');
            if (scrollWrapper) {
                scrollWrapper.scrollLeft = 0;
            }
        });
    });
    
    // ===========================================
    // 5. DÉFILEMENT HORIZONTAL AVEC 3 CARTES VISIBLES
    // ===========================================
    const horizontalContainers = document.querySelectorAll('.horizontal-scroll-container');
    
    horizontalContainers.forEach(container => {
        const scrollWrapper = container.querySelector('.scroll-wrapper');
        const scrollNavPrev = container.querySelector('.scroll-nav.prev');
        const scrollNavNext = container.querySelector('.scroll-nav.next');
        
        if (scrollNavPrev && scrollNavNext) {
            // Déterminer la largeur de défilement en fonction de la section
            let scrollAmount = 300; // valeur par défaut
            
            if (container.closest('#formations')) {
                scrollAmount = 320 + 16; // card width + gap
            } else if (container.closest('#boutique')) {
                scrollAmount = 280 + 16; // card width + gap
            } else if (container.closest('#services')) {
                scrollAmount = 300 + 16;
            } else if (container.closest('#equipe')) {
                scrollAmount = 280 + 16;
            }
            
            scrollNavPrev.addEventListener('click', () => {
                scrollWrapper.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            scrollNavNext.addEventListener('click', () => {
                scrollWrapper.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }
        
        // Hide/show navigation buttons based on scroll position
        if (scrollWrapper) {
            scrollWrapper.addEventListener('scroll', () => {
                const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
                
                if (scrollNavPrev) {
                    scrollNavPrev.style.opacity = scrollWrapper.scrollLeft > 0 ? '1' : '0.5';
                    scrollNavPrev.style.pointerEvents = scrollWrapper.scrollLeft > 0 ? 'auto' : 'none';
                }
                
                if (scrollNavNext) {
                    scrollNavNext.style.opacity = scrollWrapper.scrollLeft < maxScroll ? '1' : '0.5';
                    scrollNavNext.style.pointerEvents = scrollWrapper.scrollLeft < maxScroll ? 'auto' : 'none';
                }
            });
            
            // Trigger initial state
            setTimeout(() => {
                scrollWrapper.dispatchEvent(new Event('scroll'));
            }, 100);
        }
    });
    
    // ===========================================
    // 6. FORMULAIRE DE CONTACT
    // ===========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.style.borderColor = 'var(--danger-color)';
                    field.style.animation = 'shake 0.5s';
                } else {
                    field.style.borderColor = '';
                    field.style.animation = '';
                }
            });
            
            // Email validation
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                    emailField.style.borderColor = 'var(--danger-color)';
                    emailField.style.animation = 'shake 0.5s';
                }
            }
            
            if (!isValid) {
                showNotification('Veuillez remplir correctement tous les champs obligatoires', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll to top of form
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 2000);
        });
        
        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: var(--danger-color) !important;
                animation: shake 0.5s;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Add notification styles dynamically
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(26, 29, 46, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--border-radius-md);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            box-shadow: var(--shadow-lg);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification.error {
            border-left: 4px solid var(--danger-color);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.25rem;
        }
        
        .notification.success .notification-content i {
            color: var(--success-color);
        }
        
        .notification.error .notification-content i {
            color: var(--danger-color);
        }
        
        .notification-content span {
            color: white;
            font-size: 0.875rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 0.25rem;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: white;
        }
        
        @media (max-width: 768px) {
            .notification {
                top: auto;
                bottom: 20px;
                left: 20px;
                right: 20px;
                max-width: none;
                transform: translateY(100px);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // ===========================================
    // 7. NEWSLETTER FORM
    // ===========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                emailInput.style.borderColor = 'var(--danger-color)';
                showNotification('Veuillez entrer une adresse email valide', 'error');
                return;
            }
            
            // Simulate subscription
            const button = this.querySelector('button');
            const originalHtml = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            setTimeout(() => {
                showNotification('Merci pour votre inscription à notre newsletter!', 'success');
                emailInput.value = '';
                button.innerHTML = originalHtml;
                button.disabled = false;
                emailInput.style.borderColor = '';
            }, 1500);
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===========================================
    // 8. ANIMATIONS AU SCROLL
    // ===========================================
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe cards for animation
    document.querySelectorAll('.formation-card, .service-card, .product-card, .team-card, .testimonial-card').forEach(card => {
        animateOnScroll.observe(card);
    });
    
    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        animateOnScroll.observe(header);
    });
    
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .formation-card,
        .service-card,
        .product-card,
        .team-card,
        .testimonial-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .formation-card.animate-in,
        .service-card.animate-in,
        .product-card.animate-in,
        .team-card.animate-in,
        .testimonial-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .section-header {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .section-header.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Staggered animation for cards in grid */
        .cards-grid .formation-card:nth-child(1),
        .cards-grid .service-card:nth-child(1),
        .cards-grid .product-card:nth-child(1),
        .cards-grid .team-card:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .cards-grid .formation-card:nth-child(2),
        .cards-grid .service-card:nth-child(2),
        .cards-grid .product-card:nth-child(2),
        .cards-grid .team-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .cards-grid .formation-card:nth-child(3),
        .cards-grid .service-card:nth-child(3),
        .cards-grid .product-card:nth-child(3),
        .cards-grid .team-card:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .testimonials-grid .testimonial-card:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .testimonials-grid .testimonial-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .testimonials-grid .testimonial-card:nth-child(3) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(animationStyles);
    
    // ===========================================
    // 9. MISE À JOUR DU COPYRIGHT
    // ===========================================
    const copyrightElements = document.querySelectorAll('.copyright p, #currentYear');
    if (copyrightElements.length > 0) {
        const currentYear = new Date().getFullYear();
        copyrightElements.forEach(element => {
            if (element.id === 'currentYear') {
                element.textContent = currentYear;
            } else {
                element.innerHTML = element.innerHTML.replace('2024', currentYear);
            }
        });
    }
    
    // ===========================================
    // 10. EFFET PARALLAX SUR LA SPHÈRE TECH
    // ===========================================
    const techSphere = document.querySelector('.tech-sphere');
    
    if (techSphere && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            techSphere.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
        });
        
        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            techSphere.style.transform = 'translate(-50%, -50%)';
        });
    }
    
    // ===========================================
    // 11. GESTION DES BOUTONS "RÉSERVER" ET "DÉTAILS"
    // ===========================================
    document.querySelectorAll('.product-btn, .card-btn, .service-btn, .promo-btn, .section-footer .btn-primary, .section-footer .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#contact') {
                e.preventDefault();
                
                // Smooth scroll to contact section
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Optionally populate subject based on button context
                let subject = 'autre';
                if (this.closest('.product-card')) subject = 'location';
                else if (this.closest('.formation-card')) subject = 'formation';
                else if (this.closest('.service-card')) subject = 'service';
                else if (this.classList.contains('promo-btn')) subject = 'devis';
                
                // Populate subject select after scroll
                setTimeout(() => {
                    const subjectSelect = document.querySelector('select[name="subject"]');
                    if (subjectSelect) {
                        subjectSelect.value = subject;
                    }
                }, 500);
            }
        });
    });
    
    // ===========================================
    // 12. TOOLTIPS POUR LES ICÔNES DE PAIEMENT
    // ===========================================
    const paymentIcons = document.querySelectorAll('.payment-icons i');
    
    paymentIcons.forEach(icon => {
        const title = icon.getAttribute('title');
        if (title) {
            icon.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            icon.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        }
    });
    
    // Add tooltip styles
    const tooltipStyles = document.createElement('style');
    tooltipStyles.textContent = `
        .tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            z-index: 10000;
            pointer-events: none;
            white-space: nowrap;
            font-family: var(--font-primary);
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyles);
    
    // ===========================================
    // 13. PRÉCHARGEMENT ET ANIMATIONS INITIALES
    // ===========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Animate hero section
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 300);
        
        // Trigger initial card animations
        setTimeout(() => {
            // Animate first 3 cards in each active section
            const activeGrids = document.querySelectorAll('.formations-grid.active, .boutique-grid.active');
            activeGrids.forEach(grid => {
                const cards = grid.querySelectorAll('.formation-card, .product-card');
                cards.forEach((card, index) => {
                    if (index < 3) {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 200);
                    }
                });
            });
            
            // Animate services and team
            ['services', 'team'].forEach(section => {
                const cards = document.querySelectorAll(`#${section} .cards-grid > *`);
                cards.forEach((card, index) => {
                    if (index < 3) {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 200);
                    }
                });
            });
            
            // Animate testimonials
            const testimonials = document.querySelectorAll('.testimonial-card');
            testimonials.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 200);
            });
            
            // Animate section headers
            document.querySelectorAll('.section-header').forEach((header, index) => {
                setTimeout(() => {
                    header.classList.add('animate-in');
                }, index * 300);
            });
        }, 500);
    });
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .hero-content {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .loaded .hero-content {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Smooth fade in for entire page */
        body {
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyles);
    
    // ===========================================
    // 14. RESPONSIVE ADJUSTMENTS
    // ===========================================
    function handleResize() {
        const horizontalContainers = document.querySelectorAll('.horizontal-scroll-container');
        
        horizontalContainers.forEach(container => {
            const scrollWrapper = container.querySelector('.scroll-wrapper');
            
            if (scrollWrapper && window.innerWidth > 768) {
                // Déterminer la largeur en fonction de la section
                let cardWidth;
                let cardsPerView;
                
                if (container.closest('#formations')) {
                    cardWidth = 320;
                    cardsPerView = 3;
                } else if (container.closest('#boutique')) {
                    cardWidth = 280;
                    cardsPerView = 3;
                } else if (container.closest('#services')) {
                    cardWidth = 300;
                    cardsPerView = 3;
                } else if (container.closest('#equipe')) {
                    cardWidth = 280;
                    cardsPerView = 3;
                } else {
                    cardWidth = 300;
                    cardsPerView = 3;
                }
                
                const gap = 16; // var(--spacing-md)
                const visibleWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1));
                
                scrollWrapper.style.maxWidth = `${visibleWidth}px`;
                scrollWrapper.style.margin = '0 auto';
            } else if (scrollWrapper && window.innerWidth <= 768) {
                // Remove width restriction on mobile
                scrollWrapper.style.maxWidth = '';
                scrollWrapper.style.margin = '';
            }
        });
    }
    
    // Initial call
    handleResize();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    
    // ===========================================
    // 15. AMÉLIORATIONS UX SUPPLEMENTAIRES
    // ===========================================
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effect to phone numbers
    document.querySelectorAll('.phone-numbers a, .footer-contact a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--primary-light)';
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = '';
        });
    });
    
    // Initialize all animations on page load
    setTimeout(() => {
        // Trigger scroll to activate intersection observers
        window.dispatchEvent(new Event('scroll'));
    }, 1000);
    
    console.log('Site Défis Informatique initialisé avec succès!');
});
