"use strict";

$(window).ready(function () {
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();
	var mysoundBox = new SoundBox(audioContext);
	var myDistortion = new Distortion(audioContext);
	var myDelay = new Delay(audioContext);

	mysoundBox.connect(myDistortion.input);
	myDistortion.connect(myDelay.input);
	myDelay.connect(audioContext.destination);

	mysoundBox.start();
	$("html").mousemove(function (e) {
		mysoundBox.frequency = mysoundBox.baseFreq + e.clientX / 2;
		$("#frequency").text(mysoundBox.frequency);
	});
});