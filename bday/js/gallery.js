// Swiper with creative zoom
export function initGallery() {
    new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      effect: 'creative',
      creativeEffect: {
        prev: {
          opacity: 0,
          scale: 0.8,
        },
        next: {
          opacity: 1,
          scale: 1,
        }
      },
      speed: 800
    });
  }
  