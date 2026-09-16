(() => {
  const root = document.documentElement;
  const description = document.getElementById('direction-description');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const directions = {
    signature: {
      description: 'Signature · L’identité d’origine, modernisée : le logo complet, le dégradé violet et rose et une explication immédiate du logiciel.',
      color: '#7f82bc'
    },
    immersion: {
      description: 'Immersion · Le même message dans une ambiance sombre, avec un logo lumineux et une annonce V2.0 plus spectaculaire.',
      color: '#11111b'
    },
    studio: {
      description: 'Studio · La piste la plus proche du site d’origine : une fenêtre plus compacte sur le dégradé violet et rose.',
      color: '#7f82bc'
    }
  };
  const buttons = document.querySelectorAll('[data-select-direction]');
  const reveals = document.querySelectorAll('.reveal');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.selectDirection;
      if (!directions[selected] || root.dataset.direction === selected) return;
      root.dataset.direction = selected;
      buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      description.textContent = directions[selected].description;
      themeColor.setAttribute('content', directions[selected].color);
      // Previously revealed content stays visible when comparing layouts.
      reveals.forEach(element => element.classList.add('is-visible'));
    });
  });

  const mobileMenu = document.querySelector('.mobile-nav');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { mobileMenu.open = false; });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.open) {
        mobileMenu.open = false;
        mobileMenu.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', event => {
      if (!mobileMenu.contains(event.target)) mobileMenu.open = false;
    });
  }

  const aboutTrigger = document.querySelector('.about-trigger');
  const aboutDialog = document.getElementById('about-pelca');
  if (aboutTrigger && aboutDialog) {
    aboutTrigger.addEventListener('click', () => {
      if (aboutDialog.open) return;
      aboutDialog.showModal();
      aboutDialog.scrollTop = 0;
      root.classList.add('about-dialog-open');
    });
    aboutDialog.addEventListener('close', () => {
      root.classList.remove('about-dialog-open');
      aboutTrigger.focus();
    });
    aboutDialog.addEventListener('click', event => {
      if (event.target !== aboutDialog) return;
      const bounds = aboutDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        aboutDialog.close();
      }
    });
  }

  const trafficLink = document.querySelector('[data-traffic-link]');
  if (trafficLink) {
    trafficLink.addEventListener('click', event => {
      event.preventDefault();
      const password = window.prompt('Enter password to access Traffic:');
      if (password === 'MERCE2025') {
        window.open('https://pelca-analytics.github.io', '_blank', 'noopener');
      } else if (password !== null) {
        window.alert('Incorrect password.');
      }
    });
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Suspend continuous decoration while the tab is in the background.
  const syncVisibility = () => {
    root.classList.toggle('page-inactive', document.hidden);
  };
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
    root.classList.add('motion-ready');
    motionPreference.addEventListener('change', event => {
      if (event.matches) {
        root.classList.remove('motion-ready');
        observer.disconnect();
      }
    });
  }
})();
