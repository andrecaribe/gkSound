/**
 *	@author decocaribe [at] gmail [dot] com
 */
 var gkSound = (function() {
    
    var soundList = [];
    var musicList = [];

    var currentTrack = null;
    var conteiner;
    var muteButton;
    var isActive;
    var textOn  = '<div class="btnImage" style="left:0"></div>';
    var textOff = '<div class="btnImage" style="left:-100%"></div>';

    var createConteiner = function() {
        document.body.innerHTML += '<div id="sounds" style="display:none"></div>';
    }

    var createMuteButton = function() {
    	document.body.innerHTML = '<div id="btnMute"><div class="btnImage"></div></div>' + document.body.innerHTML;
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
                break;
            }
        }

        for (var i = musicList.length - 1; i >= 0; i--) {
            if( musicList[i].id == id) {
                soundExists = true;
                break;
            }
        };

        return soundExists;
    }

    var getFileURL = function(file) {
        var url;
        var query;
        var type;
        
        // Select type of file by browser support
        type = gkSound.hasMP3Support() == true ? '.mp3' : '.ogg';
        
        // Select type of file by file name
       
        if( file.search(".mp3") != -1 ){
            query = file.split('.mp3');
            type = '.mp3';
        } else if( file.search(".ogg") != -1 ){
            query = file.split('.ogg');
            type = '.ogg';
        } else {
            query = null;
        }

        // Mount
        if(query != null) {
            url = query[0]+type+(query[1] ? query[1] : "");
        } else {
            url = file+type;
        }

        return url;
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

        hasMP3Support:function(){
            var a = document.createElement('audio');
            return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        },

        hasOGGSupport:function(){
            var a = document.createElement('audio');
            return !!(a.canPlayType && a.canPlayType('audio/ogg;').replace(/no/, ''));
        },

    	addSound: function (id, file, isTrack, autoPlay, callback) {

            var hasAutoPlay = function(){
                if( autoPlay == true ){
                    if( isTrack == false ) {
                        gkSound.playTrack();
                    } else {
                        gkSound.playTrack();
                    }
                }
            }

            var hasCallback = function(status){
                if( callback != undefined ){
                    callback(status);
                }
            }

            if( !hasSound(id) ) {

                var audio = new Audio( getFileURL(file) );
                    audio.setAttribute("id", id);

                if(isTrack) {
                    audio.setAttribute("loop", "loop");
                    musicList.push(audio);
                } else {
                    soundList.push(audio);
                }
                
                document.getElementById('sounds').appendChild(audio);

                audio.addEventListener('canplaythrough', function() {
                    hasAutoPlay();
                    hasCallback( { message:"Sound loaded.", code:0 } );
                }, false);
                
                audio.addEventListener('error', function() {
                    gkSound.removeSound(id);
                    hasCallback( { message:"Error! For more information see http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-media-error", code:audio.error.code } );
                }, false);
            } else {
                hasCallback( { message:"Sound already exists.", code:-1 } );
            }
    		
    	},

        removeSound: function(id){
            
            var index = 0;
            var audio = undefined;

            while( audio == undefined || index < soundList.length ){
                if( soundList[index].id == id ) {
                    audio = soundList[index];
                    soundList.splice(index,1);
                }
                index++;
            }

            index = 0;

            while( audio == undefined || index < musicList.length ){
                if( musicList[index].id == id ) {
                    audio = musicList[index];
                    musicList.splice(index,1);
                }
                index++;
            }

            if( audio == undefined ){
                //throw "Error! Sound not exists.";
                return { message:"Sound not exists.", code:-1 };
            }
            
            audio.parentNode.removeChild(audio);

            return { message:"Sound removed.", code:0 };
        },

    	playSound: function(id, override, onComplete) {
            var element = document.getElementById(id);

            var hasCallback = function(status){
                if( onComplete != undefined ){ onComplete(status); }
            }

            var onEnded = function() {
                element.removeEventListener('ended', onEnded);
                hasCallback( { message:"Sound played.", code:0 } );
            }

            if( isActive ) {

                if(override){
                    try {
                        element.play();
                        element.currentTime = 0;
                    } catch (e) {
                        element.play();
                    }
                } else {
                    element.play();
                }

                element.addEventListener('ended', onEnded, false);

            } else {
               hasCallback( { message:"Sound was muted.", code:-1 } );
            }
    	},

        pauseSound: function(id) {
            document.getElementById(id).pause();
        },

        pauseAllSounds: function() {
            // Music
            if(currentTrack != null) {
                gkSound.pauseSound(currentTrack);
            }
            
            // Sounds
            for (var i = soundList.length - 1; i >= 0; i--) {
                gkSound.pauseSound(soundList[i].id);
            }
        },

    	stopSound: function(id) {
            var element = document.getElementById(id);
            try {
                element.play();
                element.currentTime = 0;
                element.pause();
            } catch (e){
                element.pause();
            }
    	},

    	stopAllSounds: function() {
            // Music
            if(currentTrack != null) {
                gkSound.stopSound(currentTrack);
                currentTrack = null;
            }
            
            // Sounds
    		for (var i = soundList.length - 1; i >= 0; i--) {
                gkSound.stopSound(soundList[i].id);
    		}
    	},

    	playTrack: function() {
            if ( isActive ){
        		for (var i = musicList.length - 1; i >= 0; i--) {
        			document.getElementById(musicList[i].id).play();
                    currentTrack = musicList[i].id;
                    break;
        		}
            }
    	},

    	stopTrack: function() {
    		if(currentTrack != null) {
                gkSound.stopSound(currentTrack);
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