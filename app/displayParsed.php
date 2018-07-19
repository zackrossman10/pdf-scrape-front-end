<?php
  require 'start.php';
  session_start();
  $pdfName = $_SESSION["file0"];
  $numUploaded = $_SESSION["numUploaded"];

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
</head>
<body>
  <div class = "section" id="pdfDataForm">
    <h2>Confirm Information: </h2>
    <h4 style="margin-bottom: 2%" id="pdfName" <?php echo "value='$pdfName'> $pdfName;" ?></h2>
    <p style="margin-top: 0" id="pdfIndex" <?php echo "value='$numUploaded'>(1 out of $numUploaded PDFs)"?></p>
    <form id = "manualCheck" method="post" action="displayParsed.php">
    <?php
      $result = $s3client->getObject(array(
          'Bucket' => "flyeroutput",
          'Key'    => $pdfName.".json"
      ));

      $jsonArray = json_decode($result['Body'], true);
      foreach($jsonArray as $criteria => $value){
        if(is_array($value)){
          foreach($value as $index => $arrValue){
            $label = $criteria." #".($index+1);
            echo "<legend for='$criteria'><span class='label'>$label</span>
                 <input type='text' id='$criteria' value='$arrValue'>
                 </legend><br>";
          }
        }else{
          echo "<legend for='$criteria'><span class='label'>$criteria</span>
               <input type='text' id='$criteria' value='$value'>
               </legend><br>";
        }
      }
    ?>
    <input type="text" value="Add To Map" onclick="addAddress()">
    </form>
  </div>
  <div class="" id="map"></div>
</body>
</html>
