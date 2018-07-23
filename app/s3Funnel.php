<?php
// #send s3 info to js for posting on Google Map
//Would have rather used JS s3 plugin...

$numUploaded = $_SESSION["numUploaded"];
for($i =0; $i< $numUploaded; $i++){
  //for each file uploaded...
  $pdfName = $_SESSION["file$i"];
  //...get the corresponding JSON output from S3
  $result = $s3client->getObject([
      'Bucket' => "flyeroutput",
      'Key'    => $pdfName.".json"
  ]);
  $jsonArray = json_decode($result['Body'], true);
  $address = $term = $squareFootage = $latitude = $longitude = "";
  //get essential values from the json array
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
  //populate array of S3 info for use by mapScript.js
  echo  "<script>
            var pdfName = '$pdfName';
            var address = '$address';
            var term = '$term';
            var squareFootage = '$squareFootage';
            addS3Info(pdfName, address, term, squareFootage);
        </script>";
}?>
