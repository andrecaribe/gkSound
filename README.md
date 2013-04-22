Gamekaze Sound
=======

Simple HTML5 sound manager.

### Examples
Live examples coming soon.

###How to use

#####1. Import gkSound script.
    
    <script type="text/javascript" src="../gkSound.min.js"></script>

#####2. Initialize gkSound module.
    
    gkSound.init();

#####3. Add your sound.
Choose an ID and a name of the sound file. To listen on all browsers make sure that sound has MP3 and OGG versions of the same file name.
    
    gkSound.addSound('sfx', 'sounds/sfx-01');

#####4. Play sound.
    
    gkSound.playSound('sfx');

See complete code and callback function of gkSound.playSound();
At the end of the sound, call the callback with status code of 0. If the sound can not be touched calls the callback with status code equal to -1.

    <script type="text/javascript" src="../gkSound.min.js"></script>
    <script type="text/javascript">
    gkSound.init();

    gkSound.addSound('sfx', 'sounds/sfx-01');

    var elementPlay = document.getElementById('play');
    elementPlay.addEventListener("click", function() {
        gkSound.playSound('sfx', false, function(status) {
            console.log("message: " + status.message + " code: " + status.code);
        });
    });
    </script>

###Commands

#####gkSound.init([autoCreateMuteButton, muteButtonConteiner]);
Need to use other funcitions properly. Must be called before all other gkSound functions.
This function create a default mute/unmute button and a hidden conteiner to storage sound tags.

#####gkSound.addSound('id','path/to/sound' [, isTrack, autoPlay, callback]);
Simple away to add sound in your page. Supports MP3 and OGG files.
You need to pass some parameters: id, path/to/file, isTrack, autoPlay and callback function.
If you dont pass file extension on "path/to/sound", gkSound chooses MP3 - if browser support it - or OGG - if not.
Callbacks return an Object like { message:"Sound loaded.", code:0 }. These codes are according HTML5 specifications describers here.

#####gkSound.removeSound('id');
Remove sound from the page.
If sound not exists return an erro code.

#####gkSound.playSound('id' [, override, onComplete, ignoreMute]);
Play any sound with id passed in parameters.
Override sets the sound to replay even before its completion, very util to sound effects.
onComplete trigger an event when sound is played completely.

#####gkSound.resumeAllSound();
To play sounds previously stopped by pauseAllSounds().

#####gkSound.pauseSound('id');
Pauses a specific sound.

#####gkSound.pauseAllSounds();
Pauses all music tracks and sound.
Util if you want to pause your game.

#####gkSound.stopSound('id');
Stops a specific sound.

#####gkSound.stopAllSounds();
Stops all music tracks and sound.

#####gkSound.playTrack();
Plays an music track.

#####gkSound.stopTrack();
Stops an music track.

#####addSoundListener('elementId');
Adds a listener to receive a sound.

#####addSoundEmitter('emitterId');
Adds a sound emissor.

#####attachToSoundEmitter('emitterId', 'soundId');
Link sound to emitter.

#####gkSound.toggleSounds();
Turn on/off all sounds controlled by gkSound.

#####gkSound.setGlobalVolume('id', value [, isRelative]);
Sets the global volume of the gkSound. If isRelative is true, the change will be percentual, if not, all volumes have the same value passed in parameter "value".

#####gkSound.getGlobalVolume();
Gets the global volume of the gkSound.

#####gkSound.setVolume('id', value [, isRelative]);
Sets the volume of the sound/music. If isRelative is true, volume changes is affected by globalVolume.

#####gkSound.getVolume('id');
Gets the volume of the sound/music.

#####gkSound.hasMP3Support();
Verify if client browser supports MP3 (audio/mpeg).

#####gkSound.hasOGGSupport();
Verify if client browser supports OGG (audio/ogg).
