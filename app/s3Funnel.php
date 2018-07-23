<?php
// #send s3 info to js
for($i =0; $i< $numUploaded; $i++){
  $pdfName = $_SESSION["file$i"];
  $result = $s3client->getObject([
      'Bucket' => "flyeroutput",
      'Key'    => $pdfName.".json"
  ]);
  $jsonArray = json_decode($result['Body'], true);
  $address = $term = $squareFootage = $latitude = $longitude = "";
  foreach($jsonArray as $criteria => $value){
    if($criteria == "geocoded_address"){
      $address = $value;
    }else if($criteria == "square_footage"){
      $squareFootage = $value;
    }else if($criteria == "term"){
      echo $term;
      $term = $value;
    }
  }
  echo  "<script>
    var pdfName = '$pdfName';
    var address = '$address';
    var term = '$term';
    var squareFootage = '$squareFootage';
    addS3Info(pdfName, address, term, squareFootage);
  </script>";
  // unset($_SESSION["file$i"]);
}?>
