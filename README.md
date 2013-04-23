Gamekaze Sound
=======

Simple HTML5 sound manager.

### Examples
Live examples coming soon.

###How to use

#####1. Import gkSound script.
    
    <script type="text/javascript" src="../gkSound.min.js"></script>

#####2. Initialize gkSound.
    
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

###Documentation
See documentation (docs folder) to view all public methods.
