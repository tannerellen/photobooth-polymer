(function() {
	'use strict'
	
	var controller;

	Polymer({
		is: 'countdown-timer',
		properties: {
			start: {
				type: Boolean,
				value: false,
				notify: true,// Notify so we can reset the timer here and it will bubble up to any parent components
				observer: 'countdownChanged',

			},
		},
		created: function() {
      		//Initialize controller
      		controller = countdownController(this);
		},
		ready: function() {
			controller.initializeApp();
		},
		countdownChanged: function(newValue, oldValue) {
			if (newValue === true) {
				controller.countdown();
			}
		}

	});
  	
  	//Define the controller
	function countdownController(polymerNode) {
		var polymerNode;
		var containerElement;
		var sounds;

		return {
			initializeApp: initializeApp,
			countdown: countdown,
		};

		function initializeApp() {
			containerElement = polymerNode.querySelector('.counter-container');
			sounds = initializeSounds();
		}

		function initializeSounds() {
			try {
			  // Fix up for prefixing
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				var context = new AudioContext();
			}
			catch(e) {
			 	alert('Web Audio API is not supported in this browser');
			return;
			}

			sounds = {
				oneKeaton: new photobooth.CreateSound('one', 'sounds/one.mp3', context),
				twoKeaton: new photobooth.CreateSound('one', 'sounds/two.mp3', context),
				threeKeaton: new photobooth.CreateSound('one', 'sounds/three.mp3', context),
				fourKeaton: new photobooth.CreateSound('one', 'sounds/four.mp3', context),
				fiveKeaton: new photobooth.CreateSound('one', 'sounds/five.mp3', context),
				oneParker: new photobooth.CreateSound('one', 'sounds/one-parker.mp3', context),
				twoParker: new photobooth.CreateSound('one', 'sounds/two-parker.mp3', context),
				threeParker: new photobooth.CreateSound('one', 'sounds/three-parker.mp3', context),
				fourParker: new photobooth.CreateSound('one', 'sounds/four-parker.mp3', context),
				fiveParker: new photobooth.CreateSound('one', 'sounds/five-parker.mp3', context),
				cameraShutter: new photobooth.CreateSound('one', 'sounds/camera-shutter-click.mp3', context),
			};

			return sounds;
		}

		function countdown() {
			//Countdown numbers wrapped in setTimeout so we get a nice even countdown
			window.setTimeout(function() {
				countdownNumber(5);
				sounds.fiveKeaton.play(0);
			}, 0);
			window.setTimeout(function() {
				countdownNumber(4);
				sounds.fourParker.play(0);
			}, 1000);
			window.setTimeout(function() {
				countdownNumber(3);
				sounds.threeKeaton.play(0);
			}, 2000);
			window.setTimeout(function() {
				countdownNumber(2);
				sounds.twoParker.play(0);
			}, 3000);
			window.setTimeout(function() {
				countdownNumber(1);
				sounds.oneKeaton.play(0);
				sounds.oneParker.play(0);
			}, 4000);
			//End of countdown

			//Broadcast completion event
			window.setTimeout(function() {
				//timer complete event so we can notify other components that the timer is done
				//polymerNode.fire('countdownComplete', {complete: true}); //We could fire a custom event here but we don't need to
				//Remove countdown content becuase we are finished with it now
				polymerNode.start = false;
				containerElement.innerHTML = "";
			}, 5000);
		}
		function countdownNumber(number) {
			var options = {
				size: 150,
				animate: 1000,
				lineCap: 'square',
				scaleColor: false,
				lineWidth: 6,

			};
			containerElement.innerHTML = "";

			//Create the elements
			var countDownDiv = document.createElement("div");
			countDownDiv.className = "chart counter";
			countDownDiv.innerHTML = "<span class=\"percent\">" + number + "</span>";
			containerElement.appendChild(countDownDiv);

			// instantiate the plugin
			var chart = new EasyPieChart(countDownDiv, options);
			// update to 100% so the progress goes all the way around
			chart.update(100);
		}
	}
}());