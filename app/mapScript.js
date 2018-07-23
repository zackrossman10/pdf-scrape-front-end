//Java Script managing dynamic autofill and adding of property
//info to map on displayParsed.php

var map; //Google API map
var geocoder = new google.maps.Geocoder();
var markers = []; //markers representing properties added to the map

var s3Info = []; //info from output S3 JSON on each PDF uploaded
var total; //total number of PDFs uploaded
var counter = 0; //index of PDF form
var activeCounter = 0; //number of markers on the map

//add a PDF's information to main array
function addS3Info(pdfName, address, term, squareFootage){
  var s3object = [pdfName, address, term, squareFootage];
  s3Info.push(s3object);
}

//set a JS variable reflecting number of PDFs were uploaded
function setTotal(totalPdfs){
  total = totalPdfs;
}

//initalize the map (bug with resetting...)
function initialize() {
	var mapOptions = {
		zoom: 3,
		mapTypeControlOptions: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	geocoder.geocode( { 'address': "222 W Avenida Valencia" }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Could not find location: " + location);
		}
	});
}

//Add a property to the map
function addMarker(fullAddress, addrLat, addrLong) {
	addrLat = addrLat;
	addrLong = addrLong;
	addrLocation = new google.maps.LatLng(parseFloat(addrLat), parseFloat(addrLong));
	var markerOptions = {
		position: addrLocation,
		map: map
	}
	var marker = new google.maps.Marker(markerOptions);
	var contentString = getContentString(fullAddress);
	marker.infowindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 150
	});
	google.maps.event.addListener(marker, 'mouseover', function() {
		this.infowindow.open(map, this);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		this.infowindow.close(map, this);
	});
	markers[counter] = marker;
	setBounds();
}

//create html string containing relevant info to be displayed on a property
function getContentString(fullAddress){
	var propertyName = "<p><strong>"+document.getElementById('propName').value+"</strong></p>";
	var address = "<p>"+fullAddress+"</p>";
	return propertyName+address;
}

//fit bounds of map to any number of properties
function setBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var i=0; i < markers.length; i++) {
			if(markers[i] != null){
				bounds.extend(markers[i].getPosition());
			}
    }
		//don't set bounds too close to one point
		if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
       var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
       var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
       bounds.extend(extendPoint1);
       bounds.extend(extendPoint2);
    }
    map.fitBounds(bounds);
}

//autofill a given PDF's info in the front end form
function autofill(counter){
  var pdfName = document.getElementById('pdfName');
  var address = document.getElementById('address');
  var squareFootage = document.getElementById('squareFootage');
  var pdfIndex = document.getElementById('pdfIndex');
  var displayCounter = counter+1;
  pdfName.innerHTML = s3Info[counter][0];
  address.value = s3Info[counter][1];
  squareFootage.value = s3Info[counter][3];
  pdfIndex.innerHTML = "("+displayCounter+" out of "+total+")";
  var term = s3Info[counter][2];
  if(term == "Sale"){
    document.getElementById('sale').checked = true;
    document.getElementById('lease').checked = false;
  }else{
    document.getElementById('lease').checked = true;
    document.getElementById('sale').checked = false;
  }
}

//wrapper function, Promise used to make sure "increment" executes after "addToMap"
function addAddress(){
	var address = document.getElementById('address').value;
	return Promise.all([addToMap(address), increment()])
}

//add an address to the map
function addToMap(address){
	geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				activeCounter ++;
				var fullAddress = results[0].formatted_address;
				var addressType = results[0].address_components[0].types[0];
				var addrLat = results[0].geometry.location.lat();
				var addrLong = results[0].geometry.location.lng();
				addMarker(fullAddress, addrLat, addrLong);
			} else {
				alert("Could not find location: " + location);
			}
	 });
}


//move to the next PDF (or give option to finish once all PDFs have been processed)
function increment(){
  counter += 1;
  if(counter<total){
    autofill(counter);
  }else{
    document.getElementById('finish').innerHTML = "<button class='nav' onclick='finish()'>Finish</button>";
    document.getElementById('nav-buttons').innerHTML = "<button class='nav' onclick='removeAddress()'>Back</button>";
  }
}

//remove an address from the map
function removeAddress(){
	if(activeCounter >0){
		if(markers[counter] != null){
			markers[counter].setMap(null);
			markers[counter] = null;
			setBounds();
		}
	}else {
		initialize();
	}
	decrement();
}

//return to the previous PDF form
function decrement(){
  if(counter > 0){
    counter -= 1;
    autofill(counter);
    document.getElementById('nav-buttons').innerHTML = "<button class='nav' onclick='removeAddress()'>Back</button><button class='nav' onclick='increment()'>Skip</button><button class='nav' onclick='addAddress()'>Next</button>";
    document.getElementById('finish').innerHTML = "";
  }
}

//present the user with the option to finish
function finish(){
  document.getElementById('pdfDataForm').innerHTML = "<h2>All PDFs ingested</h2><br><h4><a href='upload.php'>Upload more</h4>";
}

google.maps.event.addDomListener(window, 'load', initialize);
