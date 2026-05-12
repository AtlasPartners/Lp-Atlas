document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            let target = document.querySelector(href);

            if (href === '#formulario' && window.matchMedia('(max-width: 768px)').matches) {
                target = document.querySelector('.lauda-02-form-card') || target;
            }

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

    const formCard = document.querySelector('.lauda-02-form-card');
    const mobileHeroFormSlot = document.querySelector('.mobile-hero-form-slot');
    const mobileFormQuery = window.matchMedia('(max-width: 768px)');

    if (formCard && mobileHeroFormSlot) {
        const originalFormParent = formCard.parentElement;
        const originalFormNextSibling = formCard.nextElementSibling;

        const placeForm = () => {
            if (mobileFormQuery.matches) {
                mobileHeroFormSlot.appendChild(formCard);
                return;
            }

            if (originalFormNextSibling) {
                originalFormParent.insertBefore(formCard, originalFormNextSibling);
            } else {
                originalFormParent.appendChild(formCard);
            }
        };

        placeForm();
        mobileFormQuery.addEventListener('change', placeForm);
    }

    // Form Submission Handling
    const leadForm = document.getElementById('contactForm');
    if (leadForm) {
        const customSelects = leadForm.querySelectorAll('[data-select]');

        customSelects.forEach(select => {
            const trigger = select.querySelector('.custom-select-trigger');
            const triggerText = trigger.querySelector('span');
            const input = select.querySelector('input[type="hidden"]');
            const options = select.querySelectorAll('[role="option"]');

            trigger.addEventListener('click', () => {
                const isOpen = select.classList.contains('is-open');

                customSelects.forEach(item => {
                    item.classList.remove('is-open');
                    item.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
                });

                select.classList.toggle('is-open', !isOpen);
                trigger.setAttribute('aria-expanded', String(!isOpen));
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    options.forEach(item => item.classList.remove('is-selected'));
                    option.classList.add('is-selected');

                    input.value = option.dataset.value;
                    triggerText.innerText = option.innerText;
                    select.classList.add('has-value');
                    select.classList.remove('is-open', 'is-invalid');
                    trigger.setAttribute('aria-expanded', 'false');
                });
            });
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('[data-select]')) {
                customSelects.forEach(select => {
                    select.classList.remove('is-open');
                    select.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
                });
            }
        });

        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            const emptySelect = Array.from(customSelects).find(select => !select.querySelector('input').value);

            customSelects.forEach(select => {
                select.classList.toggle('is-invalid', !select.querySelector('input').value);
            });

            if (emptySelect) {
                emptySelect.querySelector('.custom-select-trigger').focus();
                alert('Selecione uma opção nos campos obrigatórios antes de enviar.');
                return;
            }
            
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
                customSelects.forEach(select => {
                    select.classList.remove('has-value', 'is-open', 'is-invalid');
                    select.querySelector('.custom-select-trigger span').innerText = 'Selecione uma opção';
                    select.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
                    select.querySelectorAll('[role="option"]').forEach(option => option.classList.remove('is-selected'));
                });
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
