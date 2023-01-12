var choices = ['rock', 'paper', 'scissors'];
var gameScores = JSON.parse(localStorage.getItem('game-scores')) || {
  personScore: 0,
  computerScore: 0,
};
var gameHistory = JSON.parse(localStorage.getItem('game-history')) || [];

var body = document.querySelector('body');
var verdictContainer = document.querySelector('.verdict');
var personChoice = document.querySelector('#person');
var computerChoice = document.querySelector('#computer');
var possiblePersonChoices = [
  ...document.querySelectorAll('.possibe-choice__person'),
];
var possibleComputerChoices = [
  ...document.querySelectorAll('.possibe-choice__computer'),
];
var optionsContainer = document.querySelector('.options');
var options = [...document.querySelectorAll('.option')];
var personScore = document.querySelector('#person-score');
var computerScore = document.querySelector('#computer-score');
var previousScores = document.querySelector('.previous-scores');
var resetHistory = document.querySelector('.reset-history');
var noDataParagraph = document.querySelector('.no-data__paragraph');

function updateHistory() {
  var previousChoices =
    [...document.querySelectorAll('.previous-choice')] || [];

  // removing the previous choices
  if (previousChoices.length)
    previousChoices.map((previousChoice) => previousChoice.remove());

  // adding the new choices to UI
  gameHistory.map(({ personChoice, computerChoice, verdict }) => {
    var trow = document.createElement('tr');
    trow.className = `previous-choice ${verdict.color}`;

    trow.innerHTML = `
      <td>
        <img src="./assets/${choices[personChoice]}.png" alt="${choices[personChoice]}" srcset="" />
      </td>
      <td>
        <img src="./assets/${choices[computerChoice]}.png" "${choices[computerChoice]}" srcset="" />
      </td>
      <td>
        <div class="color"></div>
      </td>
    `;

    previousScores.appendChild(trow);
  });

  // toggling between the table and no-data__paragraph
  if (!gameHistory.length) {
    previousScores.dataset.visible = 'false';
    noDataParagraph.dataset.visible = 'true';
  } else {
    previousScores.dataset.visible = 'true';
    noDataParagraph.dataset.visible = 'false';
  }
}

function updateScores() {
  personScore.innerText = gameScores.personScore;
  computerScore.innerText = gameScores.computerScore;
}

function imageHandler(index, choices) {
  choices.map((choice) => {
    choice.map((img, idx) => {
      img.dataset.visible = 'false';
      if (idx === index) img.dataset.visible = 'true';
    });
  });
}

function cleanUp() {
  imageHandler(3, [possiblePersonChoices, possibleComputerChoices]);
  optionsContainer.style.display = 'none';
}

function getChoices(event) {
  // person's choice in number form
  var psnChoice = parseInt(event.target.dataset.value);

  // computer's choice in number form
  var randomChoice = Math.floor(Math.random() * 3);
  var compChoice = randomChoice < 3 ? randomChoice : 2;
  return { psnChoice, compChoice };
}

function verdictHandler(personChoice, computerChoice) {
  // personChoice - computerChoice == 1 || -2
  var won =
    personChoice - computerChoice === 1 || personChoice - computerChoice === -2
      ? true
      : personChoice - computerChoice === 0
      ? null
      : false;

  return won
    ? {
        color: 'green',
        value: `You have won: ${choices[personChoice]} beats ${choices[computerChoice]}`,
        won,
      }
    : won === null
    ? {
        color: 'orange',
        value: `It's a tie on: ${choices[personChoice]}`,
        won,
      }
    : {
        color: 'brown',
        value: `You have lost: ${choices[computerChoice]} beats ${choices[personChoice]}`,
        won,
      };
}

async function animateImages() {
  let index = 0;
  await new Promise((resolve) => {
    let interval = setInterval(() => {
      if (index < 3) {
        imageHandler(index, [possiblePersonChoices, possibleComputerChoices]);
      }
      if (index === 3) {
        clearInterval(interval);
        resolve();
      }
      index += 1;
    }, 500);
  });
}

function updateResults(personChoice, computerChoice, verdict) {
  // changing the verdict on the top
  verdictContainer.innerHTML = `<p style="color: ${verdict.color}">${verdict.value}</p>`;

  // getting the final images presented
  imageHandler(personChoice, [possiblePersonChoices]);
  imageHandler(computerChoice, [possibleComputerChoices]);

  // changing the backgrund of the page to reflect the verdict
  body.style.background = verdict.color;
  optionsContainer.style.display = 'flex';

  // updating the scores
  gameScores = verdict.won
    ? { ...gameScores, personScore: gameScores.personScore + 1 }
    : verdict.won === null
    ? {
        personScore: gameScores.personScore + 1,
        computerScore: gameScores.computerScore + 1,
      }
    : { ...gameScores, computerScore: gameScores.computerScore + 1 };
  localStorage.setItem('game-scores', JSON.stringify(gameScores));
  updateScores();

  // updating the  history
  gameHistory.unshift({ personChoice, computerChoice, verdict });
  localStorage.setItem('game-history', JSON.stringify(gameHistory));
  updateHistory();
}

// listening for the click of the choice
options.map((option) => {
  option.addEventListener('click', async (evt) => {
    // cleaning up;
    cleanUp();

    // getting the choices of the person and the computer
    var { psnChoice, compChoice } = getChoices(evt);

    // getting the verdict = {color, value}
    var verdict = verdictHandler(psnChoice, compChoice);

    // awaiting on the animation
    await animateImages();

    // presenting the final results
    updateResults(psnChoice, compChoice, verdict);
  });
});

// listening for the click to reset the history
resetHistory.addEventListener('click', () => {
  localStorage.removeItem('game-history');
  localStorage.removeItem('game-scores');
  gameHistory = [];
  gameScores = {
    personScore: 0,
    computerScore: 0,
  };
  updateHistory();
  updateScores();
});

updateScores();
updateHistory();
