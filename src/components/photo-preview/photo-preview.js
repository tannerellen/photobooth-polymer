(function() {
	'use strict'

	var controller;

	Polymer({
		is: 'photo-preview',
		properties: {
			source: {
				type: String,
				//value: '',
				notify: true,
				observer: 'sourceChanged',
			},
		},
		created: function() {
			//Initialize controller
			controller = photoPreviewController(this);
		},
		sourceChanged: function(newValue, oldValue) {
			if (newValue) {
				controller.displayPhotoPreview(newValue);
			}
		},
	});
  	
  	//Define the controller
	function photoPreviewController(polymerNode) {
		return {
			displayPhotoPreview: displayPhotoPreview,
		};
		//Display the new photo to preview the results
		function displayPhotoPreview(src) {
			//Create image preview and append to container
			//Get references to our new elements
			var containerElement = polymerNode.querySelector('.photo-container');
			var photoElement = polymerNode.querySelector('.photo');
			var progressElement = polymerNode.querySelector('.progress-bar-inner');
			//Register animation event listner so we can hide our image when the animation is done
			progressElement.addEventListener(photobooth.animationEvent, photoPreviewComplete);
			containerElement.classList.remove('fade-out');
			containerElement.classList.add('fade-in');
			progressElement.classList.add('progress-start');

			function photoPreviewComplete(animationEnd) {
				var progressElement = animationEnd.target;
				progressElement.removeEventListener(photobooth.animationEvent, photoPreviewComplete);
				containerElement.classList.remove('fade-in');
				progressElement.classList.remove('progress-start');
				containerElement.classList.add('fade-out');

				polymerNode.source = '';

			}

		}
	}

}());