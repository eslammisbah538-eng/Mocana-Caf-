// ── Particles ──
        function createParticles() {
            const container = document.getElementById('heroParticles');
            for (let i = 0; i < 18; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.width = p.style.height = (Math.random() * 3 + 2) + 'px';
                p.style.animationDuration = (Math.random() * 12 + 8) + 's';
                p.style.animationDelay = (Math.random() * 10) + 's';
                p.style.opacity = Math.random() * 0.5 + 0.1;
                container.appendChild(p);
            }
        }
        createParticles();

        // ── Progress Bar + Navbar Scroll (مجمّعين في listener واحد + passive لتحسين السكرول على الموبايل) ──
        const progressBar = document.getElementById('progressBar');
        const navbarEl = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            progressBar.style.transform = `scaleX(${pct})`;
            navbarEl.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });

        // ── Mobile Menu ──
        const mobileMenuEl = document.getElementById('mobileMenu');
        const hamburgerEl = document.getElementById('hamburger');
        function toggleMenu() {
            mobileMenuEl.classList.toggle('open');
            hamburgerEl.classList.toggle('open');
        }
        function closeMenu() {
            mobileMenuEl.classList.remove('open');
            hamburgerEl.classList.remove('open');
        }
        hamburgerEl.addEventListener('click', toggleMenu);
        // قفل القائمة تلقائيًا عند الضغط على أي رابط أو زرار جواها
        mobileMenuEl.querySelectorAll('a, button').forEach(el => el.addEventListener('click', closeMenu));

        // ── أزرار "احجز الآن" (نفس السلوك في كل مكان بالموقع) ──
        function scrollToReservation() {
            document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
        }
        document.querySelectorAll('.js-book-btn').forEach(btn => btn.addEventListener('click', scrollToReservation));

        // ── زرار "استكشف المنيو" في الهيرو ──
        document.querySelectorAll('.js-menu-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // ── تابات المنيو (Coffee / Food / Desserts) ──
        document.querySelectorAll('.menu-tab').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
        });

        // ── Dark Mode ──
        const themeToggle = document.getElementById('themeToggle');
        function initTheme() {
            if (localStorage.getItem('theme') === 'dark') enableDark();
        }
        function enableDark() {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
        function disableDark() {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.contains('dark-mode') ? disableDark() : enableDark();
        });

        // ── Typing Animation (بتوقف تماماً لما الهيرو يخرج بره الشاشة عشان توفر رامات) ──
        function animateTyping() {
            const phrases = ["Becomes Magic", "Tells Stories"];
            let phraseIdx = 0, charIdx = 0, deleting = false;
            const el = document.getElementById('typingText');
            const heroSection = document.getElementById('home');
            let timer = null;
            let paused = false;

            function type() {
                timer = null;
                if (paused) return; // متوقفة: مفيش أي شغل ولا setTimeout جديد لحد ما ترجع تظهر
                const current = phrases[phraseIdx];
                if (!deleting) {
                    el.textContent = current.substring(0, charIdx + 1);
                    charIdx++;
                    if (charIdx === current.length) { deleting = true; timer = setTimeout(type, 2200); return; }
                } else {
                    el.textContent = current.substring(0, charIdx - 1);
                    charIdx--;
                    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; timer = setTimeout(type, 400); return; }
                }
                timer = setTimeout(type, deleting ? 50 : 90);
            }

            const typingVisibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (paused) {
                            paused = false;
                            if (!timer) type(); // استئناف من نفس النقطة اللي وقفت عندها
                        }
                    } else {
                        paused = true;
                        if (timer) { clearTimeout(timer); timer = null; }
                    }
                });
            }, { threshold: 0.05 });
            typingVisibilityObserver.observe(heroSection);

            timer = setTimeout(type, 800);
        }

        // ── Counter Animation ──
        function animateCounters() {
            // لا نحتاج لهذه الدالة الآن لأن الأرقام مضبوطة
        }

        // ── Scroll Reveal ──
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        // ── Menu Tabs ──
        function switchTab(tab, btn) {
            document.querySelectorAll('.menu-panel').forEach(p => {
                if (p.classList.contains('active')) {
                    p.style.animation = 'fadeIn 0.3s ease';
                }
                p.classList.remove('active');
            });
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            const panel = document.getElementById('tab-' + tab);
            panel.classList.add('active');
            panel.style.animation = 'fadeIn 0.4s ease';
            btn.classList.add('active');
        }

        // ── Form ──
        document.getElementById('reservationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.classList.add('loading');
            await new Promise(r => setTimeout(r, 1200));
            btn.classList.remove('loading');
            showFeedback('✓ Your reservation has been confirmed! We look forward to seeing you.', 'success');
            e.target.reset();
        });

        function showFeedback(message, type) {
            const fb = document.getElementById('formFeedback');
            fb.className = `form-feedback show ${type}`;
            fb.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
            setTimeout(() => fb.classList.remove('show'), 5000);
        }

        // ── Smooth Scroll ──
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const t = document.querySelector(a.getAttribute('href'));
                if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
            });
        });

        // ── Init ──
        window.addEventListener('load', () => {
            document.getElementById('heroBg').classList.add('loaded');
            initTheme();
            animateTyping();
            animateCounters();
            document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
        });

        // ── Set min date for reservation ──
        document.getElementById('reservationDate').min = new Date().toISOString().split('T')[0];