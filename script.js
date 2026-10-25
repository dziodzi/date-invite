// Здесь можно вписать выбранное место, день и время.
const CONFIG = {
  place: "Сюрприз 🌚",
  when: "В четверг, в 13:00",
};
const $ = s => document.querySelector(s);
function go(id) {
  document.querySelectorAll('.screen').forEach(el => {
    el.hidden = el.id !== id;
  });
  window.scrollTo(0, 0);
  const heading = $('#' + id + ' h1, #' + id + ' h2');
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}
$('#place').textContent = CONFIG.place;
$('#when').textContent = CONFIG.when;
$('#open').addEventListener('click', () => {
  const envelope = $('#open');
  if (envelope.disabled) return;
  envelope.disabled = true;
  envelope.classList.add('is-opening');
  const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1550;
  setTimeout(() => go('plans'), delay);
});
const revealed = new Set();
document.querySelectorAll('.clue').forEach((button, i) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.querySelector('.plus').textContent = expanded ? '+' : '−';
    revealed.add(i);
    $('#progress').textContent = revealed.size === 3 ? 'Ну что, идём?' : `Раскрыто ${revealed.size} из 3 подсказок`;
  });
});
$('#invitation').addEventListener('click', () => go('invite'));
$('#yes').addEventListener('click', () => {
  go('done');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 22; i++) {
    const heart = document.createElement('span');
    heart.className = 'confetti'; heart.textContent = '♡';
    heart.style.left = Math.random() * 95 + '%';
    heart.style.animationDelay = Math.random() * .8 + 's';
    heart.setAttribute('aria-hidden', 'true');
    document.body.append(heart);
    setTimeout(() => heart.remove(), 3500);
  }
});
$('#back').addEventListener('click', () => go('invite'));
async function send(text, status) {
  if (navigator.share) {
    try { await navigator.share({text}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Сообщение скопировано. Отправь его мне ♡';
  } catch {
    status.textContent = text;
    status.style.userSelect = 'text';
  }
}
$('#send').addEventListener('click', () => send('Да, давай ♡ В четверг в 13:00. До встречи!', $('#send-status')));
$('#reschedule').addEventListener('click', () => send('Хочу с тобой на свидание ♡ Но в четверг не получится. Давай договоримся на другой день?', $('#response')));
