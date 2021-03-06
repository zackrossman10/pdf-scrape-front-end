<!--page for user to upload PDF files for ingest-->
<?php
  require 'start.php';
  session_start();
  session_unset();

  if(isset($_FILES['upload'])){
    $total = count($_FILES['upload']['name']);
    echo $total;
    $_SESSION["numUploaded"] = $total;
    for( $i=0 ; $i < $total ; $i++ ) {
      $tmpFilePath = $_FILES['upload']['tmp_name'][$i];
      $result = $s3client->putObject(array(
        'Bucket'     => 'flyerdata',
        'Key'        => $_FILES['upload']['name'][$i],
        'SourceFile' => $tmpFilePath
      ));
      $fullPdfName = $_FILES['upload']['name'][$i];
      $pdfName = substr($fullPdfName, 0, strlen($fullPdfName)-4);
      $sessionFileName = "file$i";
      $_SESSION[$sessionFileName] = $pdfName;
    }
    $_SESSION['currentPdfIndex'] = 0;
    header("Location: displayParsed.php");
    exit();
  }

?>
<!DOCTYPE html>
<html>
<head>
  <link href="style.css" rel="stylesheet">
</head>
<body>
  <form id="upload" action='upload.php' method='post' enctype='multipart/form-data'>
     Select a PDF(s) to upload:
     <input type='file' name='upload[]' multiple="multiple"><br><br>
     <input type='submit' value='Upload PDF(s)' name='submit'>
  </form>
</body>
</html>
