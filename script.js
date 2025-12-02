// Menu mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Fermer le menu en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupération des données du formulaire
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulation d'envoi (à remplacer par un vrai envoi)
    console.log('Données du formulaire:', data);

    // Message de confirmation
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');

    // Réinitialisation du formulaire
    contactForm.reset();
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if(targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation au défilement
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature, .formation-card, .formateur-card');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if(elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialisation des animations
window.addEventListener('load', () => {
    document.querySelectorAll('.feature, .formation-card, .formateur-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    setTimeout(() => {
        animateOnScroll();
    }, 300);
});

window.addEventListener('scroll', animateOnScroll);
