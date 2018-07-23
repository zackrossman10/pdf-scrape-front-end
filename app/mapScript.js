var map;
var geocoder = new google.maps.Geocoder();
var markers = [];
var contentString = '<h1>This is the Title!</h1>';
var locations = [];
var addressInfo = [];

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
	var address = document.getElementById('address').value;
	geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				fullAddress = results[0].formatted_address;
				addressType = results[0].address_components[0].types[0];
				addrLat = results[0].geometry.location.lat();
				addrLong = results[0].geometry.location.lng();
				addressInfo = [fullAddress, addressType, addrLat, addrLong];
				addMarker(addressInfo);
			} else {
				alert("Could not find location: " + location);
			}
	 });
	 increment();
}

function removeAddress(){
	markers.pop();
	if(markers.length > 0){
		setBounds();
	}else {
		initialize();
	}
	decrement();
}

//Add a property to the map
function addMarker(adddressInfo) {
	addrLat = addressInfo[2];
	addrLong = addressInfo[3];
	addrLocation = new google.maps.LatLng(parseFloat(addrLat), parseFloat(addrLong));
	var markerOptions = {
		position: addrLocation,
		map: map
	}
	var marker = new google.maps.Marker(markerOptions);
	var contentString = getContentString(addressInfo[0]);
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
function getContentString(fullAddress){
	var propertyName = "<p><strong>"+document.getElementById('propName').value+"</strong></p>";
	var address = "<p>Address: "+fullAddress+"</p>";
	return propertyName+address;
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
