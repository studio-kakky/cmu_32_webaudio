"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Delay = (function () {
	function Delay(ctx) {
		_classCallCheck(this, Delay);

		this._isOn = true;
		this._ctx = ctx;
		this._input = this._ctx.createGain();
		this._dry = this._ctx.createGain();
		this._delay = this._ctx.createDelay();
		this._wet = this._ctx.createGain();
		this._feedback = this._ctx.createGain();
		this._gain = this._ctx.createGain();

		this.initSetting();

		this._input.connect(this._delay);
		this._input.connect(this._dry);

		this._delay.connect(this._feedback);
		this._feedback.connect(this._delay);

		this._delay.connect(this._wet);

		this._wet.connect(this._gain);
		this._dry.connect(this._gain);
	}

	_createClass(Delay, {
		turn: {
			value: function turn() {
				this._isOn = !this._isOn;
				if (this._isOn) {
					this._turnon();
				} else {
					this._turnoff();
				}
			}
		},
		_turnoff: {
			value: function _turnoff() {
				this._input.disconnect();
				this._input.connect(this._gain);
			}
		},
		_turnon: {
			value: function _turnon() {
				this._input.disconnect();
				this._input.connect(this._delay);
				this._input.connect(this._dry);
			}
		},
		initSetting: {
			value: function initSetting() {
				this._delay.delayTime.value = 0.2;
				this._feedback.gain.value = 0.5;
				this._wet.gain.value = 0.3;
				this._dry.gain.value = 0.7;
				this._input.gain.value = 10;
				this.gain = 10;
			}
		},
		connect: {
			value: function connect(node) {
				this._gain.connect(node);
			}
		},
		delayTime: {
			get: function () {
				return this._delay.delayTime.value;
			},
			set: function (value) {
				this._delay.delayTime.value = value;
			}
		},
		feedback: {
			get: function () {
				return this._feedback.gain.value;
			},
			set: function (value) {
				this._feedback.gain.value = value;
			}
		},
		input: {
			get: function () {
				return this._input;
			}
		},
		wet: {
			set: function (value) {
				this._wet.gain.value = value;
			},
			get: function () {
				return this._wet;
			}
		},
		dry: {
			set: function (value) {
				this._dry.gain.value = value;
			},
			get: function (value) {
				return this._dry;
			}
		},
		gain: {
			set: function (value) {
				this._gain.gain.value = value;
			},
			get: function () {
				return this._gain.gain.value;
			}
		}
	});

	return Delay;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Distortion = (function () {
	function Distortion(ctx) {
		_classCallCheck(this, Distortion);

		this._isOn = true;
		this._ctx = ctx;
		this._input = this._ctx.createGain();
		this._effectnode = this._ctx.createWaveShaper();
		this._gain = this._ctx.createGain();
		this._input.connect(this._effectnode);
		this._effectnode.connect(this._gain);
		this.gain = 0.1;
		this._effectnode.curve = this._createCurve();
	}

	_createClass(Distortion, {
		_createCurve: {
			value: function _createCurve() {
				var amount = arguments[0] === undefined ? 0.9 : arguments[0];
				var sampling_num = arguments[1] === undefined ? 4096 : arguments[1];

				var curves = new Float32Array(sampling_num);
				var k = 20 * amount / (1 - amount);

				for (var i = 0; i < sampling_num; i++) {
					var x = (i - 0) * (1 - -1) / (sampling_num - 0) - 1;
					curves[i] = (1 + k) * x / (1 + k * Math.abs(x));
				}
				return curves;
			}
		},
		turn: {
			value: function turn() {
				this._isOn = !this._isOn;
				if (this._isOn) {
					this._turnon();
				} else {
					this._turnoff();
				}
			}
		},
		_turnoff: {
			value: function _turnoff() {
				this._input.disconnect();
				this._effectnode.disconnect();
				this._input.connect(this._gain);
			}
		},
		_turnon: {
			value: function _turnon() {
				this._input.disconnect();
				this._effectnode.disconnect();
				this._input.connect(this._effectnode);
				this._effectnode.connect(this._gain);
			}
		},
		connect: {
			value: function connect(node) {
				this._gain.connect(node);
			}
		},
		input: {
			get: function () {
				return this._input;
			}
		},
		gain: {
			set: function (value) {
				return this._gain.gain.value = value;
			},
			get: function () {
				return this._gain.gain.value;
			}
		}
	});

	return Distortion;
})();
//# sourceMappingURL=effector.js.map
