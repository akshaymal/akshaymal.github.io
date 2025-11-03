// Load section content dynamically (only works when served via HTTP/HTTPS, not file://)
async function loadSections() {
    // Check if we're running on a web server (not file://)
    if (window.location.protocol === 'file:') {
        console.log('Running locally - using inline content');
        return; // Skip dynamic loading for local file:// access
    }

    const sections = document.querySelectorAll('section[data-section-file]');

    for (const section of sections) {
        const file = section.getAttribute('data-section-file');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                section.innerHTML = html;
            } else {
                console.error(`Failed to load ${file}`);
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

// Smooth scroll behavior for navigation links
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

// Update current section display and highlight active nav link on scroll
function updateCurrentSection() {
    let current = '';
    const sections = document.querySelectorAll('.section');
    const currentSectionDisplay = document.querySelector('.current-section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    // Update active link highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            // Update the current section text display
            const sectionName = link.getAttribute('data-section');
            if (currentSectionDisplay && sectionName) {
                currentSectionDisplay.textContent = sectionName;
            }
        }
    });
}

// Run on scroll
window.addEventListener('scroll', updateCurrentSection);

// Load sections and then initialize
window.addEventListener('DOMContentLoaded', async () => {
    await loadSections();
    updateCurrentSection();
});
