(function() {
  'use strict';
  
  var controller;

  Polymer({
    is: 'app-container',
    properties: {
      zoom: {
        type: Number,
        value: Number(photobooth.urlQueryParams.zoom) || 0,
        notify: false,
      },
      videoMode: {
        type: String,
        value: 'preview',
        notify: false,
      },
      startCountdown: {
        type: Boolean,
        value: false,
        notify: false,
        observer: 'countdownChanged',
      },
      hideLoading: {
        type: Boolean,
        value: true,
        notify: false,
      },
      photoPreview: {
        type: String,
        // value: '',
        notify: false,
        observer: 'photoPreviewChanged',
      },
    },
    created: function() {
      //Initialize controller
      controller = appController(this);
    },
    ready: function() {
      controller.initializeApp();
    },
    countdownChanged: function(newValue, oldValue) {
      if(newValue !== oldValue && oldValue !== undefined) {
        controller.countdownComplete(newValue);
      }
    },
    photoPreviewChanged: function(newValue, oldValue) {
      controller.previewComplete(newValue);
    },
  });
  
  //Define the controller
  function appController(polymerNode) {
    var isRunning;
    var readyForPreview;
    var sounds

    var coverElement;
    var footerElement;


    return {
      initializeApp: initializeApp,
      countdownComplete: countdownComplete,
      previewComplete: previewComplete,
    };

    function initializeApp() {
      coverElement = document.querySelector('#cover');
      footerElement = document.querySelector('.footer');
      window.setTimeout(function() {
        window.addEventListener("hashchange", getImage, false);
        window.addEventListener('keypress', snapshot, false);
        //Listen for countdown completion
        // document.querySelector('countdown-timer').addEventListener('countdownComplete', cameraFlash, false);
        fadeOut(coverElement);
        coverElement.innerHTML = "";
      }, 2750);
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

      var sounds = {
        cameraShutter: new photobooth.CreateSound('one', 'sounds/camera-shutter-click.mp3', context),
      };

      return sounds;
    }

    function snapshot() {
      if (isRunning) {
        return;
      }
      else {
        isRunning = true;
      }
      //changed our video preview to capture mode (large)
      polymerNode.videoMode = 'capture';
      //Begin countdown process
      countdown();
    }

    function countdown() {
      //Timing adjustments passed through url
      var cameraTiming = Number(photobooth.urlQueryParams.timing) || 0;
      //Add listener so we can run a function when the animation is complete
      coverElement.addEventListener(photobooth.animationEvent, afterPhotoTaken);

      //Activate countdown component
      polymerNode.startCountdown = true;

      //It takes about a second for the camera to take a picture so delay the picture taking process a bit
      window.setTimeout(function() {
        //Send command to take a picture with the camera
        window.location.href = 'takepic://localhost/';
      }, 3750 + cameraTiming);
    }

    function countdownComplete(value) {
      if (value === false) {
        cameraFlash();
      }
    }

    //Show camera flash after countdown is complete
    function cameraFlash() {
      //Show cover element and add animation class
      coverElement.classList.remove('hide');
      coverElement.classList.add("flash");
      //Play shutter sound
      sounds.cameraShutter.play(0);
      //Cover element animation event listener should fire now running afterPhotoTaken function
    }

    //Picture flash is complete so clean up flash elements left behind
    function afterPhotoTaken() {
      coverElement.removeEventListener(photobooth.animationEvent, afterPhotoTaken);
      coverElement.classList.remove("flash");
      coverElement.classList.add("blank");
      //Show image loading
      polymerNode.hideLoading = false;
      readyForPreview = true;
    }

    //We got notified of the image being ready so let's get the URL for the new photo
    function getImage(e) {
      //If we haven't completed our flash and loading process don't get the image yet
      if (!readyForPreview) {
        window.setTimeout(function() {
          getImage(e);
        }, 1000);
        return;
      }
      var url = e.newURL;
      var urlItems = url.split('#');
      var filePath = urlItems.pop();
      var image = filePath;
      //If no image exists its probably because we cleared the hash so only proceed if we have an image path
      if (image) {
        //Reset url hash
        history.replaceState("", document.title, window.location.pathname + window.location.search);
        //Display the photo
        polymerNode.photoPreview = image;
        //Hide loading
        polymerNode.hideLoading = true;
        readyForPreview = null;
      }
    }

    function previewComplete(value) {
      if (!value) {
        resetPhotoBooth();
      }
    }

    function resetPhotoBooth() {
      coverElement.classList.remove('fade-out');
      coverElement.classList.add('hide');
      //Change video size back to preview
      polymerNode.videoMode = 'preview';
      //Reset is running so event listener can fire again
      isRunning = false;
    }

    //Utilities===========================================>

    function fadeOut(element, callback) {
      element.addEventListener(photobooth.transitionEvent, afterFade);
      element.classList.add('fade-out');
      element.classList.remove('fade-in');
      function afterFade() {
        element.removeEventListener(photobooth.transitionEvent, afterFade);
        element.classList.add('hide');
        element.classList.remove('fade-out');
        if (callback) {
          callback(element);
        }
      }
    }

  }


})();