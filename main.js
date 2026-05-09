document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBVRogWm0Og9UKIjs7rjizmMT2d0NWxVS0",
        authDomain: "atlas-company-2a7fa.firebaseapp.com",
        projectId: "atlas-company-2a7fa",
        storageBucket: "atlas-company-2a7fa.firebasestorage.app",
        messagingSenderId: "451783344947",
        appId: "1:451783344947:web:83e55e36221a3dd7b83446"
    };

    // Inicializa o Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // Form Submission Handling
    const leadForm = document.getElementById('contactForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Visual feedback
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Coleta os dados do formulário
            const formData = {
                nome: document.getElementById('name').value,
                email: document.getElementById('email').value,
                whatsapp: document.getElementById('whatsapp').value,
                empresa: document.getElementById('company').value,
                funcionarios: document.getElementById('employees').value,
                faturamento: document.getElementById('revenue').value,
                experiencia: document.getElementById('experience').value,
                dataCadastro: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                // Salva no Firestore na coleção 'leads'
                await db.collection("leads").add(formData);

                alert('Obrigado! Seus dados foram enviados com sucesso.');
                leadForm.reset();
            } catch (error) {
                console.error("Erro ao enviar contato: ", error);
                alert('Ocorreu um erro ao enviar. Verifique o console ou tente novamente mais tarde.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }

    // Counter Animation
    const counters = document.querySelectorAll('.counter');

    const animateCounters = () => {
        counters.forEach(counter => {
            // Se já estiver animado, ignora
            if (counter.classList.contains('animated')) return;
            counter.classList.add('animated');

            const targetStr = counter.getAttribute('data-target');
            const targetNum = +targetStr.replace(/[^0-9]/g, '');
            const isCurrency = targetStr.includes('R$');
            
            let count = 0;
            const duration = 2000; // Duração de 2 segundos
            const interval = 30; // Atualiza a cada 30ms
            const steps = duration / interval;
            const increment = targetNum / steps;

            const timer = setInterval(() => {
                count += increment;
                if (count >= targetNum) {
                    counter.innerText = targetStr;
                    clearInterval(timer);
                } else {
                    const currentVal = Math.ceil(count);
                    counter.innerText = isCurrency ? `+R$ ${currentVal}k` : `+${currentVal}`;
                }
            }, interval);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('lauda-02-info')) {
                    animateCounters();
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial state for observed elements
    document.querySelectorAll('section, .form-container, .lauda-02-info').forEach(el => {
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
