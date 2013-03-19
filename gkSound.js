/**
 *	@author decocaribe [at] gmail [dot] com
 */
 var gkSound = (function() {
    
    var soundList = [];
    var currentTrack = null;
    var conteiner;
    var muteButton;
    var isActive;
    var textOn  = 'On';
    var textOff = 'Off';

    var createConteiner = function() {
        document.body.innerHTML += '<div id="sounds" style="display:none"></div>';
    }

    var createMuteButton = function() {
    	document.body.innerHTML = '<div id="btnMute" style="cursor:pointer; width:30px; padding:15px 5px 0 5px; font-size:16px; text-align:center; height:25px; background: #000; opacity:0.8; color:#fff; position:absolute; z-index:1000"></div>' + document.body.innerHTML;
        muteButton = 'btnMute';
    }

    var checkLocalStorage = function() {
    	if(localStorage.musicStatus != "" || localStorage.musicStatus != null){
			if(localStorage.musicStatus == "mute"){
				gkSound.stopAllSounds();
                document.getElementById(muteButton).innerHTML = textOff;
                isActive = false;
			} else {
				localStorage.musicStatus = "on";
                document.getElementById(muteButton).innerHTML = textOn;
                isActive = true;
			}	
		}
    }

    var hasSound = function(id){
        var soundExists = false;

        for (var i = soundList.length - 1; i >= 0; i--) {
            if( soundList[i].id == id) {
                soundExists = true;
            }
        };

        return soundExists;
    }

    return {

    	init: function(muteButtonId) {
    		createConteiner();
            
    		if( muteButtonId == undefined) {
    			createMuteButton();
    		} else {
    			muteButton = muteButtonId;	
    		}

            document.getElementById(muteButton).addEventListener('click', function(){
                gkSound.toggleSounds();
            });

    		checkLocalStorage();
    	},

    	addSound: function (id, file, isTrack, autoPlay, callback) {
    		
            var addHTML = function(){
                var content = '';
                var query = file.split('.mp3');

                content+= isTrack == true ? '<audio id="'+id+'" loop >' : '<audio id="'+id+'">';
                        content+= '<source src="'+query[0]+'.ogg'+(query[1] ? query[1] : "")+'" type="audio/ogg" />';
                        content+= '<source src="'+query[0]+'.mp3'+(query[1] ? query[1] : "")+'" type="audio/mpeg" />';
                content+= '</audio>';

                document.getElementById("sounds").innerHTML += content;
            }

            var hasAutoPlay = function(){
                if( autoPlay == true ){
                    if( isTrack == false ) {
                        gkSound.playSound(id);
                    } else {
                        gkSound.playTrack();
                    }
                }
            }

            var hasCallback = function(){
                if( callback != undefined ){
                    callback();
                }
            }

            var canPLay = function(){
                var soundElement = document.getElementById(id);
                var listener = soundElement.addEventListener("canplaythrough", function() {
                    
                    soundElement.removeEventListener("canplaythrough", listener);

                    hasAutoPlay();
                    hasCallback();
                    
                });
            }

            if( !hasSound(id) ) {
                
                addHTML();

                soundList.push( { "id":id, "file":file, "isTrack":isTrack} );

                canPLay();
                
            } else {
                hasAutoPlay();
                hasCallback();
            }
    		
    	},

        removeSound: function(id){
            element.parentNode.removeChild(element);
            // TODO: remover do vetor!
        },

    	playSound: function(id, override, onComplete) {
            var element = document.getElementById(id);

            var hasCallback = function(){
                if( onComplete != undefined ){ onComplete(); }
            }

            if( isActive ) {

                // Override settings
                if( override ) { element.currentTime = 0; }

                // Play sound
                element.play();

                // On complete
                setTimeout(function(){ hasCallback(); }, 1000 * (element.duration));

            } else {
               hasCallback();
            }
    	},

        pauseSound: function(id) {
            document.getElementById(id).pause();
        },

    	stopSound: function(id) {
            var element = document.getElementById(id);
            element.currentTime = 0;
            element.pause();
    	},

    	stopAllSounds: function() {
    		currentTrack = null;

    		for (var i = soundList.length - 1; i >= 0; i--) {
                var element = document.getElementById(soundList[i].id);
                element.currentTime = 0;
                element.pause();
    		};
    	},

    	playTrack: function() {
            if ( isActive ){
        		for (var i = soundList.length - 1; i >= 0; i--) {
        			if(soundList[i].isTrack) {
                        document.getElementById(soundList[i].id).play();
                        currentTrack = soundList[i].id;
        				break;
        			}
        		}
            }
    	},

    	stopTrack: function() {
    		if(currentTrack != null) {
                var element = document.getElementById(currentTrack);
                element.currentTime = 0;
    			element.pause();
                currentTrack = null;
    		}
    	},

    	toggleSounds: function() {
    		if(localStorage.musicStatus == "mute"){
                isActive = true;
				localStorage.musicStatus = "on";
                document.getElementById(muteButton).innerHTML = textOn;
                gkSound.playTrack();
			} else {
                isActive = false;
				localStorage.musicStatus = "mute";
                document.getElementById(muteButton).innerHTML = textOff;
				gkSound.stopAllSounds();
			}
    	}
    }

})();