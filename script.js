const state = { noClicks: 0, opened: false };
const questionScreen = document.querySelector('#questionScreen');
const giftScreen = document.querySelector('#giftScreen');
const surpriseScreen = document.querySelector('#surpriseScreen');
const catWrap = document.querySelector('#catWrap');
const yesButton = document.querySelector('#yesButton');
const noButton = document.querySelector('#noButton');
const reaction = document.querySelector('#reaction');
const giftBoxButton = document.querySelector('#giftBoxButton');
const restartButton = document.querySelector('#restartButton');
const giftVideo = document.querySelector('#giftVideo');
const choiceArea = document.querySelector('#choiceArea');

const reactions = [
  ['', '', ''],
  ['你确定吗？', '', 'worried'],
  ['再考虑一下嘛……', '', 'sad'],
  ['不要拒绝我好不好？', '', 'pleading'],
  ['最后再问一次！', '', 'pleading'],
];

function setScreen(next) {
  [questionScreen, giftScreen, surpriseScreen].forEach((screen) => {
    const active = screen === next;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
  });
}

function makePetals() {
  const holder = document.querySelector('#petals');
  for (let i = 0; i < 13; i += 1) {
    const petal = document.createElement('span');
    petal.textContent = i % 3 === 0 ? '♡' : '·';
    petal.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;color:rgba(207,105,134,${.15+Math.random()*.2});font-size:${10+Math.random()*12}px;animation:twinkle ${2+Math.random()*3}s ease-in-out ${Math.random()*2}s infinite alternate;`;
    holder.appendChild(petal);
  }
}

function handleNo() {
  state.noClicks += 1;
  const index = Math.min(state.noClicks, reactions.length - 1);
  const [message, sub, mood] = reactions[index];
  reaction.textContent = message;
  catWrap.classList.remove('worried', 'sad', 'pleading', 'happy', 'surprised');
  if (mood) catWrap.classList.add(mood);
  yesButton.style.transform = 'none';
  const gap = parseFloat(getComputedStyle(choiceArea).columnGap) || 30;
  const maxWidth = Math.max(132, choiceArea.clientWidth - 132 - gap);
  const nextWidth = Math.min(132 * (1 + state.noClicks * .3), maxWidth);
  const buttonScale = nextWidth / 132;
  yesButton.style.width = `${nextWidth}px`;
  yesButton.style.height = `${56 * buttonScale}px`;
  yesButton.style.fontSize = `${18 * buttonScale}px`;
  yesButton.style.zIndex = String(2 + state.noClicks);
  noButton.textContent = ['不可以', '你确定吗？', '再想想嘛', '不要拒绝我', '最后一次'][Math.min(state.noClicks, 4)];
  noButton.style.transform = 'none';
  const noScale = Math.max(.28, 1 - state.noClicks * .18);
  noButton.style.width = `${132 * noScale}px`;
  noButton.style.height = `${56 * noScale}px`;
  noButton.style.fontSize = `${18 * noScale}px`;
  if (state.noClicks >= 4) {
    yesButton.textContent = '可以嘛';
    noButton.classList.add('vanish');
    noButton.style.display = 'none';
    choiceArea.classList.add('centered');
    const centerWidth = Math.min(240, choiceArea.clientWidth * .72);
    yesButton.style.width = `${centerWidth}px`;
    yesButton.style.height = `${centerWidth * 56 / 132}px`;
    yesButton.style.fontSize = `${18 * centerWidth / 132}px`;
  }
}

function accept() {
  catWrap.classList.remove('worried', 'sad', 'pleading');
  catWrap.classList.add('happy');
  setTimeout(() => setScreen(giftScreen), 380);
}

function confetti() {
  const holder = document.querySelector('#confetti');
  holder.innerHTML = '';
  const colors = ['#df7190', '#f5b3c5', '#eecb8c', '#9cc4d3', '#ffffff'];
  for (let i = 0; i < 42; i += 1) {
    const piece = document.createElement('i');
    piece.style.setProperty('--c', colors[i % colors.length]);
    piece.style.setProperty('--d', `${1.7 + Math.random() * 1.8}s`);
    piece.style.setProperty('--r', `${Math.random() * 100 - 50}deg`);
    piece.style.setProperty('--x', `${Math.random() * 180 - 90}px`);
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * .8}s`;
    holder.appendChild(piece);
  }
}

function openGift() {
  if (state.opened) return;
  state.opened = true;
  giftBoxButton.classList.add('opened');
  setTimeout(() => { confetti(); setScreen(surpriseScreen); }, 950);
}

function reset() {
  state.noClicks = 0; state.opened = false;
  reaction.textContent = reactions[0][0];
  noButton.textContent = '不可以'; noButton.style.transform = ''; noButton.style.width = ''; noButton.style.height = ''; noButton.style.fontSize = ''; noButton.style.visibility = ''; noButton.style.display = ''; noButton.classList.remove('vanish');
  yesButton.textContent = '可以'; yesButton.style.transform = ''; yesButton.style.width = ''; yesButton.style.height = '';
  choiceArea.classList.remove('centered');
  catWrap.className = 'cat-wrap'; giftBoxButton.classList.remove('opened');
  setScreen(questionScreen);
}

noButton.addEventListener('click', handleNo);
yesButton.addEventListener('click', accept);
giftBoxButton.addEventListener('click', openGift);
restartButton.addEventListener('click', reset);
makePetals();
