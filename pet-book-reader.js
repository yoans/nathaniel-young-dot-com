(() => {
  const first = document.getElementById('book-left');
  const second = document.getElementById('book-right');
  if (!first || !second) return;
  const previous = document.getElementById('book-prev');
  const next = document.getElementById('book-next');
  const count = document.getElementById('page-count');
  const base = first.dataset.base;
  let page = 6;
  const total = 24;
  function show() {
    first.src = `${base}/page-${String(page).padStart(2, '0')}.jpg`;
    if (page + 1 <= total) second.src = `${base}/page-${String(page + 1).padStart(2, '0')}.jpg`;
    else second.removeAttribute('src');
    first.alt = `Coda's Magical Twilight Adventure, PDF page ${page}`;
    second.alt = `Coda's Magical Twilight Adventure, PDF page ${page + 1}`;
    second.hidden = page + 1 > total;
    previous.disabled = page <= 2;
    next.disabled = page + 1 >= total;
    count.textContent = page === total ? `PDF page ${page} of ${total}` : `PDF pages ${page}–${page + 1} of ${total}`;
  }
  previous.addEventListener('click', () => { if (page > 2) {page -= 2; show();} });
  next.addEventListener('click', () => { if (page + 1 < total) {page += 2; show();} });
  document.getElementById('book-reader').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && page > 2) { page -= 2; show(); event.preventDefault(); }
    if (event.key === 'ArrowRight' && page + 1 < total) { page += 2; show(); event.preventDefault(); }
  });
  show();
})();
