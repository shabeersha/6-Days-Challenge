// Initialize Lenis Smooth Scroll only on desktop
let lenis;
if (window.innerWidth > 768) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothHover: false,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}





// FAQ Accordion
const accordionBtns = document.querySelectorAll('.accordion-btn');
accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.accordion-content').style.maxHeight = null;
            i.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});



// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Video Carousel Auto-Scroll
const carousel = document.querySelector('.video-carousel');
let isPaused = false;
let autoScrollEnabled = true;

if (carousel) {
    // Clone items for infinite loop illusion
    const items = Array.from(carousel.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });

    let scrollAmount = carousel.scrollLeft;
    const scrollSpeed = 0.5; // Smooth scroll speed
    let animationId;

    function autoScroll() {
        if (!isPaused && autoScrollEnabled) {
            scrollAmount += scrollSpeed;
            if (scrollAmount >= carousel.scrollWidth / 2) {
                scrollAmount = 0;
            }
            carousel.scrollLeft = scrollAmount;
        }
        animationId = requestAnimationFrame(autoScroll);
    }
    animationId = requestAnimationFrame(autoScroll);

    carousel.addEventListener('scroll', () => {
        if (isPaused) {
            scrollAmount = carousel.scrollLeft;
        }
    });

    const pauseScroll = () => isPaused = true;
    const resumeScroll = () => {
        isPaused = false;
        scrollAmount = carousel.scrollLeft;
    };

    carousel.addEventListener('mouseenter', pauseScroll);
    carousel.addEventListener('mouseleave', resumeScroll);
    carousel.addEventListener('touchstart', pauseScroll);
    carousel.addEventListener('touchend', resumeScroll);
}

// Inline Video Player Logic
document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', function () {
        const videoSrc = this.getAttribute('data-video');
        const thumb = this.querySelector('.video-thumb');
        if (this.classList.contains('playing')) return;

        document.querySelectorAll('.video-card.playing').forEach(otherCard => {
            const otherVideo = otherCard.querySelector('video');
            if (otherVideo) {
                otherVideo.pause();
                otherVideo.remove();
            }
            otherCard.classList.remove('playing');
        });

        this.classList.add('playing');
        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.onended = () => {
            video.remove();
            this.classList.remove('playing');
            autoScrollEnabled = true;
        };
        thumb.appendChild(video);
        autoScrollEnabled = false;

        // Auto-scroll to center on mobile/desktop when playing
        this.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Initialize animations after all assets are loaded
window.addEventListener('load', () => {
    // Reveal sections with staggered children
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const cards = section.querySelectorAll('.benefit-card, .stat, .step, .testimonial, .video-card, .day-card, .accordion-item, .pricing-card');

        if (title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 95%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: "expo.out"
            });
        }

        if (subtitle) {
            gsap.from(subtitle, {
                scrollTrigger: {
                    trigger: subtitle,
                    start: "top 95%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.2,
                ease: "expo.out"
            });
        }

        if (cards.length > 0) {
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    onEnter: () => {
                        // Fail-safe: ensure opacity is 1 if animation completes or triggered
                        gsap.to(cards, { opacity: 1, duration: 0.5 });
                    }
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });
        }
    });




    // Hero Matched Animation
    if (document.querySelector('.hero-match-container')) {
        gsap.utils.toArray('.hm-step').forEach((step, i) => {
            gsap.from(step.querySelectorAll('.hm-card, .hm-content'), {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
                clearProps: "all"
            });
        });

        // Reveal Blended CTA
        gsap.from('.blended-cta', {
            scrollTrigger: {
                trigger: '.blended-cta',
                start: 'top 85%'
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.2
        });
    }




    // Final refresh for all ScrollTriggers
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

// Specialized animations logic
const heroTL = gsap.timeline({ delay: 0.2 });

if (document.querySelector('.hero-glass-card')) {
    heroTL.from('.hero-glass-card', { opacity: 0, x: -100, duration: 1.2, ease: "power4.out" })
        .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.8")
        .from('.hero-content h1', { opacity: 0, y: 40, duration: 1, ease: "power4.out" }, "-=0.6")
        .from('.hero-subheading', { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .from('.hero-bullets li', { opacity: 0, x: -20, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.4")
        .from('.hero-cta-group', { opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3");
}

if (document.querySelector('.video-container')) {
    gsap.from('.video-container', {
        opacity: 0,
        x: 100,
        scale: 0.8,
        rotateY: -20,
        duration: 1.5,
        delay: 0.5,
        ease: "power4.out"
    });
}




// Modal Logic
const modal = document.getElementById('registration-modal');
const modalBtns = document.querySelectorAll('.btn-trigger-modal');
const closeBtns = document.querySelectorAll('.modal-close, .modal-overlay, .modal-close-btn');
const registrationForm = document.getElementById('registration-form');
const registrationFormContent = document.getElementById('registration-form-content');
const successMessage = document.getElementById('success-message');

const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
};

const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    // Reset form and message state after closing
    setTimeout(() => {
        registrationForm.reset();
        registrationFormContent.style.display = 'block';
        successMessage.style.display = 'none';
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
    }, 300);
};

modalBtns.forEach(btn => btn.addEventListener('click', openModal));
modalBtns.forEach(btn => btn.addEventListener('click', openModal));

// Specific Close Modal Logic
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// Overlay closing - only if NOT successful state
document.querySelector('.modal-overlay').addEventListener('click', () => {
    if (successMessage.style.display !== 'block') {
        closeModal();
    }
});

// Initialize intl-tel-input
const phoneInput = document.querySelector("#mobile");
let iti;
if (phoneInput) {
    iti = window.intlTelInput(phoneInput, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Fix for Lenis scroll hijacking
    const countryList = document.querySelector('.iti__country-list');
    if (countryList) {
        countryList.setAttribute('data-lenis-prevent', '');
    }
}

// Form Validation and Submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Populate hidden country code field
    if (iti) {
        const countryData = iti.getSelectedCountryData();
        const hiddenInput = document.getElementById("hiddenCountryCode");
        if (hiddenInput && countryData.dialCode) {
            hiddenInput.value = "+" + countryData.dialCode;
        }
    }

    let isValid = true;
    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData.entries());

    // Simple validation
    const validateField = (id, condition) => {
        const field = document.getElementById(id);
        const group = field.closest('.form-group');
        if (!condition) {
            group.classList.add('error');
            isValid = false;
        } else {
            group.classList.remove('error');
        }
    };

    validateField('full-name', data['full-name'].trim() !== '');
    validateField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data['email']));
    // validateField('mobile', /^[0-9]{10}$/.test(data['mobile'])); // Old strict 10 digit check
    validateField('mobile', /^[0-9]{7,15}$/.test(data['mobile'])); // More lenient for international
    validateField('currentStatus', data['currentStatus'] && data['currentStatus'] !== '');



    if (isValid) {
        // Optimistic UI: Show success immediately
        registrationFormContent.style.display = 'none';
        successMessage.style.display = 'block';

        // 1. Submit to Google Sheets (Background)
        const googleSheetURL = 'https://script.google.com/macros/s/AKfycbyw4w1SkeQRAj4h10Ep2txu4vuiglQVM3ny-U6XxJpoWy_JgFaIpb996yOBjXboHFLIOQ/exec';
        const googleSheetRequest = fetch(googleSheetURL, { method: 'POST', body: formData, mode: 'no-cors' })
            .catch(error => console.error('Google Sheet Error:', error));

        // 2. Submit to Main Server API (Background)
        const mainServerURL = 'https://support-api.brototype.com/api/users/student';

        // Prepare JSON data
        // Name Splitting Logic: If space, split; else lastName is "Nil"
        const fullName = (data['full-name'] || '').trim();
        let firstName = fullName;
        let lastName = 'Nil';

        if (fullName.includes(' ')) {
            const parts = fullName.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' '); // Joins the rest as last name
        }

        const jsonData = {
            ...data,
            firstName: firstName,
            lastName: lastName,
            duration: Number(data['duration']) // Ensure number type
        };

        const mainServerRequest = fetch(mainServerURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        }).catch(error => console.error('Main Server API Error:', error));

        // Execute both (Fire and forget from UI perspective)
        Promise.all([googleSheetRequest, mainServerRequest]);

        // Meta Pixel Tracking - Form Submission
        const pageName = window.location.pathname.includes('2026-new-year')
            ? '6DaysChallenge-2026NewYearOffer'
            : '6DaysChallenge-Graduates';

        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_name: `${pageName}-Form`,
                value: 0.00,
                currency: 'INR'
            });
        }
    }

});

// Meta Pixel Tracking - CTA Clicks (Custom Granular Events)
document.addEventListener('DOMContentLoaded', () => {
    // Determine page context for the event name
    const pageContext = window.location.pathname.includes('2026-new-year')
        ? '6DaysChallenge-2026NewYearOffer'
        : '6DaysChallenge-Graduates';

    // Select all elements with data-cta-location attribute
    const ctaButtons = document.querySelectorAll('[data-cta-location]');

    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.getAttribute('data-cta-location');
            if (location && typeof fbq === 'function') {
                // Construct Custom Event Name
                // Format: PageName-Location-CTA-Clicked
                // Example: 6DaysChallenge-2026NewYearOffer-Hero-CTA-Clicked
                const eventName = `${pageContext}-${location}-CTA-Clicked`;

                fbq('track', eventName);
            }
        });
    });
});

// UTM Parameter Population
document.addEventListener('DOMContentLoaded', () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const form = document.getElementById('registration-form');

        if (form) {
            // List of tracking parameters to look for
            const trackingParams = [
                'zf_referrer_name', 'zf_redirect_url', 'zc_gad',
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                'utm_id', 'utm_adgroup', 'utm_matchtype', 'utm_audience',
                'utm_adgroupid', 'ref', 'utm_network', 'utm_placement', 'utm_hp'
            ];

            trackingParams.forEach(param => {
                const value = urlParams.get(param);
                if (value) {
                    const input = form.querySelector(`input[name="${param}"]`);
                    if (input) {
                        input.value = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error populating tracking parameters:', e);
    }
});
