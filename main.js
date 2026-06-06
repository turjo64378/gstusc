// Universal Particle Engine configuration helper
function initializeParticles(containerElement, canvasElement) {
    const ctx = canvasElement.getContext('2d');
    let particlesArray = [];
    
    // Track cursor interactions locally inside the element boundaries
    const mouse = {
        x: null,
        y: null,
        radius: 120 // The radius of influence around your mouse pointer
    };

    function resizeCanvas() {
        canvasElement.width = containerElement.offsetWidth;
        canvasElement.height = containerElement.offsetHeight;
        initParticles();
    }

    // Capture precise pointer bounds
    containerElement.addEventListener('mousemove', (e) => {
        const rect = containerElement.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Clear cursor position when it leaves the element area
    containerElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Individual Particle Blueprints
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Render individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Manage movement and pointer physics interaction loop
        update() {
            // Standard bounding box collision check
            if (this.x > canvasElement.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvasElement.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Interactive Physics Logic: Distance calculation from cursor position
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // If the particle is within the pointer radius, pull it towards the pointer gently
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 2.5;
                    this.y += (dy / distance) * force * 2.5;
                }
            }

            // Normal idle environment float velocity
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Populate the area with uniform, glowing node vectors
    function initParticles() {
        particlesArray = [];
        // Calculate particle count dynamically based on the width of the viewport
        let numberOfParticles = Math.floor((canvasElement.width * canvasElement.height) / 4000);
        if (numberOfParticles < 30) numberOfParticles = 30; // Min density fallback

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1; // Particle diameter sizing variance
            let x = Math.random() * (canvasElement.width - size * 2) + size;
            let y = Math.random() * (canvasElement.height - size * 2) + size;
            let directionX = (Math.random() * 0.8) - 0.4; // Idle speed constraints
            let directionY = (Math.random() * 0.8) - 0.4;
            let color = 'rgba(0, 168, 255, ' + (Math.random() * 0.4 + 0.3) + ')'; // Glow accent palette opacity variations

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Continuous Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        // Optional: Draw structural vector connection wires between nearby matching nodes
        connectNodes();
    }

    function connectNodes() {
        let maxDistance = 75;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    let opacity = (1 - (distance / maxDistance)) * 0.15;
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

// Define Universal Header Component
class UniversalHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <canvas class="particle-canvas"></canvas>
            <div class="nav-container">
                <a href="index.html" class="logo"> <img src="image/logo.png" height="35px" width="35px">  GSTU Science Club</a>
                <nav>
                    <ul id="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li class="dropdown">
                            <a href="committee.html" class="dropdown-trigger">Committee <span class="dropdown-arrow">&#9662;</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="advisor.html">Advisor Panel</a></li>
                                <li><a href="standing-committee.html">Standing Committee</a></li>
                                <li><a href="committee.html">Executive Committee</a></li>
                                <li><a href="teams.html">Teams</a></li>
                            </ul>
                        </li>
                        <li><a href="messages.html">Messages</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="gallery.html">Gallery</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        `;
        
        // Highlight Active Link Dynamically
        const links = this.querySelectorAll('#nav-links a');
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === "" || currentPath === "index.html") {
            currentPath = "index.html";
        }
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });

        // Instantiate particle engine inside the header boundaries
        const headerContainer = this.querySelector('header');
        const headerCanvas = this.querySelector('.particle-canvas');
        initializeParticles(headerContainer, headerCanvas);
    }
}

// Define Universal Footer Component with Quick Links and Social Platforms
class UniversalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <canvas class="particle-canvas"></canvas>
            <div class="footer-container">
                <div class="footer-col">
                    <a href="index.html" class="logo"> <img src="image/logo.png" height="50px" width="50px"></a>
                    <h3>GSTU Science Club</h3>
                    <p>Inspiring innovation, research, and technical excellence among the bright minds of GSTU. Your workspace to shape the tomorrow.</p>
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
                        <li><a href="gallery.html">Photo Gallery</a></li>
                        <li><a href="contact.html">Contact Support</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h3>Connect With Us</h3>
                    <p>Follow our news feeds for instant updates on current hackathons and assignments.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/GSTUSC" target="_blank" aria-label="Facebook"><img src="image/facebook.png" width="35px" height="35px"></a>
                        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><img src="image/linkedin.png" width="35px" height="35px"></a>
                        <a href="https://instagram.com" target="_blank" aria-label="Instagram"><img src="image/instagram.png" width="35px" height="35px"></a>
                        <a href="https://youtube.com" target="_blank" aria-label="YouTube"><img src="image/youtube.png" width="35px" height="35px"></a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2026 GSTU Science Club. All Rights Reserved.</p>
            </div>
        </footer>
        `;

        // Instantiate particle engine inside the footer boundaries
        const footerContainer = this.querySelector('footer');
        const footerCanvas = this.querySelector('.particle-canvas');
        initializeParticles(footerContainer, footerCanvas);
    }
}

customElements.define('universal-header', UniversalHeader);
customElements.define('universal-footer', UniversalFooter);
