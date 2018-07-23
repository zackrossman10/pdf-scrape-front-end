<?php
  require 'start.php';
  session_start();
  $numUploaded = $_SESSION["numUploaded"];
  #move onto the next pdf
  // if(isset($_POST['nextPDF'])){
  //   $currentPdfIndex = $_SESSION["currentPdfIndex"];
  //   $_SESSION["currentPdfIndex"] = $currentPdfIndex+1;
  // }

  //array of json output
 ?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Google Maps APIs</title>
	<link href="style.css" rel="stylesheet">
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAv1vghEx5gdzH7vHo3OLZTlFB_vm1b7U&v=3.exp"></script>
  <script type="text/javascript" src="mapScript.js"></script>
  <script type="text/javascript" src="populate.js"></script>
</head>
<body>
  <?php
    #send s3 info to js
    for($i =0; $i< $numUploaded; $i++){
      $pdfName = $_SESSION["file$i"];
      echo $pdfName;
      // $result = $s3client->getObject(array(
      //     'Bucket' => "flyeroutput",
      //     'Key'    => $pdfName.".json"
      //   ));
      // $jsonString = $result['Body'];
      // echo "<script type='text/javascript'>addS3Info($jsonString)</script>";
      // unset($_SESSION["file$currentPdfIndex"]);
    }
  ?>
  <?php echo "Hi"?>
  <div class = "section" id="pdfDataForm">
    <h2>Confirm Information: </h2>
    <h4 style="margin-bottom: 2%" id="pdfName"></h2>
    <p style="margin-top: 0" id="pdfIndex">1 out of 4</p>
    <form id = "manualCheck" method="post" action="displayParsed.php">
      <legend for='pdfName'><span class='label'></span>
      <input type='text' id='pdfame'>
      </legend><br>"
      <legend for='address'><span class='label'></span>
      <input type='text' id='address'>
      </legend><br>"
      <legend for='term'><span class='label'></span>
      <input type='text' id='term'>
      </legend><br>"
      <legend for='squareFootage'><span class='label'></span>
      <input type='text' id='squareFootage'>
    <input type='text' value='Add To Map' onclick='addMarker()'>
    <input type="submit" name="nextPDF" value="Done">
    </form>
  </div>
  <div class="" id="map"></div>
</body>
</html>
