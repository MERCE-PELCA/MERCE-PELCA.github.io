(() => {
  const lessons = Array.from(document.querySelectorAll('.mooc-lesson'));
  if (!lessons.length) return;

  const canEmbed = /^https?:$/.test(window.location.protocol);
  const referrerPolicy = 'strict-origin-when-cross-origin';
  let apiReady;
  const loadYouTubeApi = () => {
    if (window.YT && typeof window.YT.Player === 'function') return Promise.resolve(window.YT);
    if (apiReady) return apiReady;
    apiReady = new Promise(resolve => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT);
        if (typeof previousReady === 'function') previousReady();
      };
      const script = document.createElement('script');
      script.referrerPolicy = referrerPolicy;
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      // The iframe can still play if only the optional error-reporting API is blocked.
      script.addEventListener('error', () => resolve(null));
      document.head.append(script);
    });
    return apiReady;
  };

  const states = lessons.map((lesson, index) => {
    const player = lesson.querySelector('.mooc-player');
    if (!player) return null;
    const link = lesson.querySelector('.mooc-youtube');
    const notice = document.createElement('p');
    notice.className = 'mooc-playback-note';
    notice.setAttribute('role', 'status');
    notice.hidden = true;
    player.before(notice);
    return { lesson, player, link, notice, index, iframe: null, controller: null };
  }).filter(Boolean);

  const clearNotice = state => {
    state.notice.hidden = true;
    state.notice.textContent = '';
    if (state.link) state.link.classList.remove('mooc-youtube-fallback');
  };
  const showNotice = (state, message) => {
    state.notice.textContent = message;
    state.notice.hidden = false;
    if (state.link) state.link.classList.add('mooc-youtube-fallback');
  };
  const stop = state => {
    // Invalidate pending API callbacks before destroying the current player.
    state.iframe = null;
    const controller = state.controller;
    state.controller = null;
    if (controller) {
      try {
        controller.destroy();
      } catch {
        // Removing the iframe below also stops playback if API cleanup fails.
      }
    }
    state.player.replaceChildren();
    clearNotice(state);
  };
  const syncPlayer = state => {
    if (!state.lesson.open) {
      stop(state);
      return;
    }
    states.forEach(other => {
      if (other === state) return;
      other.lesson.open = false;
      stop(other);
    });
    if (!canEmbed) {
      // file:// has no HTTP page identity; do not load a player that will fail with 153.
      showNotice(state, 'Watch this video on YouTube to play it from this local preview.');
      return;
    }
    if (state.iframe || !/^[A-Za-z0-9_-]{11}$/.test(state.player.dataset.videoId)) return;
    clearNotice(state);
    const iframe = document.createElement('iframe');
    iframe.id = 'mooc-video-' + state.index;
    iframe.title = state.player.dataset.videoTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = referrerPolicy;
    // Use the actual hosting origin, including localhost during preview.
    iframe.src = 'https://www.youtube.com/embed/' + state.player.dataset.videoId +
      '?rel=0&playsinline=1&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
    state.iframe = iframe;
    state.player.append(iframe);
    loadYouTubeApi().then(api => {
      if (!api || state.iframe !== iframe || !state.lesson.open) return;
      try {
        state.controller = new api.Player(iframe, {
          events: {
            onError: event => {
              if (state.iframe !== iframe || !state.lesson.open) return;
              const message = Number(event.data) === 153
                ? 'Embedded playback is unavailable in this browser. Watch this video directly on YouTube.'
                : 'YouTube could not play this embedded video. Open it on YouTube for more information.';
              showNotice(state, message);
            },
            onStateChange: event => {
              if (state.iframe === iframe && Number(event.data) === 1) clearNotice(state);
            }
          }
        });
      } catch {
        // Keep the ordinary iframe and direct link usable if API setup fails.
      }
    });
  };

  states.forEach(state => {
    state.lesson.addEventListener('toggle', () => syncPlayer(state));
    if (state.lesson.open) syncPlayer(state);
  });

  // Closing the previous-installation group must stop all of its child players.
  document.querySelectorAll('.mooc-archive').forEach(archive => {
    archive.addEventListener('toggle', () => {
      if (archive.open) return;
      states.forEach(state => {
        if (!archive.contains(state.lesson)) return;
        state.lesson.open = false;
        stop(state);
      });
    });
  });
})();
