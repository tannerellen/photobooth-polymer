(function() {
	'use strict';

	var controller;

	Polymer({
	is: 'progress-loading',

		properties: {
			message: {
				type: String,
				value: 'Please wait...',
				notify: false
			},
			hidden: {
				type: Boolean,
				value: false,
				notify: false,
				observer: 'hiddenChanged',
			},
		},
		created: function() {
			//Initialize controller
			controller = progressController(this);
		},
		hiddenChanged: function(newValue, oldValue) {
			controller.startProgress(newValue, oldValue);
		},

	});
  	
  	//Define the controller
	function progressController(polymerNode) {

		return {
			startProgress: startProgress,
		};
		
		function startProgress(newValue, oldValue) {
			if (newValue === true) {
				if (polymerNode) {
					polymerNode.addEventListener(photobooth.animationEvent, afterFade);
				}
				polymerNode.classList.remove('fade-in');
				polymerNode.classList.add('fade-out');
			}
			else if (newValue === false) {
				polymerNode.classList.remove('fade-out');
				polymerNode.classList.remove('hide');
				polymerNode.classList.add('fade-in');
			}
			function afterFade() {
				polymerNode.removeEventListener(photobooth.animationEvent, afterFade);
				polymerNode.classList.add('hide');
			}
		}
	}

})();