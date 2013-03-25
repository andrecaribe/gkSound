<!DOCTYPE html>
<html lang="en">
  <?php include_once "includes/head.php"; ?>
  <body>
    <?php include_once "includes/menu.php"; ?>
    
    <div class="container-fluid">
      <div class="row-fluid">
        
        <?php include_once "includes/navigator.php"; ?>

        <div class="span9">
          <h3>Setup: initializing</h3>
<pre>gkSound.init();</pre>
          <p>If you want to use default toggle mute button:</p>
<pre>gkSound.init(true);</pre>
          <p>If you want to use other toggle mute button ou should pass the id of element:</p>
<pre>gkSound.init(true, 'id');</pre>

        </div><!--/span-->
      </div><!--/row-->

      <?php include_once "includes/footer.php"; ?>

    </div><!--/.fluid-container-->

    <?php include_once "includes/scripts.php"; ?>

  </body>
</html>
