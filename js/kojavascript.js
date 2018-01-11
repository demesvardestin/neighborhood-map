var locations = [
	    {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
	    {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
	    {name: 'Union Square', location: {lat: 40.7347062, lng: -73.9895759}},
	    {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
	    {name: 'TriBeCa Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
	    {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
	];
var Location = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
};
var AppView = function() {
	var self = this;
	this.location_list = ko.observableArray([]);
	locations.forEach(function(loc) {
		self.location_list.push(new Location(loc))
	});
	this.current_location = ko.observable(this.location_list()[0]);
};
ko.applyBindings(new AppView());
