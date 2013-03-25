<!DOCTYPE html>
<html lang="en">
  <?php include_once "includes/head.php"; ?>
  <body onLoad="onLoaded()">
          
    <?php include_once "includes/menu.php"; ?>
    
    <div class="container-fluid">
      <div class="row-fluid">
        
        <?php include_once "includes/navigator.php"; ?>

        <div class="span9">
          <h3>3D Simulation: fixed emitter</h3>
          <p></p>
<pre>// Add sound track
gkSound.addSound('track','sounds/music_01', true, true );

// Add listener on div.id "block", with 50ms of refresh
gkSound.addSoundListener( document.getElementById("block"), 50 );

// Add emitter
gkSound.addSoundEmitter( { id:'myEmitter', fixed:true, top:0, left:0, range:300, sounds:[] } );

// Link sound track with emitter
gkSound.attachToSoundEmitter( 'myEmitter', 'track' );</pre>
          <div style="background-color:#BBB; width:300px; height:2px; top:10px; position:relative;"></div>
          <div id="block" style="width:20px; height:20px; position:relative; background-color:#000"></div>
          

          <script type="text/javascript">
            function onLoaded(){
              gkSound.init(false);

              var ele = document.getElementById("block");

              var goEnd = function(){
                TweenMax.to( ele, 10, {css:{left:0}, onComplete:goIni } );
              }
              var goIni = function(){
                TweenMax.to( ele, 10, { css:{left:300}, onComplete:goEnd } );
              }
              
              goEnd();

             
              gkSound.addSound('track','sounds/music_01', true, true );

              gkSound.addSoundListener( document.getElementById("block"), 50 );


              gkSound.addSoundEmitter( { id:'myEmitter', fixed:true, top:0, left:0, range:300, sounds:[] } );

              gkSound.attachToSoundEmitter( 'myEmitter', 'track' );
            }
            
          </script>
        </div><!--/span-->
      </div><!--/row-->

      <?php include_once "includes/footer.php"; ?>

    </div><!--/.fluid-container-->

    <?php include_once "includes/scripts.php"; ?>

  </body>
</html>
