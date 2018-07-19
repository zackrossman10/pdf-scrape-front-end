var map;
var geocoder = new google.maps.Geocoder();
var markers = [];
var contentString = '<h1>This is the Title!</h1>';
var locations = [];

function initialize() {
	var mapOptions = {
		zoom: 3,
		mapTypeControlOptions: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	geocoder.geocode( { 'address': "United States" }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Could not find location: " + location);
		}
	});
}

function addAddress(){
	var address = document.getElementById('geocoded_address').value;
	geocoder.geocode( { 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				addrLat = results[0].geometry.location.lat();
				addrLong = results[0].geometry.location.lng();
				addLatLong(addrLat, addrLong);
			} else {
				alert("Could not find location: " + location);
			}
	 });
}


function addLatLong(addrLat, addrLong){
	addMarker(new google.maps.LatLng(parseFloat(addrLat), parseFloat(addrLong)));
}

//Add a property to the map
function addMarker(location) {
	var markerOptions = {
		position: location,
		map: map
	}
	var marker = new google.maps.Marker(markerOptions);
	var contentString = getContentString();
	marker.infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	google.maps.event.addListener(marker, 'mouseover', function() {
		this.infowindow.open(map, this);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		this.infowindow.close(map, this);
	});
	markers.push(marker);
	setBounds();
}

//create html string containing relevant info to be displayed on a property
function getContentString(){
	var pdfName = "<p>PDF: <strong>"+document.getElementById('pdfName').value+"</strong></p>";
	var pdfIndex = "<p>"+document.getElementById('pdfIndex').value+"</p><br>";
	var address = "<p>Address: "+document.getElementById('geocoded_address').value+"</p>";
	var addressType = "<p>Type: "+document.getElementById('address_type').value+"</p>";
	return pdfName+pdfIndex+address+addressType;
}

//fit bounds of map to any number of properties
function setBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var i=0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
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

google.maps.event.addDomListener(window, 'load', initialize);
