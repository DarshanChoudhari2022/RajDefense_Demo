const sequence = document.querySelector('.sequence');
const stage = document.querySelector('.stage');
const photo = document.querySelector('.air');
const readout = document.querySelector('.readout');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.max(0, Math.min(1, value));
let pending = false;
function paint() {
  pending = false;
  const range = sequence.offsetHeight - stage.offsetHeight;
  const progress = motion.matches || range <= 0 ? 0 : clamp(-sequence.getBoundingClientRect().top / range);
  stage.style.setProperty('--zoom', 1 + progress * .22);
  stage.style.setProperty('--lead', 1 - clamp(progress * 2.2));
  stage.style.setProperty('--rise', -progress * 80 + 'px');
  stage.style.setProperty('--reveal', clamp((progress - .42) * 2.5));
  stage.style.setProperty('--mark', .83 + progress * .17);
  photo.style.opacity = 1 - progress * .90;
  readout.textContent = String(Math.round(progress * 100)).padStart(3,'0') + '%';
}
function schedule() {
  if (!pending) { pending = true; requestAnimationFrame(paint); }
}
addEventListener('scroll', schedule, {passive:true});
addEventListener('resize', schedule);
motion.addEventListener('change', schedule);
paint();
