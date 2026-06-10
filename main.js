// Universal Particle Engine configuration helper
function initializeParticles(containerElement, canvasElement) {
    const ctx = canvasElement.getContext('2d');
    let particlesArray = [];
    
    const mouse = {
        x: null,
        y: null,
        radius: 120 
    };

    function resizeCanvas() {
        canvasElement.width = containerElement.offsetWidth;
        canvasElement.height = containerElement.offsetHeight;
        initParticles();
    }

    containerElement.addEventListener('mousemove', (e) => {
        const rect = containerElement.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    containerElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvasElement.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvasElement.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 2.5;
                    this.y += (dy / distance) * force * 2.5;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvasElement.width * canvasElement.height) / 4000);
        if (numberOfParticles < 15) numberOfParticles = 15; 

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * (canvasElement.width - size * 2) + size;
            let y = Math.random() * (canvasElement.height - size * 2) + size;
            let directionX = (Math.random() * 0.6) - 0.3;
            let directionY = (Math.random() * 0.6) - 0.3;
            let color = 'rgba(0, 168, 255, ' + (Math.random() * 0.4 + 0.3) + ')';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectNodes();
    }

    function connectNodes() {
        let maxDistance = 65;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = (1 - (distance / maxDistance)) * 0.12;
                    ctx.strokeStyle = `rgba(0, 168, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

class UniversalHeader extends HTMLElement {
    connectedCallback() {
        if (!document.querySelector("link[rel*='icon']")) {
            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/webp';
            favicon.href = 'image/logo.webp';
            document.head.appendChild(favicon);

            const appleTouchIcon = document.createElement('link');
            appleTouchIcon.rel = 'apple-touch-icon';
            appleTouchIcon.href = 'image/logo.webp';
            document.head.appendChild(appleTouchIcon);
        }

        this.innerHTML = `
        <header>
            <canvas class="particle-canvas"></canvas>
            <div class="nav-container">
                <a href="index.html" class="logo"> <img src="image/logo.webp" height="35px" width="35px">  GSTU Science Club</a>
                <nav>
                    <ul id="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="achievement.html">Achievement</a></li>
                        <li><a href="messages.html">Messages</a></li>
                        <li class="dropdown">
                            <a href="committee.html" class="dropdown-trigger">Committee <span class="dropdown-arrow">&#9662;</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="advisor.html">Advisor Panel</a></li>
                                <li><a href="standing-committee.html">Standing Committee</a></li>
                                <li><a href="committee.html">Executive Committee</a></li>
                                <li><a href="alumni.html">Alumni</a></li>
                                <li><a href="teams.html">Teams</a></li>
                            </ul>
                        </li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        `;
        
        const links = this.querySelectorAll('#nav-links a');
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === "" || currentPath === "index.html") {
            currentPath = "index.html";
        }
        
        // Dynamic Dropdown & Navigation Link Highlighter Engine
        let isSubPageActive = false;
        const committeeSubPages = ["advisor.html", "standing-committee.html", "alumni.html", "teams.html"];

        links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath) {
                link.classList.add('active');
                
                // Track if the matched current active page is part of the committee sub-list
                if (committeeSubPages.includes(currentPath)) {
                    isSubPageActive = true;
                }
            }
        });

        // Keep parent "Committee" text illuminated if a user is browsing inside its panel routes
        if (isSubPageActive) {
            const dropdownTrigger = this.querySelector('.dropdown-trigger');
            if (dropdownTrigger) {
                dropdownTrigger.classList.add('active');
            }
        }

        const headerContainer = this.querySelector('header');
        const headerCanvas = this.querySelector('.particle-canvas');
        initializeParticles(headerContainer, headerCanvas);
    }
}

class UniversalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <canvas class="particle-canvas"></canvas>
            <div class="footer-container">
                <div class="footer-col">
                    <a href="index.html" class="logo"> <img src="image/logo.webp" height="60px" width="60px"></a>
                    <h3>GSTU Science Club</h3>
                    <p>Inspiring innovation, research, and technical excellence among the bright minds of GSTU. Your workspace to shape tomorrow.</p>
                </div>
                
                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About Club</a></li>
                        <li><a href="events.html">Events & Fairs</a></li>
                        <li><a href="teams.html">Our Divisions</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="committee.html">Executive Committee</a></li>
                        <li><a href="advisor.html">Advisor Panel</a></li>
                        <li><a href="achievement.html">Achievement</a></li>
                        <li><a href="contact.html">Contact Support</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h3>Connect With Us</h3>
                    <p>Follow our news feeds for instant updates on current hackathons and assignments.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/GSTUSC" target="_blank" aria-label="Facebook"><img src="image/facebook.webp" width="35px" height="35px"></a>
                        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><img src="image/linkedin.webp" width="35px" height="35px"></a>
                        <a href="https://instagram.com" target="_blank" aria-label="Instagram"><img src="image/instagram.webp" width="35px" height="35px"></a>
                        <a href="https://youtube.com" target="_blank" aria-label="YouTube"><img src="image/youtube.webp" width="35px" height="35px"></a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2026 GSTU Science Club. All Rights Reserved.</p>
            </div>
        </footer>
        `;

        const footerContainer = this.querySelector('footer');
        const footerCanvas = this.querySelector('.particle-canvas');
        initializeParticles(footerContainer, footerCanvas);
    }
}

customElements.define('universal-header', UniversalHeader);
customElements.define('universal-footer', UniversalFooter);

// --- DYNAMIC VECTOR INTERACTION ARRAYS ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Title Vector Engine
    const glowTitle = document.querySelector('.interactive-glow-title');
    if (glowTitle) {
        glowTitle.addEventListener('mousemove', (e) => {
            const rect = glowTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glowTitle.style.setProperty('--x', `${x}px`);
            glowTitle.style.setProperty('--y', `${y}px`);
        });
    }

    // 2. Affiliation Spotlight Matrix
    const affiliationCards = document.querySelectorAll('.interactive-affiliation-card');
    affiliationCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 3. Q&A Spotlight Matrix
    const qaCards = document.querySelectorAll('.interactive-qa-card');
    qaCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 4. Two-Row Photo Gallery Slide Engine (with Auto-Slide Mechanics)
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    
    if (track && prevBtn && nextBtn) {
        let currentColumnIndex = 0;
        let autoSlideInterval = null;
        const SLIDE_DELAY = 2500; 

        function getItemsPerView() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 968) return 2;
            return 3; 
        }

        function updateSliderPosition() {
            const items = track.querySelectorAll('.gallery-item');
            const totalColumns = Math.ceil(items.length / 2); 
            const columnsPerView = getItemsPerView();
            const maxIndex = Math.max(0, totalColumns - columnsPerView);

            if (currentColumnIndex > maxIndex) currentColumnIndex = maxIndex;
            if (currentColumnIndex < 0) currentColumnIndex = 0;

            if (totalColumns <= columnsPerView) {
                track.style.transform = `translateX(0px)`;
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                stopAutoSlide();
                return;
            }

            const firstItem = items[0];
            const itemWidth = firstItem.getBoundingClientRect().width;
            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.gap) || 0;

            const shiftAmount = currentColumnIndex * (itemWidth + gap);
            track.style.transform = `translateX(-${shiftAmount}px)`;

            prevBtn.disabled = currentColumnIndex === 0;
            nextBtn.disabled = currentColumnIndex >= maxIndex;
        }

        function handleNextSlide() {
            const items = track.querySelectorAll('.gallery-item');
            const totalColumns = Math.ceil(items.length / 2);
            const columnsPerView = getItemsPerView();
            const maxIndex = Math.max(0, totalColumns - columnsPerView);

            if (currentColumnIndex >= maxIndex) {
                currentColumnIndex = 0; 
            } else {
                currentColumnIndex += getItemsPerView();
            }
            updateSliderPosition();
        }

        function handlePrevSlide() {
            if (currentColumnIndex <= 0) {
                const items = track.querySelectorAll('.gallery-item');
                const totalColumns = Math.ceil(items.length / 2);
                currentColumnIndex = Math.max(0, totalColumns - getItemsPerView());
            } else {
                currentColumnIndex -= getItemsPerView();
            }
            updateSliderPosition();
        }

        function startAutoSlide() {
            const items = track.querySelectorAll('.gallery-item');
            const totalColumns = Math.ceil(items.length / 2);
            if (totalColumns <= getItemsPerView()) return;

            stopAutoSlide();
            autoSlideInterval = setInterval(handleNextSlide, SLIDE_DELAY);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        nextBtn.addEventListener('click', () => {
            handleNextSlide();
            startAutoSlide(); 
        });

        prevBtn.addEventListener('click', () => {
            handlePrevSlide();
            startAutoSlide(); 
        });

        const galleryContainer = document.querySelector('.gallery-carousel-container');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', stopAutoSlide);
            galleryContainer.addEventListener('mouseleave', startAutoSlide);
        }

        let resizeDebounceTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeDebounceTimeout);
            resizeDebounceTimeout = setTimeout(() => {
                updateSliderPosition();
                startAutoSlide();
            }, 100);
        });

        setTimeout(() => {
            updateSliderPosition();
            startAutoSlide();
        }, 150);
    }

    // 5. Advisor Spotlight Matrix Engine
    const advisorCards = document.querySelectorAll('.interactive-advisor-card');
    advisorCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
});