/* Progressive enhancement: each preview remains a normal image link without JS. */
(() => {
  'use strict';
  const dialog = document.getElementById('merch-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const media = dialog.querySelector('.merch-dialog-media');
  const title = document.getElementById('merch-dialog-title');
  const caption = document.getElementById('merch-dialog-caption');
  let opener = null;

  document.querySelectorAll('#goods [data-merch-title]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      const svg = link.querySelector('svg');
      let visual;
      if (svg) {
        visual = svg.cloneNode(true);
        visual.removeAttribute('aria-hidden');
        visual.setAttribute('role', 'img');
        visual.setAttribute('aria-label', link.dataset.merchLabel);
        visual.removeAttribute('class');
        // A clone needs its own clipping IDs so it never collides with the cards.
        visual.querySelectorAll('[id]').forEach(node => {
          const oldId = node.id;
          const newId = `${oldId}-detail`;
          node.id = newId;
          visual.querySelectorAll('[clip-path]').forEach(image => {
            if (image.getAttribute('clip-path') === `url(#${oldId})`) image.setAttribute('clip-path', `url(#${newId})`);
          });
        });
      } else {
        visual = new Image();
        visual.src = link.href;
        visual.alt = link.dataset.merchLabel;
        visual.decoding = 'async';
      }
      media.replaceChildren(visual);
      title.textContent = link.dataset.merchTitle;
      caption.textContent = link.dataset.merchLabel;
      dialog.classList.toggle('is-lineup', link.dataset.merchTitle === 'THE FIVE');
      dialog.classList.toggle('is-lookbook', link.dataset.merchTitle === 'LUNA');
      dialog.style.setProperty('--merch-modal-tint', link.dataset.merchColor || '#fff6fa');
      dialog.showModal();
      document.body.classList.add('merch-modal-open');
    });
  });

  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('merch-modal-open');
    if (opener && opener.isConnected) opener.focus({preventScroll: true});
  });
})();
