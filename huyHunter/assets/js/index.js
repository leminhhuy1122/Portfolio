// Custom Notification System
function showNotification(data) {
  const overlay = document.getElementById("customNotification");
  const icon = overlay.querySelector(".notification-icon");
  const iconElement = icon.querySelector("i");
  const title = overlay.querySelector(".notification-title");
  const message = overlay.querySelector(".notification-message");

  // Update content based on type
  if (data.type === "success") {
    icon.classList.remove("error");
    iconElement.className = "fas fa-check";
    title.textContent = data.title || "Email đã được gửi thành công!";
    message.textContent =
      data.message || "Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.";

    // Update details
    if (data.details) {
      document.getElementById("notif-name").textContent =
        data.details.name || "";
      document.getElementById("notif-email").textContent =
        data.details.email || "";
      document.getElementById("notif-subject").textContent =
        data.details.subject || "";

      const phoneWrapper = document.getElementById("notif-phone-wrapper");
      if (data.details.phone) {
        document.getElementById("notif-phone").textContent = data.details.phone;
        phoneWrapper.style.display = "flex";
      } else {
        phoneWrapper.style.display = "none";
      }
    }
  } else if (data.type === "error") {
    icon.classList.add("error");
    iconElement.className = "fas fa-times";
    title.textContent = data.title || "Có lỗi xảy ra!";
    message.textContent = data.message || "Vui lòng thử lại sau.";

    // Hide details for error
    overlay.querySelector(".notification-details").style.display = "none";
  }

  // Show overlay
  overlay.classList.add("show");
}

function hideNotification() {
  const overlay = document.getElementById("customNotification");
  overlay.classList.remove("show");

  // Reset details display
  setTimeout(() => {
    overlay.querySelector(".notification-details").style.display = "block";
  }, 300);
}

// Close notification button
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("closeNotification");
  if (closeBtn) {
    closeBtn.addEventListener("click", hideNotification);
  }

  // Close on overlay click
  const overlay = document.getElementById("customNotification");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        hideNotification();
      }
    });
  }
});

// Back-to-top button behavior
(function () {
  const backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  // Show when scrolled down
  function toggleBackBtn() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 320) {
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Click and keyboard support
  backBtn.addEventListener("click", scrollToTop);
  backBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      scrollToTop();
    }
  });

  window.addEventListener("scroll", toggleBackBtn);
  window.addEventListener("load", toggleBackBtn);
})();

// Typing Effect Animation
const typingText = document.getElementById("typingText");
if (typingText) {
  const text = "Web Developer";
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150; // Speed of typing
  let deletingSpeed = 100; // Speed of deleting
  let pauseBeforeDelete = 2000; // Pause before deleting
  let pauseBeforeType = 500; // Pause before typing again

  function typeWriter() {
    if (!isDeleting) {
      // Typing mode
      if (charIndex < text.length) {
        typingText.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Finished typing, wait before deleting
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, pauseBeforeDelete);
      }
    } else {
      // Deleting mode
      if (charIndex > 0) {
        typingText.textContent = text.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, deletingSpeed);
      } else {
        // Finished deleting, wait before typing again
        isDeleting = false;
        setTimeout(typeWriter, pauseBeforeType);
      }
    }
  }

  // Start the typing effect after page load
  setTimeout(() => {
    typeWriter();
  }, 500);
}

// Header hide/show on scroll with active menu highlighting
const header = document.querySelector(".header");
let lastScrollTop = 0;

function handleHeaderScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Hide header at top, show when scrolling down
  if (scrollTop < 100) {
    header.classList.add("hidden");
    header.classList.remove("scrolled");
  } else {
    header.classList.remove("hidden");
    header.classList.add("scrolled");
  }

  lastScrollTop = scrollTop;
}

// Active menu highlighting based on scroll position
function highlightActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";
  const scrollPosition = window.pageYOffset + 200; // Offset for better detection

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  // Update active class on nav links
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// Combine scroll handlers
function handleScroll() {
  handleHeaderScroll();
  highlightActiveSection();
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);

// Simple animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Form validation and submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  // Validation functions
  function validateName(name) {
    if (name.trim().length < 2) {
      return "Họ tên phải có ít nhất 2 ký tự";
    }
    if (name.trim().length > 50) {
      return "Họ tên không được quá 50 ký tự";
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) {
      return "Họ tên chỉ được chứa chữ cái và khoảng trắng";
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không hợp lệ. Vui lòng nhập đúng định dạng email";
    }
    if (email.length > 100) {
      return "Email không được quá 100 ký tự";
    }
    return null;
  }

  function validatePhone(phone) {
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    if (cleanPhone === "") {
      return null; // Phone is optional
    }

    // Check if contains only numbers
    if (!/^\d+$/.test(cleanPhone)) {
      return "Số điện thoại chỉ được chứa số";
    }

    // Check length (Vietnam phone numbers)
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      return "Số điện thoại phải có 10 hoặc 11 số";
    }

    // Check if starts with valid prefix
    if (cleanPhone.length === 10 && !cleanPhone.startsWith("0")) {
      return "Số điện thoại phải bắt đầu bằng số 0";
    }

    return null;
  }

  function validateSubject(subject) {
    if (subject.trim().length < 3) {
      return "Chủ đề phải có ít nhất 3 ký tự";
    }
    if (subject.trim().length > 100) {
      return "Chủ đề không được quá 100 ký tự";
    }
    return null;
  }

  function validateMessage(message) {
    if (message.trim().length < 10) {
      return "Nội dung tin nhắn phải có ít nhất 10 ký tự";
    }
    if (message.trim().length > 1000) {
      return "Nội dung tin nhắn không được quá 1000 ký tự";
    }
    return null;
  }

  // Show error message
  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;

    // Remove existing error
    const existingError = formGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.color = "#ff6b6b";
    errorDiv.style.fontSize = "0.9rem";
    errorDiv.style.marginTop = "5px";
    errorDiv.style.animation = "shake 0.5s";

    formGroup.appendChild(errorDiv);
    input.style.borderColor = "#ff6b6b";
    input.style.boxShadow = "0 0 10px rgba(255, 107, 107, 0.3)";
  }

  // Clear error message
  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector(".error-message");

    if (errorDiv) {
      errorDiv.remove();
    }

    input.style.borderColor = "";
    input.style.boxShadow = "";
  }

  // Real-time validation
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      const error = validateName(this.value);
      if (error) {
        showError("name", error);
      } else {
        clearError("name");
      }
    });

    nameInput.addEventListener("input", function () {
      if (this.value.trim().length >= 2) {
        clearError("name");
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const error = validateEmail(this.value);
      if (error) {
        showError("email", error);
      } else {
        clearError("email");
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      if (this.value.trim() !== "") {
        const error = validatePhone(this.value);
        if (error) {
          showError("phone", error);
        } else {
          clearError("phone");
        }
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener("blur", function () {
      const error = validateSubject(this.value);
      if (error) {
        showError("subject", error);
      } else {
        clearError("subject");
      }
    });

    subjectInput.addEventListener("input", function () {
      if (this.value.trim().length >= 3) {
        clearError("subject");
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener("blur", function () {
      const error = validateMessage(this.value);
      if (error) {
        showError("message", error);
      } else {
        clearError("message");
      }
    });

    messageInput.addEventListener("input", function () {
      if (this.value.trim().length >= 10) {
        clearError("message");
      }
    });
  }

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Validate all fields
    let isValid = true;

    const nameError = validateName(name);
    if (nameError) {
      showError("name", nameError);
      isValid = false;
    } else {
      clearError("name");
    }

    const emailError = validateEmail(email);
    if (emailError) {
      showError("email", emailError);
      isValid = false;
    } else {
      clearError("email");
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      showError("phone", phoneError);
      isValid = false;
    } else {
      clearError("phone");
    }

    const subjectError = validateSubject(subject);
    if (subjectError) {
      showError("subject", subjectError);
      isValid = false;
    } else {
      clearError("subject");
    }

    const messageError = validateMessage(message);
    if (messageError) {
      showError("message", messageError);
      isValid = false;
    } else {
      clearError("message");
    }

    // If form is valid, submit
    if (isValid) {
      // Prepare form data
      const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      };

      // Show loading state
      const submitBtn = contactForm.querySelector(".btn-submit-modern");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.style.cursor = "not-allowed";

      // Send email using Formspree
      fetch("https://formspree.io/f/manplybw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Không cung cấp",
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject:
            "Liên hệ mới từ " + formData.name + " - " + formData.subject,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("SUCCESS! Email sent.");

            // Show success message
            submitBtn.innerHTML =
              '<i class="fas fa-check"></i> Đã gửi thành công!';
            submitBtn.style.background =
              "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
            submitBtn.style.opacity = "1";

            setTimeout(() => {
              showNotification({
                type: "success",
                title: "Email đã được gửi thành công!",
                message:
                  "Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.",
                details: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  subject: formData.subject,
                },
              });

              // Reset form
              contactForm.reset();

              // Reset button
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = "";
              submitBtn.disabled = false;
              submitBtn.style.cursor = "pointer";
            }, 1000);
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch((error) => {
          console.log("FAILED...", error);

          // Show error message
          submitBtn.innerHTML = '<i class="fas fa-times"></i> Gửi thất bại';
          submitBtn.style.background =
            "linear-gradient(120deg, #ff6b6b 0%, #ff8e8e 100%)";
          submitBtn.style.opacity = "1";

          showNotification({
            type: "error",
            title: "Có lỗi xảy ra khi gửi email!",
            message:
              "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua:\n📧 leminhhuy1122@gmail.com | 📱 0987653801",
          });

          // Reset button after 2 seconds
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
            submitBtn.style.cursor = "pointer";
            submitBtn.style.opacity = "1";
          }, 2000);
        });
    } else {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      showNotification({
        type: "error",
        title: "Thông tin chưa đầy đủ!",
        message: "Vui lòng kiểm tra lại và điền đầy đủ các trường bắt buộc.",
      });
    }
  });
}

// Profile Modal functionality
const showProfileBtn = document.getElementById("showProfileBtn");
const profileModal = document.getElementById("profileModal");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");

if (showProfileBtn && profileModal) {
  function showModal() {
    profileModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function hideModal() {
    profileModal.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  showProfileBtn.addEventListener("click", showModal);

  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", hideModal);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && profileModal.classList.contains("show")) {
      hideModal();
    }
  });

  // Social links are external, no special handling needed
}

// Skill bar animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = width;
    }, 500);
  });
}

// Trigger skill animation when skills section is visible
const skillsSection = document.querySelector("#skills");
if (skillsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(skillsSection);
}

// Timeline Road scroll animation is handled by CSS
// Profile section uses simple hover effects, no additional JavaScript needed

// Student Card Modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const showCardBtn = document.getElementById("showStudentCard");
  const closeCardBtn = document.getElementById("closeStudentCard");
  const cardModal = document.getElementById("studentCardModal");
  const cardFlip = document.getElementById("studentCardFlip");
  const modalBackdrop = cardModal?.querySelector(".modal-backdrop");

  // Show modal
  if (showCardBtn && cardModal) {
    showCardBtn.addEventListener("click", function () {
      cardModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  }

  // Close modal
  function closeModal() {
    if (cardModal) {
      cardModal.classList.remove("show");
      document.body.style.overflow = "auto";
      // Reset flip state when closing
      if (cardFlip && cardFlip.classList.contains("flipped")) {
        cardFlip.classList.remove("flipped");
      }
    }
  }

  if (closeCardBtn) {
    closeCardBtn.addEventListener("click", closeModal);
  }

  // Close on backdrop click
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
  }

  // Close with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cardModal?.classList.contains("show")) {
      closeModal();
    }
  });

  // Flip card on click
  if (cardFlip) {
    cardFlip.addEventListener("click", function (e) {
      // Don't flip if clicking on close button or links
      if (!e.target.closest(".close-card-btn") && !e.target.closest("a")) {
        this.classList.toggle("flipped");
      }
    });
  }
});

/* ==========================================
   GALLERY LIGHTBOX FUNCTIONALITY
   ========================================== */

// Gallery data
const galleryData = [
  {
    src: "assets/img/huy/1.jpg",
    title: "Khoảnh khắc thư giãn",
    description:
      "Tận hưởng không gian yên bình tại một quán cafe xinh đẹp ở Dalat",
    location: "Dalat, Vietnam",
    tags: [
      { icon: "fas fa-heart", text: "Lifestyle" },
      { icon: "fas fa-camera", text: "Photography" },
    ],
  },
  {
    src: "assets/img/huy/2.jpg",
    title: "Đêm lung linh",
    description: "Khám phá vẻ đẹp ban đêm của không gian độc đáo",
    location: "Night Time",
    tags: [
      { icon: "fas fa-moon", text: "Night" },
      { icon: "fas fa-city", text: "Urban" },
    ],
  },
  {
    src: "assets/img/huy/3.jpg",
    title: "Tĩnh lặng",
    description: "Giây phút suy ngẫm giữa thiên nhiên xanh mát",
    location: "Garden",
    tags: [
      { icon: "fas fa-leaf", text: "Nature" },
      { icon: "fas fa-spa", text: "Relax" },
    ],
  },
  {
    src: "assets/img/huy/4.jpg",
    title: "Hoàng hôn tuyệt đẹp",
    description: "Ngắm nhìn bình minh tuyệt đẹp trên bờ biển Nha Trang",
    location: "Nha Trang Beach",
    tags: [
      { icon: "fas fa-sun", text: "Sunset" },
      { icon: "fas fa-water", text: "Beach" },
      { icon: "fas fa-umbrella-beach", text: "Ocean" },
    ],
  },
];

let currentImageIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const imageLoader = document.querySelector(".image-loader");
  const closeLightboxBtn = document.getElementById("closeLightbox");
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");
  const viewAllBtn = document.querySelector(".btn-open-gallery");
  const galleryItems = document.querySelectorAll(
    ".gallery-item:not(.view-all)"
  );
  const thumbnails = document.querySelectorAll(".thumbnail-item");

  // Open lightbox from "View All" button
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", function () {
      openLightbox(0);
    });
  }

  // Open lightbox from gallery items
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const photoIndex = parseInt(this.getAttribute("data-photo-index"));
      if (!isNaN(photoIndex)) {
        openLightbox(photoIndex);
      }
    });
  });

  // Open lightbox from thumbnails
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      showImage(index);
    });
  });

  // Close lightbox
  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener("click", closeLightbox);
  }

  // Close on overlay click
  const lightboxOverlay = document.querySelector(".lightbox-overlay");
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener("click", closeLightbox);
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener("click", showPrevImage);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", showNextImage);
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrevImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  });

  // Functions
  function openLightbox(index) {
    currentImageIndex = index;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    showImage(index);
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showImage(index) {
    currentImageIndex = index;
    const data = galleryData[index];

    // Show loader
    imageLoader.classList.remove("hidden");
    lightboxImage.classList.remove("loaded");

    // Update image
    lightboxImage.src = data.src;
    lightboxImage.onload = function () {
      imageLoader.classList.add("hidden");
      lightboxImage.classList.add("loaded");
    };

    // Update info
    document.getElementById("lightboxTitle").textContent = data.title;
    document.getElementById("lightboxDescription").textContent =
      data.description;
    document.getElementById("lightboxLocation").textContent = data.location;
    document.getElementById("currentImageNum").textContent = index + 1;
    document.getElementById("totalImages").textContent = galleryData.length;

    // Update tags
    const tagsContainer = document.getElementById("lightboxTags");
    tagsContainer.innerHTML = data.tags
      .map(
        (tag) => `
      <span class="tag">
        <i class="${tag.icon}"></i>
        ${tag.text}
      </span>
    `
      )
      .join("");

    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    // Scroll thumbnail into view
    const activeThumbnail = document.querySelector(".thumbnail-item.active");
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    showImage(currentImageIndex);
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    showImage(currentImageIndex);
  }

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  lightbox.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage();
    }
  }
});
