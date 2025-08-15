// CycleCraft - Interactive JavaScript Functions

// Initialize AOS and other components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Initialize counter animation
    initCounters();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize product filters
    initProductFilters();
});

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.count');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Smooth Scrolling
function initSmoothScrolling() {
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
}

// Product Filter System
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.product-filters .btn');
    const productItems = document.querySelectorAll('.product-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

// Navigation Functions
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    showNotification('Exploring our bike collection!', 'info');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Product Functions
function filterProducts(category) {
    const productItems = document.querySelectorAll('.product-item');
    const filterButtons = document.querySelectorAll('.product-filters .btn');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter products
    productItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            item.classList.remove('hidden');
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
                item.classList.add('hidden');
            }, 300);
        }
    });
    
    showNotification(`Showing ${category === 'all' ? 'all' : category} bikes`, 'success');
}

function showProductDetails(productId) {
    const productDetails = {
        'mountain-pro': {
            name: 'Mountain Pro X1',
            price: '$2,499',
            description: 'Professional mountain bike designed for extreme terrains with advanced suspension and durable frame.',
            features: ['Carbon Fiber Frame', 'Full Suspension', '27-Speed Shimano', 'Hydraulic Disc Brakes']
        },
        'road-racer': {
            name: 'Road Racer Elite',
            price: '$3,299',
            description: 'Lightweight carbon fiber road bike engineered for speed and performance on paved roads.',
            features: ['Ultra-Light Carbon', 'Aerodynamic Design', '22-Speed Shimano', 'Racing Geometry']
        },
        'e-bike-city': {
            name: 'E-Bike City Cruiser',
            price: '$1,899',
            description: 'Electric bike perfect for urban commuting with long battery life and comfortable riding position.',
            features: ['Electric Motor', '50-Mile Range', 'LED Display', 'Integrated Lights']
        }
    };
    
    const product = productDetails[productId];
    if (product) {
        const modal = `
            <div class="modal fade" id="productModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${product.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="product-image-large bg-light d-flex align-items-center justify-content-center" style="height: 300px;">
                                        <iconify-icon icon="solar:bicycle-bold" class="text-primary" style="font-size: 6rem;"></iconify-icon>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h4 class="text-primary mb-3">${product.price}</h4>
                                    <p class="mb-4">${product.description}</p>
                                    <h6>Key Features:</h6>
                                    <ul class="list-unstyled">
                                        ${product.features.map(feature => `<li><iconify-icon icon="solar:check-circle-bold" class="text-success me-2"></iconify-icon>${feature}</li>`).join('')}
                                    </ul>
                                    <div class="d-flex gap-2 mt-4">
                                        <button onclick="addToCart('${productId}')" class="btn btn-primary flex-fill">Add to Cart</button>
                                        <button onclick="showQuoteModal()" class="btn btn-outline-primary">Get Quote</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('productModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modal);
        const modalElement = new bootstrap.Modal(document.getElementById('productModal'));
        modalElement.show();
    }
}

function addToCart(productId) {
    // Simulate adding to cart
    showNotification('Product added to cart!', 'success');
    
    // Close modal if open
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) {
        modal.hide();
    }
}

function showAllProducts() {
    filterProducts('all');
    showNotification('Showing all available bikes', 'info');
}

// Modal Functions
function showQuoteModal() {
    const modal = `
        <div class="modal fade" id="quoteModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Get Custom Quote</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form onsubmit="submitQuoteForm(event)">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Bike Type</label>
                                <select class="form-select" required>
                                    <option value="">Select bike type</option>
                                    <option value="mountain">Mountain Bike</option>
                                    <option value="road">Road Bike</option>
                                    <option value="electric">Electric Bike</option>
                                    <option value="custom">Custom Build</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Budget Range</label>
                                <select class="form-select" required>
                                    <option value="">Select budget</option>
                                    <option value="1000-2000">$1,000 - $2,000</option>
                                    <option value="2000-3000">$2,000 - $3,000</option>
                                    <option value="3000-5000">$3,000 - $5,000</option>
                                    <option value="5000+">$5,000+</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Additional Requirements</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Request Quote</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'quoteModal');
}

function showCatalogModal() {
    const modal = `
        <div class="modal fade" id="catalogModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Digital Catalog</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <iconify-icon icon="solar:document-bold" class="text-primary" style="font-size: 4rem;"></iconify-icon>
                        </div>
                        <h4>2024 Bike Collection</h4>
                        <p class="text-muted mb-4">Download our complete catalog with detailed specifications, pricing, and customization options.</p>
                        <form onsubmit="downloadCatalog(event)">
                            <div class="mb-3">
                                <input type="email" class="form-control" placeholder="Enter your email" required>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <iconify-icon icon="solar:download-bold" class="me-2"></iconify-icon>
                                Download Catalog
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'catalogModal');
}

function playVideoModal() {
    const modal = `
        <div class="modal fade" id="videoModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Our Story</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <iconify-icon icon="solar:play-circle-bold" class="text-primary" style="font-size: 6rem;"></iconify-icon>
                        </div>
                        <h4>CycleCraft Journey</h4>
                        <p class="text-muted mb-4">Watch how we've been crafting premium bicycles for over 38 years, combining traditional craftsmanship with modern innovation.</p>
                        <button onclick="simulateVideoPlay()" class="btn btn-primary btn-lg">
                            <iconify-icon icon="solar:play-bold" class="me-2"></iconify-icon>
                            Play Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'videoModal');
}

// Service Functions
function requestCustomQuote() {
    showQuoteModal();
}

function bookService() {
    const modal = `
        <div class="modal fade" id="serviceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Book Service Appointment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form onsubmit="submitServiceForm(event)">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Service Type</label>
                                <select class="form-select" required>
                                    <option value="">Select service</option>
                                    <option value="basic">Basic Tune-up</option>
                                    <option value="advanced">Advanced Maintenance</option>
                                    <option value="repair">Repair Service</option>
                                    <option value="custom">Custom Modification</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Preferred Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" rows="3" placeholder="Describe the issue or service needed"></textarea>
                            </div>
                            <button type="submit" class="btn btn-success w-100">Book Appointment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'serviceModal');
}

function checkShipping() {
    const modal = `
        <div class="modal fade" id="shippingModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Shipping Information</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <h6>Shipping Options:</h6>
                            <div class="list-group">
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Standard Shipping (5-7 days)</span>
                                    <strong>Free</strong>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Express Shipping (2-3 days)</span>
                                    <strong>$49</strong>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Overnight Shipping</span>
                                    <strong>$99</strong>
                                </div>
                            </div>
                        </div>
                        <form onsubmit="calculateShipping(event)">
                            <div class="mb-3">
                                <label class="form-label">Enter ZIP Code</label>
                                <input type="text" class="form-control" placeholder="12345" required>
                            </div>
                            <button type="submit" class="btn btn-warning w-100">Calculate Shipping</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'shippingModal');
}

// Company Information Functions
function showCompanyHistory() {
    const modal = `
        <div class="modal fade" id="historyModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Our Story</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="timeline">
                            <div class="timeline-item mb-4">
                                <div class="d-flex">
                                    <div class="timeline-marker bg-primary rounded-circle me-3" style="width: 12px; height: 12px; margin-top: 6px;"></div>
                                    <div>
                                        <h6>1985 - The Beginning</h6>
                                        <p class="text-muted">Founded by cycling enthusiast John Craft in a small garage workshop.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="timeline-item mb-4">
                                <div class="d-flex">
                                    <div class="timeline-marker bg-success rounded-circle me-3" style="width: 12px; height: 12px; margin-top: 6px;"></div>
                                    <div>
                                        <h6>1995 - First Factory</h6>
                                        <p class="text-muted">Opened our first manufacturing facility and launched the Pro Series.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="timeline-item mb-4">
                                <div class="d-flex">
                                    <div class="timeline-marker bg-warning rounded-circle me-3" style="width: 12px; height: 12px; margin-top: 6px;"></div>
                                    <div>
                                        <h6>2010 - Going Electric</h6>
                                        <p class="text-muted">Pioneered electric bike technology with our first e-bike series.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="d-flex">
                                    <div class="timeline-marker bg-info rounded-circle me-3" style="width: 12px; height: 12px; margin-top: 6px;"></div>
                                    <div>
                                        <h6>2024 - Global Leader</h6>
                                        <p class="text-muted">Now serving customers in 25+ countries with 150+ bike models.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'historyModal');
}

function showCertifications() {
    const modal = `
        <div class="modal fade" id="certModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Certifications & Awards</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row text-center">
                            <div class="col-6 mb-4">
                                <iconify-icon icon="solar:medal-star-bold" class="text-warning" style="font-size: 3rem;"></iconify-icon>
                                <h6 class="mt-2">ISO 9001</h6>
                                <small class="text-muted">Quality Management</small>
                            </div>
                            <div class="col-6 mb-4">
                                <iconify-icon icon="solar:leaf-bold" class="text-success" style="font-size: 3rem;"></iconify-icon>
                                <h6 class="mt-2">Green Certified</h6>
                                <small class="text-muted">Eco-Friendly Manufacturing</small>
                            </div>
                            <div class="col-6 mb-4">
                                <iconify-icon icon="solar:shield-check-bold" class="text-primary" style="font-size: 3rem;"></iconify-icon>
                                <h6 class="mt-2">Safety Standard</h6>
                                <small class="text-muted">EN 15194 Compliant</small>
                            </div>
                            <div class="col-6 mb-4">
                                <iconify-icon icon="solar:crown-bold" class="text-warning" style="font-size: 3rem;"></iconify-icon>
                                <h6 class="mt-2">Best Manufacturer</h6>
                                <small class="text-muted">2023 Industry Award</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal, 'certModal');
}

// Social Media Functions
function openSocial(platform) {
    const urls = {
        facebook: 'https://facebook.com/cyclecraft',
        instagram: 'https://instagram.com/cyclecraft',
        twitter: 'https://twitter.com/cyclecraft',
        youtube: 'https://youtube.com/cyclecraft'
    };
    
    if (urls[platform]) {
        showNotification(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
        // In a real application, you would use: window.open(urls[platform], '_blank');
    }
}

// Form Submission Functions
function submitContactForm(event) {
    event.preventDefault();
    
    // Simulate form submission
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<iconify-icon icon="solar:loading-bold" class="me-2"></iconify-icon>Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function submitQuoteForm(event) {
    event.preventDefault();
    showNotification('Quote request submitted! We\'ll contact you within 24 hours.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('quoteModal')).hide();
}

function submitServiceForm(event) {
    event.preventDefault();
    showNotification('Service appointment booked! We\'ll confirm via phone.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
}

function downloadCatalog(event) {
    event.preventDefault();
    showNotification('Catalog download started! Check your email for the link.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('catalogModal')).hide();
}

function calculateShipping(event) {
    event.preventDefault();
    showNotification('Shipping calculated! Standard shipping available to your area.', 'info');
}

// Utility Functions
function showModal(modalHTML, modalId) {
    // Remove existing modal
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modalElement = new bootstrap.Modal(document.getElementById(modalId));
    modalElement.show();
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Update message and icon based on type
    const icons = {
        success: 'solar:check-circle-bold',
        error: 'solar:close-circle-bold',
        warning: 'solar:danger-triangle-bold',
        info: 'solar:info-circle-bold'
    };
    
    const colors = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-info'
    };
    
    const icon = toast.querySelector('iconify-icon');
    icon.setAttribute('icon', icons[type] || icons.info);
    icon.className = `${colors[type] || colors.info} me-2`;
    
    toastMessage.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function simulateVideoPlay() {
    showNotification('Video is playing! (This is a demo)', 'info');
    bootstrap.Modal.getInstance(document.getElementById('videoModal')).hide();
}

// Additional utility functions for footer links
function showWarranty() {
    showNotification('Warranty information: Lifetime frame warranty included!', 'info');
}

function showCareers() {
    showNotification('Visit our careers page to join the CycleCraft team!', 'info');
}

function showPress() {
    showNotification('Press kit and media resources available on request.', 'info');
}

function showFAQ() {
    showNotification('FAQ section: Find answers to common questions.', 'info');
}

function showSupport() {
    showNotification('24/7 customer support available via chat and phone.', 'info');
}

function showReturns() {
    showNotification('30-day return policy with free return shipping.', 'info');
}

function showPrivacy()