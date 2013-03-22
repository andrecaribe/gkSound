gkSound
=======

Simple HTML5 sound manager in JavaScript.

### Example
Visit http://www.andrecaribe.com.br/playground/gkSound/examples/example1.html

###How to use

Sounds should be .mp3 and .ogg to work correctly on browsers.

    <link rel="stylesheet" type="text/css" href="styles/gkSound-default.css">
    <script type="text/javascript" src="gkSound.js"></script>
    <script type="text/javascript">
      gkSound.init();
      gkSound.addSound('id','path/to/sound', false, false, function(status) {
        console.log(status.message);
      });
      gkSound.playSound('id');
    </script>
    

###Commands

#####gkSound.init();
Need to use other funcitions properly. Must be called before all other gkSound functions.
This function create a default mute/unmute button and a hidden conteiner to storage sound tags.

#####gkSound.addSound('id','path/to/sound', isTrack, autoPlay, callback);
Simple away to add sound in your page. Supports MP3 and OGG files.
You need to pass some parameters: id, path/to/file, isTrack, autoPlay and callback function.
If you dont pass file extension on "path/to/sound", gkSound chooses MP3 - if browser support it - or OGG - if not.
Callbacks return an Object like { message:"Sound loaded.", code:0 }. These codes are according HTML5 specifications describers here.

#####gkSound.removeSound('id');
Remove sound from the page.
If sound not exists return an erro code.

#####gkSound.playSound('id', override, onComplete);
Play any sound with id passed in parameters.
Override sets the sound to replay even before its completion, very util to sound effects.
onComplete trigger an event when sound is played completely.

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

#####gkSound.toggleSounds();
Turn on/off all sounds controlled by gkSound.

#####gkSound.hasMP3Support();
Verify if client browser supports MP3 (audio/mpeg).

#####gkSound.hasOGGSupport();
Verify if client browser supports OGG (audio/ogg).


###Roadmap

- [X] implements removeSound method
- [ ] implements nextTrack and prevTrack methods
- [ ] implements callback on track is complete
- [ ] implements autoVolume
- [ ] implements autoPan
- [X] move away CSS from standard button to a new document.
- [ ] documentation code
- [ ] improve example
- [ ] more examples
- [ ] minified version
- [ ] set sound/music volume
- [ ] set global volume
