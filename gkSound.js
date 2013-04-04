/**
 *	@author decocaribe [at] gmail [dot] com
 */
 var gkSound = (function() {
    
    var soundList = [];
    var musicList = [];
    var pauseList = [];
    var emitterList = [];
    var listener = null;
    var refreshRate = 100;
    var refreshInterval = null;
    var globalVolume = 1;
    var currentTrack = null;
    var conteiner;
    var muteButton;
    var isActive;
    var textOn  = '<div class="btnImage" style="left:0"></div>';
    var textOff = '<div class="btnImage" style="left:-100%"></div>';

    var createConteiner = function() {
        var soundConteiner = document.createElement("div");
        soundConteiner.id = "sounds";

        document.body.appendChild(soundConteiner);
    }

    var createMuteButton = function() {
        var muteConteiner = document.createElement("div");
            muteConteiner.id = "btnMute";

        var imageMuteConteiner = document.createElement("div");
            imageMuteConteiner.class = "btnImage";

        muteConteiner.appendChild(imageMuteConteiner);
        
        document.body.appendChild(muteConteiner);

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

    var run = function(){

        var sound;
        var distance, degree, volume, x1, y1;
        var x2 = (listener.style.left).replace("px","");
        var y2 = (listener.style.top).replace("px","");

        for (var i = emitterList.length - 1; i >= 0; i--) {
            for (var j = emitterList[i].sounds.length - 1; j >= 0; j--) {
                
                sound = emitterList[i].sounds[j];
                
                x1 = emitterList[i].left;
                y1 = emitterList[i].top;
                
                // calculate pan/degree
                //degree = Math.atan2( x2-x1, x2-y1 );

                // calculate vol/distance with manhattam
                distance = ( x1-x2 > 0 ? x1-x2 : x2-x1 ) + ( y1-y2 > 0 ? y1-y2 : y2-y1 );
           
                if(distance < emitterList[i].range) {
                    volume = 1 - (distance/emitterList[i].range);
                    volume = volume < 0 ? volume*-1 : volume;
                } else {
                    volume = 0;
                }
                sound.volume = volume;
            }
        }
    }

    return {

    	init: function(autoCreateMuteButton, muteButtonId) {
    		createConteiner();

            if(autoCreateMuteButton == true) {
                if( muteButtonId == undefined) {
                    createMuteButton();
                } else {
                    muteButton = muteButtonId;  
                }

                document.getElementById(muteButton).addEventListener('click', function(){
                    gkSound.toggleSounds();
                });

                checkLocalStorage();
            } else {
                localStorage.musicStatus = "on";
                isActive = true;
            }
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

        addSoundListener: function(element) {
            listener = element;

            if(refreshInterval != null){
                clearInterval(refreshInterval);
            }
            refreshInterval = setInterval(run, refreshRate);
        },

        addSoundEmitter: function(emitter){
            emitterList.push( emitter );
        },

        attachToSoundEmitter: function(emitter, sound){
            for (var i = emitterList.length - 1; i >= 0; i--) {
                if(emitterList[i].id == emitter){
                    emitterList[i].sounds.push( document.getElementById( sound ) );
                    break;
                }
            }
        },  

    	playSound: function(id, override, onComplete) {
            var element = document.getElementById(id);

            var hasCallback = function(status){
                if( onComplete != undefined ){ onComplete(status); }
            }

            var onEnded = function() {
                element.removeEventListener('ended', onEnded);
                element.playing = false;
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
                element.playing = true;

                element.addEventListener('ended', onEnded, false);

            } else {
               hasCallback( { message:"Sound was muted.", code:-1 } );
            }
    	},

        resumeAllSounds: function(){
            for (var i = pauseList.length - 1; i >= 0; i--) {
                document.getElementById(pauseList[i]).play();
            };
        },

        pauseSound: function(id) {
            document.getElementById(id).pause();
        },

        pauseAllSounds: function() {
            if(currentTrack != null) {
                gkSound.pauseSound(currentTrack);
                pauseList.push(currentTrack);
            }
            
            for (var i = soundList.length - 1; i >= 0; i--) {
                gkSound.pauseSound(soundList[i].id);
                if( document.getElementById(soundList[i].id).playing == true ){
                    pauseList.push(soundList[i].id);
                }
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
            if(currentTrack != null) {
                gkSound.stopSound(currentTrack);
                currentTrack = null;
            }
            
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
    	},
        
        setGlobalVolume: function(value, isRelative){
            var vol;

            isRelative = !isRelative ? false : true;
            
            globalVolume = value;
            
            for (var i = soundList.length - 1; i >= 0; i--) {
               vol = isRelative === true ? soundList[i].volume * globalVolume : value;
               soundList[i].volume = vol;
            };

            for (var i = musicList.length - 1; i >= 0; i--) {
               vol = isRelative === true ? musicList[i].volume * globalVolume : value;
               musicList[i].volume = vol;
            };
        },

        getGlobalVolume: function(){
            return globalVolume;
        },

        setVolume: function(id, value, isRelative) {
            isRelative = isRelative == undefined ? false : true;
            
            var vol = isRelative === true ? value*globalVolume : value;
            document.getElementById(id).volume = vol;
        },

        getVolume: function(id) {
            return document.getElementById(id).volume;
        }
    }

})();