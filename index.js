
document.addEventListener("DOMContentLoaded", function() {
  var playerName, cardAmount, cards, gameStarted, timerInterval;
  var firstCard, secondCard;
  var reshuffleInterval;
  var reshuffleIntervalId; 

  document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    playerName = document.getElementById('player-name').value;
    cardAmount = parseInt(document.getElementById('card-amount').value);

    if (!isNaN(cardAmount) && cardAmount >= 2 && cardAmount <= 30) {
      startGame();
    } else {
      alert('Please enter a valid number of cards (2-30).');
    }
  });

  var instructionsBtn = document.getElementById('instructions-btn');
  var instructionsModal = document.getElementById('instructions-modal');
  var closeBtn = document.getElementById('close-btn');
  

  instructionsBtn.addEventListener('click', function() {
    instructionsModal.style.display = 'block';
    instructionsBtn.style.display = 'none';
  });

  closeBtn.addEventListener('click', function() {
    instructionsModal.style.display = 'none';
    instructionsBtn.style.display = 'block';
  });

  window.addEventListener('click', function(event) {
    if (event.target === instructionsModal) {
      instructionsModal.style.display = 'none';
      instructionsBtn.style.display = 'block';
    }
  });

  function startGame() {
    document.getElementById('settings-form').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('instructions-btn').style.display = 'none';

    cards = [];
    for (var i = 1; i <= cardAmount; i++) {
      var card1 = createCard(i);
      var card2 = createCard(i);
      cards.push(card1, card2);
    }

    shuffle(cards);

    var gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    cards.forEach(function(card) {
      gameBoard.appendChild(card);
    });

    gameStarted = true;

    var previousWelcomeMessage = document.getElementById('welcome-message');
    if (previousWelcomeMessage) {
      previousWelcomeMessage.remove();
    }

    var welcomeMessage = document.createElement('div');
    welcomeMessage.id = 'welcome-message';
    welcomeMessage.textContent = 'Hello, ' + playerName;
    document.body.insertBefore(welcomeMessage, document.body.firstChild);

    startTimer();

    
    var difficultyLevel = document.getElementById('difficulty-level').value;
    switch (difficultyLevel) {
      case 'easy':
        reshuffleInterval = 2 * 60 * 1000; 
        break;
      case 'medium':
        reshuffleInterval = 10 * 1000;
        break;
      case 'hard':
        reshuffleInterval = 5 * 1000; 
        break;
      default:
        reshuffleInterval = 2 * 60 * 1000; 
        break;
    }

 
    clearInterval(reshuffleIntervalId);

    reshuffleIntervalId = setInterval(reshuffleCards, reshuffleInterval);
  }

  function reshuffleCards() {
    var unselectedCards = document.querySelectorAll('.card:not(.selected)');
    unselectedCards.forEach(function(card) {
      card.style.order = Math.floor(Math.random() * 100);
    });
  }

  function createCard(value) {
    var card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = value;
    card.textContent = '?';
    card.addEventListener('click', selectCard);
    return card;
  }

  function selectCard() {
    if (!gameStarted || this.classList.contains('selected')) return;

    this.classList.add('selected');
    this.textContent = this.dataset.value;

    if (!firstCard) {
      firstCard = this;
    } else {
      secondCard = this;
      checkCardMatch();
    }
  }

  function checkCardMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      firstCard.classList.remove('selected');
      secondCard.classList.remove('selected');
      firstCard = null;
      secondCard = null;
      checkGameCompletion();
    } else {
      gameStarted = false;
      setTimeout(function() {
        firstCard.textContent = '?';
        secondCard.textContent = '?';
        firstCard.classList.remove('selected');
        secondCard.classList.remove('selected');
        firstCard = null;
        secondCard = null;
        gameStarted = true;
      }, 1000);
    }
  }

  function checkGameCompletion() {
    if (document.getElementsByClassName('matched').length === cardAmount * 2) {
      clearInterval(timerInterval);
      document.getElementById('restart-btn').style.display = 'block';
      document.getElementById('restart-btn').classList.add('blink-animation');
      gameStarted = false;
      var elapsedTime = document.getElementById('timer').textContent;
      var timeParts = elapsedTime.split(' ');
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      for (var i = 0; i < timeParts.length; i++) {
        var part = timeParts[i];
        if (part.includes('h')) {
          hours = parseInt(part);
        } else if (part.includes('m')) {
          minutes = parseInt(part);
        } else if (part.includes('s')) {
          seconds = parseInt(part);
        }
      }
      var timeString = formatTime(hours, minutes, seconds);
      alert('Congratulations, ' + playerName + '! You have completed the game in ' + timeString + '.');
    }
  }

  function startTimer() {
    var startTime = Date.now();
    timerInterval = setInterval(function() {
      var elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      var hours = Math.floor(elapsedTime / 3600);
      var minutes = Math.floor((elapsedTime % 3600) / 60);
      var seconds = elapsedTime % 60;
      document.getElementById('timer').textContent = formatTime(hours, minutes, seconds);
    }, 1000);
  }

  function formatTime(hours, minutes, seconds) {
    var timeString = '';
    if (hours > 0) {
      timeString += hours + 'h ';
    }
    if (minutes > 0) {
      timeString += minutes + 'm ';
    }
    timeString += seconds + 's';
    return timeString;
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    for (var i = 0; i < array.length; i++) {
      var card = array[i];
      card.style.order = i;
    }
  }

  document.getElementById('restart-btn').addEventListener('click', function() {
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('settings-form').style.display = 'block';
    this.style.display = 'none';
  });
});
