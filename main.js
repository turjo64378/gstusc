// Define Universal Header Component
class UniversalHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <div class="nav-container">
                <a href="index.html" class="logo"> <img src="image/logo.png" height="35px" width="35px">  GSTU Science Club</a>
                <nav>
                    <ul id="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="committee.html">Committee</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="teams.html">Teams</a></li>
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
    }
}

// Define Universal Footer Component
class UniversalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <p>&copy; 2026 GSTU Science Club. All Rights Reserved.</p>
        </footer>
        `;
    }
}

customElements.define('universal-header', UniversalHeader);
customElements.define('universal-footer', UniversalFooter);
