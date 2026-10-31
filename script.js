/**
 * SHAM SALON & SANCTUARY
 * Interactive Client Experience Scripts
 * Theme: Fresh Canopy (#2D3E2C) & Lime Sprout (#E4FD97)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Toast Notification Helper
  // --------------------------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toastNotification || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3800);
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-footer a');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // 3. Header Scroll Effect & Active Navigation
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --------------------------------------------------------------------------
  // 4. Services Menu Category Filter Tabs
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetCategory = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Form Elements & Pre-selection from Cards
  // --------------------------------------------------------------------------
  const serviceSelect = document.getElementById('serviceSelect');
  const stylistSelect = document.getElementById('stylistSelect');
  const bookingDateInput = document.getElementById('bookingDate');

  // Set minimum date for booking to today
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  function smoothScrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Pre-fill from Ritual Cards
  const ritualButtons = document.querySelectorAll('.btn-card-action');
  ritualButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = btn.getAttribute('data-service');
      const stylist = btn.getAttribute('data-stylist');

      if (service && serviceSelect) {
        // Find matching option
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.includes(service) || service.includes(serviceSelect.options[i].value)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (stylist && stylistSelect) {
        for (let i = 0; i < stylistSelect.options.length; i++) {
          if (stylistSelect.options[i].value.includes(stylist)) {
            stylistSelect.selectedIndex = i;
            break;
          }
        }
      }

      smoothScrollToBooking();
      showToast(`Selected "${service}" ritual for reservation`);
    });
  });

  // Pre-fill from Services Explorer List
  const selectServiceBtns = document.querySelectorAll('.btn-select-service');
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service-name');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.includes(serviceName) || serviceName.includes(serviceSelect.options[i].value)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      smoothScrollToBooking();
      showToast(`Added "${serviceName}" to reservation form`);
    });
  });

  // Pre-fill from Artisans Cards ("Book with [Name]")
  const bookArtisanBtns = document.querySelectorAll('.btn-book-artisan');
  bookArtisanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const artisanName = btn.getAttribute('data-artisan');
      if (stylistSelect && artisanName) {
        for (let i = 0; i < stylistSelect.options.length; i++) {
          if (stylistSelect.options[i].value.includes(artisanName)) {
            stylistSelect.selectedIndex = i;
            break;
          }
        }
      }
      smoothScrollToBooking();
      showToast(`Artisan ${artisanName} assigned to chair`);
    });
  });

  // --------------------------------------------------------------------------
  // 6. Reservation Form Submission & Confirmation Modal
  // --------------------------------------------------------------------------
  const reservationForm = document.getElementById('reservationForm');
  const bookingModalOverlay = document.getElementById('bookingModalOverlay');
  const modalBookingSummary = document.getElementById('modalBookingSummary');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const submitBookingBtn = document.getElementById('submitBookingBtn');

  function openModal() {
    bookingModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    bookingModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  if (bookingModalOverlay) {
    bookingModalOverlay.addEventListener('click', (e) => {
      if (e.target === bookingModalOverlay) closeModal();
    });
  }

  // WhatsApp Concierge Number for Sham Salon
  const WHATSAPP_CONCIERGE_NUMBER = '18005247426';

  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'Selected Date';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = serviceSelect ? serviceSelect.value : '';
      const stylist = stylistSelect ? stylistSelect.value : '';
      const date = bookingDateInput ? bookingDateInput.value : '';
      const timeSelect = document.getElementById('timeSlotSelect');
      const time = timeSelect ? timeSelect.value : '';
      const nameInput = document.getElementById('clientName');
      const name = nameInput ? nameInput.value.trim() : '';
      const phoneInput = document.getElementById('clientPhone');
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const notesInput = document.getElementById('clientNotes');
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!service) {
        showToast('Please select a salon ritual or service', false);
        if (serviceSelect) serviceSelect.focus();
        return;
      }

      if (!date) {
        showToast('Please select your preferred date', false);
        if (bookingDateInput) bookingDateInput.focus();
        return;
      }

      if (!time) {
        showToast('Please select your preferred time slot', false);
        if (timeSelect) timeSelect.focus();
        return;
      }

      if (!name) {
        showToast('Please provide your name', false);
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone) {
        showToast('Please provide your phone number for booking confirmation', false);
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Visual feedback on button
      const originalHTML = submitBookingBtn.innerHTML;
      submitBookingBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="animation: spin 1s linear infinite;" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-dashoffset="10"/>
        </svg>
        <span>Opening WhatsApp...</span>
      `;
      submitBookingBtn.disabled = true;

      setTimeout(() => {
        submitBookingBtn.innerHTML = originalHTML;
        submitBookingBtn.disabled = false;

        // Generate enquiry reference code
        const resCode = 'SHAM-' + Math.floor(1000 + Math.random() * 9000);
        const formattedDate = formatDisplayDate(date);

        // Build WhatsApp Appointment Enquiry Message
        const messageText =
`✨ *SHAM SALON & SANCTUARY - APPOINTMENT ENQUIRY* ✨\n\n` +
`🔖 *Enquiry Ref:* ${resCode}\n` +
`👤 *Guest Name:* ${name}\n` +
`📞 *Contact Number:* ${phone}\n` +
`🌿 *Selected Ritual:* ${service}\n` +
`✂️ *Preferred Artisan:* ${stylist || 'Any Available Master Artisan'}\n` +
`📅 *Date:* ${formattedDate}\n` +
`⏰ *Time Slot:* ${time}\n` +
(notes ? `💬 *Special Requests:* ${notes}\n` : '') +
`\n_Hello Concierge, I would like to book this appointment at Sham Salon. Please confirm chair availability. Thank you!_`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_CONCIERGE_NUMBER}?text=${encodeURIComponent(messageText)}`;

        // Open WhatsApp directly in new window/tab
        window.open(whatsappUrl, '_blank');

        // Update modal direct link (in case popup was blocked or for re-opening)
        const modalWhatsappLink = document.getElementById('modalWhatsappLink');
        if (modalWhatsappLink) {
          modalWhatsappLink.href = whatsappUrl;
        }

        // Build Summary HTML in Modal
        if (modalBookingSummary) {
          modalBookingSummary.innerHTML = `
            <div class="summary-row">
              <span>Enquiry Reference:</span>
              <strong>${resCode}</strong>
            </div>
            <div class="summary-row">
              <span>Guest Name:</span>
              <strong>${name}</strong>
            </div>
            <div class="summary-row">
              <span>Selected Ritual:</span>
              <strong>${service}</strong>
            </div>
            <div class="summary-row">
              <span>Master Artisan:</span>
              <strong>${stylist || 'Any Available Artisan'}</strong>
            </div>
            <div class="summary-row">
              <span>Date &amp; Time:</span>
              <strong>${formattedDate} at ${time}</strong>
            </div>
            <div class="summary-row">
              <span>Contact Phone:</span>
              <strong>${phone}</strong>
            </div>
            ${notes ? `
            <div class="summary-row">
              <span>Special Requests:</span>
              <strong>${notes}</strong>
            </div>` : ''}
          `;
        }

        openModal();
        showToast(`Enquiry prepared! Opening WhatsApp chat for ${name}...`);
        reservationForm.reset();
        if (bookingDateInput) {
          bookingDateInput.value = new Date().toISOString().split('T')[0];
        }
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // 7. FAQ Accordion Interaction (Centered Minus/Plus Icons)
  // --------------------------------------------------------------------------
  const minusIconSVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  const plusIconSVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other open accordion items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.innerHTML = plusIconSVG;
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          if (icon) icon.innerHTML = minusIconSVG;
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 8. Gallery Category Filter Tabs
  // --------------------------------------------------------------------------
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItemCards = document.querySelectorAll('.gallery-item-card');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      galleryItemCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Gallery Lightbox Modal
  // --------------------------------------------------------------------------
  const galleryModalOverlay = document.getElementById('galleryModalOverlay');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalTitle = document.getElementById('galleryModalTitle');
  const galleryModalTag = document.getElementById('galleryModalTag');
  const galleryModalClose = document.getElementById('galleryModalClose');
  const galleryModalBookBtn = document.getElementById('galleryModalBookBtn');

  function openGalleryLightbox(imgSrc, title, tag) {
    if (!galleryModalOverlay || !galleryModalImg) return;
    galleryModalImg.src = imgSrc;
    galleryModalImg.alt = title || 'Client Artistry';
    if (galleryModalTitle) galleryModalTitle.textContent = title || 'Client Transformation';
    if (galleryModalTag) galleryModalTag.textContent = tag || 'Sanctuary Artistry';
    galleryModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryLightbox() {
    if (!galleryModalOverlay) return;
    galleryModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger from zoom buttons
  const galleryZoomBtns = document.querySelectorAll('.gallery-zoom-btn');
  galleryZoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const tag = btn.getAttribute('data-tag');
      openGalleryLightbox(imgSrc, title, tag);
    });
  });

  // Trigger by clicking on gallery card image box
  const galleryImgBoxes = document.querySelectorAll('.gallery-img-box');
  galleryImgBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-book-btn')) return;
      const zoomBtn = box.querySelector('.gallery-zoom-btn');
      if (zoomBtn) {
        const imgSrc = zoomBtn.getAttribute('data-img');
        const title = zoomBtn.getAttribute('data-title');
        const tag = zoomBtn.getAttribute('data-tag');
        openGalleryLightbox(imgSrc, title, tag);
      }
    });
  });

  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', closeGalleryLightbox);
  }

  if (galleryModalOverlay) {
    galleryModalOverlay.addEventListener('click', (e) => {
      if (e.target === galleryModalOverlay) {
        closeGalleryLightbox();
      }
    });
  }

  if (galleryModalBookBtn) {
    galleryModalBookBtn.addEventListener('click', () => {
      closeGalleryLightbox();
    });
  }

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (galleryModalOverlay && galleryModalOverlay.classList.contains('active')) {
        closeGalleryLightbox();
      }
    }
  });
});
