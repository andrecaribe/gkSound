<!DOCTYPE html>
<html lang="en">
  <?php include_once "includes/head.php"; ?>
  <body onLoad="onLoaded()">
    <?php include_once "includes/menu.php"; ?>
    
    <div class="container-fluid">
      <div class="row-fluid">
        
        <?php include_once "includes/navigator.php"; ?>

        <div class="span9">
          <h3>Play Sound: without override</h3>
          <p>The sound will play, always in early, even if it is a sound asset with the same id.</p>
<pre>// Add sound
gkSound.addSound('sfx1','sounds/sfx_01.mp3', false, false);
// Play sound
gkSound.play('sfx1', true);</pre>
          <button id="play" class="btn btn-danger" type="button"><i class="icon-play icon-white"></i> Play</button>
          <script type="text/javascript" src="../gkSound.js"></script>
          <script type="text/javascript">
            function onLoaded(){
              gkSound.init();

              gkSound.addSound('sfx1','sounds/sfx_01.mp3', false, false);

              var element = document.getElementById('play');
              element.addEventListener("click", function(){
                gkSound.playSound('sfx1', true);
              }, false);
            }
            
          </script>
        </div><!--/span-->
      </div><!--/row-->

      <?php include_once "includes/footer.php"; ?>

    </div><!--/.fluid-container-->

    <?php include_once "includes/scripts.php"; ?>

  </body>
</html>
