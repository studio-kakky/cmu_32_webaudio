"use strict";

$(window).ready(function () {
	var leap = new LeapController();
	leap.startTracking();
	setTimeout(function () {
		console.log(leap.leftHand);
	}, 1000);
});