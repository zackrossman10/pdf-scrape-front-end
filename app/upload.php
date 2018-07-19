<?php
  require 'start.php';
  session_start();
  session_unset();

  if(isset($_FILES['upload'])){
    $total = count($_FILES['upload']['name']);
    $_SESSION["numUploaded"] = $total;
    for( $i=0 ; $i < $total ; $i++ ) {
      $tmpFilePath = $_FILES['upload']['tmp_name'][$i];
      $result = $s3client->putObject(array(
        'Bucket'     => 'flyerdata',
        'Key'        => $_FILES['upload']['name'][$i],
        'SourceFile' => $tmpFilePath,
      ));
      $fullPdfName = $_FILES['upload']['name'][$i];
      $pdfName = substr($fullPdfName, 0, strlen($fullPdfName)-4);
      $sessionString = "file$i";
      $_SESSION[$sessionString] = $pdfName;
      echo $_SESSION[$sessionString];
    }
    header("Location: displayParsed.php");
    exit();
  }else{
    echo "Error Uploading";
  }

?>
 <!DOCTYPE html>
 <html>
 <body>

 <form action='upload.php' method='post' enctype='multipart/form-data'>
     Select a PDF to upload:
     <input type='file' name='upload[]' multiple="multiple">
     <input type = 'text' name='fileName'>
     <input type='submit' value='Upload Image' name='submit'>
 </form>

 </body>
 </html>
