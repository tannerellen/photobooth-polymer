(function() {
    'use strict';

    var controller;

	Polymer({
		is: 'video-display',
        properties: {
          zoom: {
            type: Number,
            value: 0,
            notify: true,
            observer: 'zoomChanged',
          },
          mode: {
            type: String,
            value: 'preview', //preview, capture
            notify: true,
            observer: 'modeChanged',
          },
        },
        created: function() {
        	//Initialize controller
        	controller = videoDisplayController(this);
        },
        attached: function() {
			controller.initializeApp();
		},
        zoomChanged: function(newValue, oldValue) {
        	controller.changeZoom(newValue, oldValue);
        },
        modeChanged: function(newValue, oldValue) {
        	controller.changeMode(newValue, oldValue);
        },
	});

  	//Define the controller
	function videoDisplayController(polymerNode) {

		return {
			initializeApp: initializeApp,
			changeZoom: changeZoom,
			changeMode: changeMode,
		};

		function initializeApp() {
			navigator.getUserMedia = navigator.getUserMedia ||
	    	navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			
			var videoElement = polymerNode.querySelector('video');
			initializeVideo(videoElement, 1280, 1080);
		}

		function changeMode(newValue, oldValue) {
    	    polymerNode.classList.remove('video-' + oldValue);
    		polymerNode.classList.add('video-' + newValue);
		}

		function changeZoom(newValue, oldValue) {
	    	polymerNode.classList.remove('zoom' + oldValue);
	    	polymerNode.classList.add('zoom' + newValue);
		}

		function initializeVideo(element, idealWidth, idealHeight) {

			if (window.stream) {
				element.src = null;
				window.stream.stop();
			}
			var constraints = {
				audio: false,
				video: {
					width: { min: 640, ideal: idealWidth, max: 1920 },
					height: { min: 480, ideal: idealHeight, max: 1080 },
				}
			};

			navigator.getUserMedia(constraints, successCallback, errorCallback);

			function successCallback(stream) {
				window.stream = stream; // make stream available to console
				element.src = window.URL.createObjectURL(stream);
				element.play();
			}

			function errorCallback(error) {
				console.log('navigator.getUserMedia error: ', error);
			}
		}
	}

    })();