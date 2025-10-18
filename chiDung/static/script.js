// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactions
    initializeAnimations();
    initializeNavigation();
    initializeProgressBars();
    initializeFormValidation();
    initializeScrollEffects();
});

// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Navigation handling
function initializeNavigation() {
    // Get current page from URL
    const currentPage = window.location.pathname;
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

// Progress bars animation
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Intersection Observer for progress bars
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width') || 
                                  progressBar.style.width;
                
                // Animate progress bar
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = targetWidth;
                }, 200);
                
                // Unobserve after animation
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        // Store original width
        if (!bar.getAttribute('data-width')) {
            bar.setAttribute('data-width', bar.style.width);
        }
        progressObserver.observe(bar);
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.classList.add('was-validated');
        });
    });
}

// Validate form function
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'Trường này là bắt buộc');
        } else {
            clearFieldError(field);
            
            // Email validation
            if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                showFieldError(field, 'Email không hợp lệ');
            }
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll effects
function initializeScrollEffects() {
    // Back to top button
    const backToTopBtn = createBackToTopButton();
    
    window.addEventListener('scroll', function() {
        // Show/hide back to top button
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Create back to top button
function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.className = 'btn btn-primary back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 1000;
        font-size: 20px;
        font-weight: bold;
    `;
    
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(btn);
    return btn;
}

// Utility functions
const utils = {
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Copy to clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success message
            showNotification('Đã sao chép vào clipboard!', 'success');
        }).catch(function(err) {
            console.error('Lỗi khi sao chép: ', err);
            showNotification('Không thể sao chép', 'error');
        });
    }
};

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Đang gửi tin nhắn...', 'info');
            
            setTimeout(() => {
                showNotification('Tin nhắn đã được gửi thành công!', 'success');
                this.reset();
                this.classList.remove('was-validated');
            }, 2000);
        });
    }
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add CSS for scrolled navbar
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        background: rgba(11, 20, 38, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    }
    
    .notification {
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        background: linear-gradient(135deg, #1a1f3a 0%, #0f1829 100%);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #e2e8f0;
    }
`;
document.head.appendChild(style);