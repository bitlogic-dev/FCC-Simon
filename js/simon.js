var game = false;
var moves = [];
var counter = 0;
var playerTurn = false;
var strict = false;
var displayCount = 0;

// array of panel elements
var buttons = document.getElementsByClassName('panel');
var controls = document.getElementsByClassName('control-btn');

var sounds = [0, 1, 2, 3, 4];
var freqs = [391.995, 329.628, 261.626, 195.998, 42]
// create Context
var audioCtx = new AudioContext();

function resetGame() {
  moves = [];
  counter = 0;
  displayCount = 0;
  start();
}

function buildSounds(arr1, arr2) {

  for(var i = 0; i < arr1.length; i++) {
    arr1[i] = audioCtx.createOscillator();
		arr1[i].connect(audioCtx.destination);
		arr1[i].type = 'sawtooth';
    arr1[i].frequency.value = arr2[i];
  }
}

function addMove() {
	var val = Math.floor(Math.random() * 4);
	moves.push(val);
	displayCount++;
}

function start() {
	if (game) {
		if (moves.length === 0) {
			advanceTurn();
		} else {
			simonSays();
		}
	}
}

function toggleStrict() {
	strict = !strict;
  controls[2].classList.toggle('strict-active');
}

function advanceTurn() {
	//add move to array
	addMove();
	//update number of moves in display
	updateDisplay();
	//play moves sequence
	simonSays();
	//switch to player turn
}



function switchPlayer() {
	playerTurn = !playerTurn;
}

function updateDisplay() {
	var display = document.getElementById('display');
	display.innerHTML = '';
	if (game) {
		if (displayCount === 0) {
			display.innerHTML = '--';
		} else {
			//add leading zero if only one digit
			if (displayCount < 10) {
				display.innerHTML = '0' + displayCount;
			} else {
				display.innerHTML = displayCount;
			}
		}
	} else {
		display.innerHTML = 'Off';
	}
}

function addListeners() {
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', playerMove, false);
	}
  controls[1].addEventListener('click', togglePower, false);
	controls[0].addEventListener('click', start, false);
	controls[2].addEventListener('click', toggleStrict, false);

}

function panelFlash() {
	$(this).animate({
		opacity: 1.0
	}, 250);
	$(this).animate({
		opacity: 0.75
	}, 250);
}

function rebuildNode(index) {
  var i = index;
  sounds[i] = audioCtx.createOscillator();
  sounds[i].connect(audioCtx.destination);
  sounds[i].type = 'sawtooth';
  sounds[i].frequency.value = freqs[i];
}

function panelSound() {
  var index = this.id;
	var sound = sounds[index];
	sound.start();
	sound.stop(audioCtx.currentTime + 0.5);
  rebuildNode(index);
}

function playRazz() {
  var index = 4;
	var sound = sounds[index];
  sound.start();
  sound.stop(audioCtx.currentTime + 1.5);
  rebuildNode(index);
}

function togglePower() {
  var power = controls[1];
  power.classList.toggle('on');
  game = !game;
	updateDisplay();
	if (power.innerHTML === 'On') {
		power.innerHTML = 'Off';
	} else {
		power.innerHTML = 'On';
	}
}

function firePanel(el) {
  panelFlash.call(el);
	panelSound.call(el);
}

function delayedFire(num) {
  setTimeout(function(){
    firePanel(el);
  }, num * 500);
}

function turnComplete() {
  if (counter == 20) {
    var display = document.getElementById('display');
    display.innerHTML = 'Win';
    setTimeout(resetGame, 1600);
  } else {
    if (counter == displayCount) {
      counter = 0;
      switchPlayer();
      setTimeout(advanceTurn, 1000);
  	} else {
      return;
    }
  }
}

function playerMove() {
	if(playerTurn) {
		var id = this.id;
		var simonId = moves[counter];
		if(id == simonId) {
			firePanel(this);
			counter++;
			turnComplete();
		} else {
			playRazz();
      counter = 0;
      var display = document.getElementById('display');
      display.innerHTML = '!!';
      setTimeout(updateDisplay, 1500);
      if(strict) {
        setTimeout(resetGame, 1600);
      }
		}
	}
}

function simonSays() {
	for (var i = 0; i < moves.length; i++) {
    (function(i) {
        setTimeout(function() { firePanel(buttons[moves[i]]); }, i * 1000);
    })(i);
	}
  playerTurn = true;
}

$(document).ready(function(){
  buildSounds(sounds, freqs);
  addListeners();
});
