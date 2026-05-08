document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form Submission Handling
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Visual feedback
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert('Obrigado! Entraremos em contato em breve.');
                leadForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 1500);
        });
    }

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target').replace(/[^0-9]/g, '');
            const count = +counter.innerText.replace(/[^0-9]/g, '');
            const increment = target / speed;

            if (count < target) {
                const newValue = Math.ceil(count + increment);
                counter.innerText = counter.innerText.includes('R$') 
                    ? `+R$ ${newValue}k` 
                    : `+${newValue}`;
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = counter.getAttribute('data-target');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial state for observed elements
    document.querySelectorAll('section, .form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Subtle Parallax for Background Glow
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.bg-glow');
        if (glow) {
            const x = (e.clientX / window.innerWidth) * 50;
            const y = (e.clientY / window.innerHeight) * 50;
            glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(19, 0, 189, 0.15) 0%, transparent 70%)`;
        }
    });
});
