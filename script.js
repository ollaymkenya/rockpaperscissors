var choices = ['rock', 'paper', 'scissors'];

var main = document.querySelector('main');
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

function verdictHandler(personChoice, computerChoice) {
  // personChoice - computerChoice == 1 || -2
  var won =
    personChoice - computerChoice === 1 || personChoice - computerChoice === -2
      ? true
      : personChoice - computerChoice === 0
      ? null
      : false;

  var verdict;
  if (won) {
    verdict = {
      color: 'green',
      value: `You have won: ${choices[personChoice]} beats ${choices[computerChoice]}`,
    };
  } else if (won === null) {
    verdict = {
      color: 'orange',
      value: `It's a tie on: ${choices[personChoice]}`,
    };
  } else {
    verdict = {
      color: 'brown',
      value: `You have lost: ${choices[computerChoice]} beats ${choices[personChoice]}`,
    };
  }

  return verdict;
}

function imageHandler(index, choices) {
  choices.map((choice) => {
    choice.map((img, idx) => {
      img.dataset.visible = 'false';
      if (idx === index) img.dataset.visible = 'true';
    });
  });
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

options.map((option) => {
  option.addEventListener('click', async (evt) => {
    // removing the previously chosen option
    imageHandler(3, [possiblePersonChoices, possibleComputerChoices]);

    optionsContainer.style.display = 'none';

    // person's choice in number form
    var psnChoice = parseInt(evt.target.dataset.value);

    // pecomputer's choice in number form
    var randomChoice = Math.floor(Math.random() * 3);
    var compChoice = randomChoice < 3 ? randomChoice : 2;

    // verdict = {color, value}
    var verdict = verdictHandler(psnChoice, compChoice);

    // animation
    await animateImages();

    // changin the verdict on the top
    verdictContainer.innerHTML = `<p style="color: ${verdict.color}">${verdict.value}</p>`;

    // gettign the final images presented
    imageHandler(psnChoice, [possiblePersonChoices]);
    imageHandler(compChoice, [possibleComputerChoices]);

    main.style.background = verdict.color;
    optionsContainer.style.display = 'flex';
  });
});
