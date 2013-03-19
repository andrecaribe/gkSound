gkSound
=======

Simple HTML5 sound manager in JavaScript

How to use
----------

Sounds should be .mp3 and .ogg to work correctly on browsers.

`<script type="text/javascript" src="gkSound.js"></script>
<script type="text/javascript">
	gkSound.init();
	gkSound.addSound('id','path/to/sound', false, false, function(){
        console.log('Loaded!');
    });
    gkSound.playSound('id');
</script>`

- [ ] implements removeSound method
- [ ] implements nextTrack and prevTrack methods
- [ ] implements callback on track is complete
- [ ] implements autoVolume
- [ ] implements autoPan
- [ ] move away CSS from standard button to a new document.