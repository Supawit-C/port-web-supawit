// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Helper function to render gallery
    function renderGallery(images) {
        if (images && images.length > 0) {
            return `
                <div class="activity-gallery">
                    ${images.map((img, index) => `
                        <div class="gallery-item" style="border: none; background: transparent;">
                            <img src="${img}" alt="Activity ${index + 1}" class="gallery-img" style="opacity: 1; display: block; border-radius: 8px;">
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return `
            <div class="activity-gallery">
                <div class="gallery-item">
                    <i class="fas fa-image"></i>
                    <span>Add Photo 1</span>
                    <img src="" alt="Activity 1" class="gallery-img">
                </div>
                <div class="gallery-item">
                    <i class="fas fa-image"></i>
                    <span>Add Photo 2</span>
                    <img src="" alt="Activity 2" class="gallery-img">
                </div>
            </div>
        `;
    }

    // Fetch and Load Dynamic Data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Load Awards
            const awardsContainer = document.getElementById('awards-container');
            if (awardsContainer && data.awards) {
                data.awards.forEach(award => {
                    const card = document.createElement('div');
                    card.className = `glass-card award-card reveal ${award.delay || ''}`;
                    card.innerHTML = `
                        <div class="award-header">
                            <i class="fas ${award.icon} award-icon"></i>
                            <span class="award-year">${award.year}</span>
                        </div>
                        <h3>${award.title}</h3>
                        <h4 class="award-level">${award.level}</h4>
                        <p>${award.description}</p>
                        ${renderGallery(award.images)}
                    `;
                    awardsContainer.appendChild(card);
                    revealOnScroll.observe(card);
                });
            }

            // Load Experience
            const experienceContainer = document.getElementById('experience-container');
            if (experienceContainer && data.experience) {
                data.experience.forEach(exp => {
                    const item = document.createElement('div');
                    item.className = `timeline-item reveal ${exp.delay || ''}`;
                    
                    let tagsHTML = '';
                    if (exp.tags && exp.tags.length > 0) {
                        tagsHTML = '<div class="experience-tags">' + 
                                   exp.tags.map(tag => `<span class="tag">${tag}</span>`).join('') + 
                                   '</div>';
                    }

                    item.innerHTML = `
                        <div class="timeline-dot"></div>
                        <div class="timeline-content glass-card">
                            <span class="timeline-date">${exp.date}</span>
                            <h3 class="timeline-title">${exp.title}</h3>
                            <h4 class="timeline-company">${exp.company_desc}</h4>
                            ${tagsHTML}
                            ${renderGallery(exp.images)}
                        </div>
                    `;
                    experienceContainer.appendChild(item);
                    revealOnScroll.observe(item);
                });
            }

            // Load Development
            const developmentContainer = document.getElementById('development-container');
            if (developmentContainer && data.development) {
                data.development.forEach(dev => {
                    const card = document.createElement('div');
                    card.className = `glass-card dev-card reveal ${dev.delay || ''}`;
                    
                    let linkHTML = '';
                    if (dev.link) {
                        linkHTML = `<a href="${dev.url || '#'}" target="_blank" class="dev-link"><i class="fas fa-external-link-alt"></i> ${dev.link}</a>`;
                    }
                    
                    let dateHTML = '';
                    if (dev.date) {
                        dateHTML = `<span class="date">${dev.date}</span>`;
                    }

                    card.innerHTML = `
                        <div class="card-icon"><i class="fas ${dev.icon}"></i></div>
                        <h3>${dev.title}</h3>
                        <p class="issuer">${dev.issuer}</p>
                        <p class="desc">${dev.description}</p>
                        ${dateHTML}
                        ${linkHTML}
                        ${renderGallery(dev.images)}
                    `;
                    developmentContainer.appendChild(card);
                    revealOnScroll.observe(card);
                });
            }

            // Load Leadership
            const leadershipContainer = document.getElementById('leadership-container');
            if (leadershipContainer && data.leadership) {
                data.leadership.forEach(lead => {
                    const item = document.createElement('div');
                    item.className = `timeline-item reveal ${lead.delay || ''}`;
                    
                    let detailsHTML = '';
                    if (lead.details && lead.details.length > 0) {
                        detailsHTML = '<ul class="timeline-details">' + 
                                      lead.details.map(detail => `<li>${detail}</li>`).join('') + 
                                      '</ul>';
                    }

                    item.innerHTML = `
                        <div class="timeline-dot"></div>
                        <div class="timeline-content glass-card">
                            <span class="timeline-date">${lead.date}</span>
                            <h3 class="timeline-title">${lead.title}</h3>
                            <h4 class="timeline-company">${lead.company}</h4>
                            ${detailsHTML}
                            ${renderGallery(lead.images)}
                        </div>
                    `;
                    leadershipContainer.appendChild(item);
                    revealOnScroll.observe(item);
                });
            }
        })
        .catch(error => console.error('Error loading data:', error));
});
