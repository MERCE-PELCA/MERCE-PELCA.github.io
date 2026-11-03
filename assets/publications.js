(() => {
  const controls = document.getElementById('publication-controls');
  const grid = document.getElementById('publication-grid');
  if (!controls || !grid) return;

  const search = document.getElementById('publication-search');
  const year = document.getElementById('publication-year');
  const sort = document.getElementById('publication-sort');
  const results = document.getElementById('publication-results');
  const reset = document.getElementById('publication-reset');
  const empty = document.getElementById('publication-empty');
  const typeButtons = Array.from(controls.querySelectorAll('[data-publication-type]'));
  const fold = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const entries = Array.from(grid.querySelectorAll('.publication-card')).map(card => ({
    card,
    title: card.querySelector('.publication-title').textContent,
    search: fold(Array.from(card.querySelectorAll('.publication-title, .publication-authors, .publication-venue, .publication-citation-text')).map(field => field.textContent).join(' ')),
    type: card.dataset.type,
    year: card.dataset.year,
    date: card.dataset.date
  }));
  let selectedType = '';

  const update = () => {
    const words = fold(search.value).trim().split(/\s+/).filter(Boolean);
    const sorted = [...entries].sort((a, b) => {
      if (sort.value === 'title') return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
      if (!a.date && b.date) return 1;
      if (a.date && !b.date) return -1;
      return sort.value === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
    let count = 0;
    sorted.forEach(entry => {
      const matches = (!selectedType || entry.type === selectedType) &&
        (!year.value || (year.value === 'undated' ? !entry.year : entry.year === year.value)) &&
        words.every(word => entry.search.includes(word));
      entry.card.hidden = !matches;
      if (matches) count++;
      grid.append(entry.card);
    });
    typeButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.publicationType === selectedType));
    });
    results.textContent = `${count} resource${count === 1 ? '' : 's'}`;
    empty.hidden = count !== 0;
    reset.hidden = !words.length && !year.value && !selectedType;
  };

  search.addEventListener('input', update);
  year.addEventListener('change', update);
  sort.addEventListener('change', update);
  typeButtons.forEach(button => button.addEventListener('click', () => {
    selectedType = button.dataset.publicationType;
    update();
  }));
  reset.addEventListener('click', () => {
    search.value = '';
    year.value = '';
    selectedType = '';
    update();
    search.focus();
  });

  const legacyCopy = text => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied;
    try {
      copied = document.execCommand('copy');
    } finally {
      field.remove();
    }
    if (!copied) throw new Error('Copy unavailable');
  };
  entries.forEach(({ card }) => {
    const copy = card.querySelector('.publication-copy');
    if (!copy) return;
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const citation = card.querySelector('.publication-citation-text').textContent.trim();
      const status = card.querySelector('.publication-copy-status');
      copy.disabled = true;
      try {
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Use fallback');
          await navigator.clipboard.writeText(citation);
        } catch {
          legacyCopy(citation);
        }
        status.textContent = 'Citation copied.';
      } catch {
        status.textContent = 'Select the citation text to copy it.';
      } finally {
        copy.disabled = false;
        copy.focus();
      }
    });
  });

  update();
  controls.hidden = false;
})();
