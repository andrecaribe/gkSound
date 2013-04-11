/** 
 * Software License Agreement (BSD License)
 * 
 * Copyright (c) 2007, André Coelho Caribé de Azevedo. All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * The name of André Coelho Caribé de Azevedo may not be used to endorse or
 * promote products derived from this software without specific prior written
 * permission of André Coelho Caribé de Azevedo.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
 var gkSound = (function() {

    "use strict";

    var soundList = [],
        musicList = [],
        pauseList = [],
        emitterList = [],
        listener = null,
        refreshRate = 100,
        refreshInterval = null,
        globalVolume = 1,
        currentTrack = null,
        conteiner,
        muteButton,
        isActive,
        textOn = '<div class="btnImage" style="left:0"></div>',
        textOff = '<div class="btnImage" style="left:-100%"></div>',

        createConteiner = function() {
            var soundConteiner = document.createElement("div");
            soundConteiner.id = "sounds";

            document.body.appendChild(soundConteiner);
        },

        createMuteButton = function() {
            var muteConteiner = document.createElement("div"),
                imageMuteConteiner = document.createElement("div");

            muteConteiner.id = "btnMute";
            imageMuteConteiner.class = "btnImage";

            muteConteiner.appendChild(imageMuteConteiner);

            document.body.appendChild(muteConteiner);

            muteButton = 'btnMute';
        },

        checkLocalStorage = function() {
            if (localStorage.musicStatus !== "" || localStorage.musicStatus !== null) {
                if (localStorage.musicStatus === "mute") {
                    gkSound.stopAllSounds();
                    document.getElementById(muteButton).innerHTML = textOff;
                    isActive = false;
                } else {
                    localStorage.musicStatus = "on";
                    document.getElementById(muteButton).innerHTML = textOn;
                    isActive = true;
                }
            }
        },

        hasSound = function(id) {
            var soundExists = false,
                i;

            for (i = soundList.length - 1; i >= 0; i--) {
                if (soundList[i].id === id) {
                    soundExists = true;
                    break;
                }
            }

            for (i = musicList.length - 1; i >= 0; i--) {
                if (musicList[i].id === id) {
                    soundExists = true;
                    break;
                }
            }

            return soundExists;
        },

        getFileURL = function(file) {
            var url,
                query,
                type;

            // Select type of file by browser support
            type = gkSound.hasMP3Support() == true ? '.mp3' : '.ogg';

            // Select type of file by file name
            if (file.search(".mp3") !== -1) {
                query = file.split('.mp3');
                type = '.mp3';
            } else if (file.search(".ogg") !== -1) {
                query = file.split('.ogg');
                type = '.ogg';
            } else {
                query = null;
            }

            if (query !== null) {
                url = query[0] + type + (query[1] ? query[1] : "");
            } else {
                url = file + type;
            }

            return url;
        },

        run = function() {

            var sound,
                distance,
                //degree,
                volume,
                x1,
                y1,
                x2 = (listener.style.left).replace("px", ""),
                y2 = (listener.style.top).replace("px", ""),
                i,
                j;

            for (i = emitterList.length - 1; i >= 0; i--) {
                for (j = emitterList[i].sounds.length - 1; j >= 0; j--) {

                    sound = emitterList[i].sounds[j];

                    x1 = emitterList[i].left;
                    y1 = emitterList[i].top;

                    // calculate pan/degree
                    //degree = Math.atan2(x2 - x1, x2 - y1);

                    // calculate vol/distance with manhattam
                    distance = (x1 - x2 > 0 ? x1 - x2 : x2 - x1) + (y1 - y2 > 0 ? y1 - y2 : y2 - y1);

                    if (distance < emitterList[i].range) {
                        volume = 1 - (distance / emitterList[i].range);
                        volume = volume < 0 ? volume * -1 : volume;
                    } else {
                        volume = 0;
                    }
                    sound.volume = volume;
                }
            }
        };

    return {

        init: function(autoCreateMuteButton, muteButtonId) {
            createConteiner();

            if (autoCreateMuteButton === true) {
                if (muteButtonId === undefined) {
                    createMuteButton();
                } else {
                    muteButton = muteButtonId;
                }

                document.getElementById(muteButton).addEventListener('click', function() {
                    gkSound.toggleSounds();
                });

                checkLocalStorage();
            } else {
                localStorage.musicStatus = "on";
                isActive = true;
            }
        },

        hasMP3Support: function() {
            var a = document.createElement('audio');
            return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        },

        hasOGGSupport: function() {
            var a = document.createElement('audio');
            return !!(a.canPlayType && a.canPlayType('audio/ogg;').replace(/no/, ''));
        },

        addSound: function (id, file, isTrack, autoPlay, callback) {

            var audio,

                hasAutoPlay = function() {
                    if (autoPlay === true) {
                        if (isTrack === false) {
                            gkSound.playTrack();
                        } else {
                            gkSound.playTrack();
                        }
                    }
                },

                hasCallback = function(status) {
                    if (callback !== undefined) {
                        callback(status);
                    }
                };

            if (!hasSound(id)) {

                audio = new Audio(getFileURL(file));
                audio.setAttribute("id", id);

                if (isTrack) {
                    audio.setAttribute("loop", "loop");
                    musicList.push(audio);
                } else {
                    soundList.push(audio);
                }

                document.getElementById('sounds').appendChild(audio);

                audio.addEventListener('canplaythrough', function() {
                    hasAutoPlay();
                    hasCallback({message: "Sound loaded.", code: 0});
                }, false);

                audio.addEventListener('error', function() {
                    gkSound.removeSound(id);
                    hasCallback({message: "Error! For more information see http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-media-error", code: audio.error.code});
                }, false);
            } else {
                hasCallback({message: "Sound already exists.", code: -1});
            }
        },

        removeSound: function(id) {

            var index = 0,
                audio;

            while (audio === undefined || index < soundList.length) {
                if (soundList[index].id === id) {
                    audio = soundList[index];
                    soundList.splice(index, 1);
                }
                index++;
            }

            index = 0;

            while (audio === undefined || index < musicList.length) {
                if (musicList[index].id === id) {
                    audio = musicList[index];
                    musicList.splice(index, 1);
                }
                index++;
            }

            if (audio === undefined) {
                //throw "Error! Sound not exists.";
                return {message: "Sound not exists.", code: -1};
            }

            audio.parentNode.removeChild(audio);

            return {message: "Sound removed.", code: 0};
        },

        addSoundListener: function(element) {
            listener = element;

            if (refreshInterval !== null) {
                clearInterval(refreshInterval);
            }
            refreshInterval = setInterval(run, refreshRate);
        },

        addSoundEmitter: function(emitter) {
            emitterList.push(emitter);
        },

        attachToSoundEmitter: function(emitter, sound) {
            var i;

            for (i = emitterList.length - 1; i >= 0; i--) {
                if (emitterList[i].id === emitter) {
                    emitterList[i].sounds.push(document.getElementById(sound));
                    break;
                }
            }
        },

        playSound: function(id, override, onComplete, ignoreMute) {
            var element = document.getElementById(id),
                ignoreMute = ignoreMute === undefined ? false : ignoreMute,

                hasCallback = function(status) {
                    if (onComplete !== undefined) {
                        onComplete(status);
                    }
                },

                onEnded = function() {
                    element.removeEventListener('ended', onEnded);
                    element.playing = false;
                    hasCallback({message: "Sound played.", code: 0});
                };

            if (isActive || ignoreMute) {

                if (override) {
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
                hasCallback({message: "Sound was muted.", code: -1});
            }
        },

        resumeAllSounds: function() {
            var i;

            for (i = pauseList.length - 1; i >= 0; i--) {
                document.getElementById(pauseList[i]).play();
            }
        },

        pauseSound: function(id) {
            document.getElementById(id).pause();
        },

        pauseAllSounds: function() {
            var i;

            if (currentTrack !== null) {
                gkSound.pauseSound(currentTrack);
                pauseList.push(currentTrack);
            }

            for (i = soundList.length - 1; i >= 0; i--) {
                gkSound.pauseSound(soundList[i].id);
                if (document.getElementById(soundList[i].id).playing === true) {
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
            } catch (e) {
                element.pause();
            }
        },

        stopAllSounds: function() {
            var i;

            if (currentTrack !== null) {
                gkSound.stopSound(currentTrack);
                currentTrack = null;
            }

            for (i = soundList.length - 1; i >= 0; i--) {
                gkSound.stopSound(soundList[i].id);
            }
        },

        playTrack: function() {
            var i;

            if (isActive) {
                for (i = musicList.length - 1; i >= 0; i--) {
                    document.getElementById(musicList[i].id).play();
                    currentTrack = musicList[i].id;
                }
            }
        },

        stopTrack: function() {
            if (currentTrack !== null) {
                gkSound.stopSound(currentTrack);
                currentTrack = null;
            }
        },

        toggleSounds: function() {
            if (localStorage.musicStatus === "mute") {
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

        setGlobalVolume: function(value, isRelative) {
            var vol,
                i;

            isRelative = !isRelative ? false : true;

            globalVolume = value;

            for (i = soundList.length - 1; i >= 0; i--) {
                vol = isRelative === true ? soundList[i].volume * globalVolume : value;
                soundList[i].volume = vol;
            }

            for (i = musicList.length - 1; i >= 0; i--) {
                vol = isRelative === true ? musicList[i].volume * globalVolume : value;
                musicList[i].volume = vol;
            }
        },

        getGlobalVolume: function() {
            return globalVolume;
        },

        setVolume: function(id, value, isRelative) {
            isRelative = isRelative === undefined ? false : true;

            var vol = isRelative === true ? value * globalVolume : value;
            document.getElementById(id).volume = vol;
        },

        getVolume: function(id) {
            return document.getElementById(id).volume;
        }
    }
})();