<!--page containing dynamic form and map for adding PDF information-->
<?php
  require 'start.php';
  session_start();
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
  <?php include "s3Funnel.php";?>
</head>
<body>
  <div class = "section" id="pdfDataForm">
    <h4 style="margin-bottom: 2%" id="pdfName"></h2>
    <p style="margin-top: 0" id="pdfIndex"></p><br>
    <form id = "manualCheck" method="post" action="displayParsed.php">
      <legend for='propName'><span class='label'>Property Name</span>
      <input type='text' id='propName'>
      </legend><br>
      <legend for='address'><span class='label'>Address</span>
      <input type='text' id='address'>
      </legend><br>
      <legend for='squareFootage'><span class='label'>Square Footage</span>
        <input type='text' id='squareFootage'>
      </legend><br>
      <div class = 'term'>
        <input type='radio' id='sale' value = "Sale">
        <label for="sale">Sale</label>
        <input type='radio' id='lease' value = "Lease">
        <label for="lease">Lease</label>
      </div>
    </form><br>
    <div id="nav-buttons">
      <button class="nav" onclick='removeAddress()'>Back</button>
      <button class="nav" onclick='increment()'>Skip</button>
      <button class="nav" onclick='addAddress()'>Next</button>
    </div>
    <br>
    <div id ="finish">
    </div>
  </div>
  <div class="" id="map"></div>
  <script>
    //setup scripts for the first form
    setTotal(<?php echo $numUploaded?>);
    autofill(0)
  </script>
</body>
</html>
