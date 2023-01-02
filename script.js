// what happens
const choices = [
  { imageUrl: './assets/rock-person.png', name: 'rock' },
  { imageUrl: './assets/paper-person.png', name: 'paper' },
  { imageUrl: './assets/scissors-person.png', name: 'scissors' },
];

var optionsContainer = document.querySelector('.options');
var options = document.querySelectorAll('.option');
var verdictContainer = document.querySelector('.verdict');
var main = document.querySelector('main');
var possibleAnswersPerson = document.querySelectorAll(
  '.possible-answers__person img'
);
var possibleAnswersComputer = document.querySelectorAll(
  '.possible-answers__computer img'
);

function getDecision(decisionMaker, computerChoice, personChoice) {
  var verdict = {};

  //   making the decision
  if (decisionMaker) {
    verdict = {
      color: 'green',
      answer: `You have won: ${personChoice} beats ${computerChoice}`,
    };
  } else if (decisionMaker === null) {
    verdict = {
      color: 'orange',
      answer: `It's a draw on: ${personChoice}`,
    };
  } else {
    verdict = {
      color: 'brown',
      answer: `You have lost: ${computerChoice} beats ${personChoice}`,
    };
  }

  return verdict;
}

function getVerdict(computerIndex, personIndex) {
  // our logic
  var difference = computerIndex - personIndex;

  // getting the choices
  var computerChoice = choices[computerIndex].name;
  var personChoice = choices[personIndex].name;

  //   main logic
  var decisionMaker =
    difference === 0
      ? null
      : difference === -1 || difference === 2
      ? true
      : false;

  return getDecision(decisionMaker, computerChoice, personChoice);
}

function changeImages(index, arrOfPlayers) {
  arrOfPlayers.forEach((player) => {
    player.forEach((possibleAnswer, possibleAnswerIndex) => {
      possibleAnswer.dataset.possible = false;
      if (possibleAnswerIndex === index) possibleAnswer.dataset.possible = true;
    });
  });
}

async function animateChoosing() {
  var index = 0;
  return await new Promise((resolve) => {
    let interval = setInterval(() => {
      if (index < 3) {
        // changing background images
        changeImages(index, [possibleAnswersPerson, possibleAnswersComputer]);
      }
      index += 1;
      if (index === 4) resolve(clearInterval(interval));
    }, 500);
  });
  //   changing the background
}

options.forEach((inputChoice) => {
  inputChoice.addEventListener('click', async (ev) => {
    changeImages(3, [possibleAnswersPerson, possibleAnswersComputer]);

    // remove the possibility to see the choices
    optionsContainer.style.display = 'none';

    // generating the choice for the computer and getting your choice.
    var randomNumber = Math.floor(Math.random() * 3);
    var computerChoice = randomNumber === 3 ? 2 : randomNumber;
    var personChoice = parseInt(ev.target.dataset.value);

    // choising the verdict
    var verdict = getVerdict(computerChoice, personChoice);

    // animation of computer and person choosing
    const promise = await animateChoosing();

    // showing what you both chose
    changeImages(personChoice, [possibleAnswersPerson]);
    changeImages(computerChoice, [possibleAnswersComputer]);

    // showing the answer
    verdictContainer.innerHTML = `<p style="color: ${verdict.color}; margin: 0 auto;">${verdict.answer}</p>`;

    // adding the possibility to see the choices
    optionsContainer.style.display = 'flex';
    main.style.background = verdict.color;
    return;
  });
});
