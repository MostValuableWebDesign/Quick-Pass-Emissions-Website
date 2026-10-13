document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const mapButton = document.querySelector('#load-map');
mapButton.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = mapButton.dataset.mapUrl;
  frame.title = 'Quick Pass Emissions location in Conyers, Georgia';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.allowFullscreen = true;
  document.querySelector('#map-container').replaceChildren(frame);
  frame.focus();
});
// A details link works with or without JavaScript; JS also expands its target.
document.querySelectorAll('a[href="#tag-details"]').forEach(link => {
  link.addEventListener('click', () => { document.querySelector('#tag-details').open = true; });
});
