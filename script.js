

const carte = document.querySelectorAll('.carta');
const modale = document.querySelector('modal');
const giocaDiNuovo = modale.querySelector('.giocaDiNuovo');
// const toggleClassifica = document.querySelector('.classifica button');

let cartaGirata = false;
let bloccaBoard = false;
let timerPartita = null;
let tempo = null;
let primaCarta, secondaCarta;

function giraCarta() {

  if(!timerPartita) avviaPartita();
  if(bloccaBoard) return;
  if(this === primaCarta) return;

  this.classList.add('flip');

  if(!cartaGirata) {
    cartaGirata = true;
    primaCarta = this;
    return;
  }

  secondaCarta = this;

  controllaCorrispondenza();
}  

function controllaCorrispondenza() {
  let corrisponde = primaCarta.dataset.forma === secondaCarta.dataset.forma;
  corrisponde ? disabilitaCarte() : rigiraCarte();
}

function disabilitaCarte() {
  primaCarta.removeEventListener('click', giraCarta);  
  secondaCarta.removeEventListener('click', giraCarta);  

  resetBoard();
  carteTerminate();
}

function rigiraCarte() {
  bloccaBoard = true;
  setTimeout( () => {
    primaCarta.classList.remove('flip');
    secondaCarta.classList.remove('flip');
    resetBoard();
  }, 1500 )
}

function resetBoard() {
  [cartaGirata, bloccaBoard] = [false, false];
  [primaCarta, secondaCarta] = [null, null];
}

function carteTerminate() {
  const carteGirate = document.querySelectorAll('.flip').length;
  if (carteGirate === 12 ) {
    const body = document.body;
    const party = new JSConfetti({body});
    party.addConfetti();
    modale.removeAttribute('hidden');
    body.classList.add('vittoria');
    clearInterval(timerPartita);
    salvaPartita();
  }
}

function avviaPartita() {
  const secondiHtml = document.querySelector('.timer__secondi');
  const minutiHtml = document.querySelector('.timer__minuti');
  const inizioPartita = Date.now();
  timerPartita = setInterval( () => {
    const ora = Date.now();
    const tempoPassato = ora - inizioPartita;
    tempo = new Date(tempoPassato);
    secondiHtml.innerText = `${tempo.getSeconds() < 10 ? '0'+ tempo.getSeconds() : tempo.getSeconds() } `; 
    minutiHtml.innerText = `${tempo.getMinutes() < 10 ? '0'+ tempo.getMinutes() : tempo.getMinutes() } `; 
  } , 1000);
}

function salvaPartita() {
  const username = prompt('Che nome vuoi inserire in classifica?');
  const classifica = JSON.parse( localStorage.getItem("classifica")) || [];
  classifica.push({username: username, tempo: new Intl.DateTimeFormat('it-IT', {minute:'numeric', second:'numeric'}).format(tempo)});
  localStorage.setItem("classifica", JSON.stringify(classifica));
}

// function mostraClassifica() {
//   const classificaContainer = this.parentElement;
//   if(classificaContainer.classList.contains('aperta')) {
//     classificaContainer.style.rigth = '-360px';
//     classificaContainer.classList.remove('aperta');
//   } else {
//     classificaContainer.style.rigth = 0;
//     classificaContainer.classList.add('aperta');
//   }
// }

(function mischia() {
  carte.forEach(carta => {
    const posizioneCasuale = Math.floor(Math.random() * 12);
    carta.style.order = posizioneCasuale;
  })
}) ()


carte.forEach(carta => carta.addEventListener('click', giraCarta));

giocaDiNuovo.addEventListener('click', () => location.reload())

// toggleClassifica.addEventListener('click', mostraClassifica);