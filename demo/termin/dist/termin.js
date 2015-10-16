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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Finger = (function (_THREE$Object3D) {
  function Finger() {
    var baseScale = arguments[0] === undefined ? 1 : arguments[0];

    _classCallCheck(this, Finger);

    _get(Object.getPrototypeOf(Finger.prototype), "constructor", this).call(this);
    this.baseRadius = 3;
    this.createFinger(baseScale);
  }

  _inherits(Finger, _THREE$Object3D);

  _createClass(Finger, {
    createFinger: {
      value: function createFinger(baseScale) {
        this.proximal = this.createOneBone(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.2, baseScale, 0.2));
        this.intermediate = this.createOneBone(new THREE.Vector3(0, this.baseRadius * baseScale * 2.1, 0), new THREE.Vector3(0.2, baseScale * 0.8, 0.2));
        this.dispal = this.createOneBone(new THREE.Vector3(0, this.baseRadius * baseScale * 3.8, 0), new THREE.Vector3(0.2, baseScale * 0.4, 0.2));
        //this.container.add(this.proximal, this.intermediate, this.dispal);
        this.add(this.proximal, this.intermediate, this.dispal);
      }
    },
    createOneBone: {
      value: function createOneBone(position, scale) {
        var container = new THREE.Object3D();
        var geometry = new THREE.SphereGeometry(this.baseRadius, 16, 16);
        var material = new THREE.MeshBasicMaterial({ color: 16777215, wireframe: true });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.scale.copy(scale);
        sphere.position.set(0, this.baseRadius * scale.y, 0);

        container.add(sphere);
        container.position.copy(position);

        return container;
      }
    }
  });

  return Finger;
})(THREE.Object3D);

;
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Hand = (function (_THREE$Object3D) {
  function Hand() {
    var isRight = arguments[0] === undefined ? true : arguments[0];

    _classCallCheck(this, Hand);

    _get(Object.getPrototypeOf(Hand.prototype), "constructor", this).call(this);
    this.body = this.createBody();
    this.add(this.body);
    this.setFingers(isRight);
  }

  _inherits(Hand, _THREE$Object3D);

  _createClass(Hand, {
    setFingers: {
      value: function setFingers(isRight) {
        var posDir = isRight ? 1 : -1;
        var finger0 = new Finger(0.8);
        finger0.rotation.set(0, 0, Math.PI * 0.1 * posDir);
        finger0.position.set(-7 * posDir, 0, 0);

        var finger1 = new Finger();
        finger1.rotation.set(0, 0, 0);
        finger1.position.set(-5 * posDir, 7, 0);

        var finger2 = new Finger(1);
        finger2.rotation.set(0, 0, 0);
        finger2.position.set(-1 * posDir, 9.5, 0);

        var finger3 = new Finger();
        finger3.rotation.set(0, 0, 0);
        finger3.position.set(3 * posDir, 8.5, 0);

        var finger4 = new Finger(0.8);
        finger4.rotation.set(0, 0, 0);
        finger4.position.set(6 * posDir, 6, 0);

        this.fingers = [finger0, finger1, finger2, finger3, finger4];

        this.add(finger0, finger1, finger2, finger3, finger4);
      }
    },
    createBody: {
      value: function createBody() {
        var rad = 5;
        var body = new THREE.Object3D();
        var geometry = new THREE.TorusGeometry(rad, 0.6, 16, 16);
        var material = new THREE.MeshBasicMaterial({ color: 16777215, wireframe: true });
        var torus = new THREE.Mesh(geometry, material);
        torus.position.set(0, rad / 2, 0);
        body.add(torus);

        return body;
      }
    }
  });

  return Hand;
})(THREE.Object3D);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var SoundBox = (function () {
	function SoundBox(ctx) {
		var freq = arguments[1] === undefined ? 440 : arguments[1];
		var gain = arguments[2] === undefined ? 0.5 : arguments[2];

		_classCallCheck(this, SoundBox);

		if (ctx) {

			this._ctx = ctx;
			this._node1 = this._ctx.createOscillator();
			this._node2 = this._ctx.createOscillator();

			this._node1Gain = this._ctx.createGain();
			this._node2Gain = this._ctx.createGain();

			this._lfo = this._ctx.createOscillator();
			this._vcf = this._ctx.createBiquadFilter();

			this._vcfGain = this._ctx.createGain();
			this._masterGain = this._ctx.createGain();
			this._controleGain = this._ctx.createGain();
			this._controleGain.gain.value = 1;

			this._node1.connect(this._node1Gain);
			this._node2.connect(this._node2Gain);

			this._node1Gain.connect(this._vcf);
			this._node2Gain.connect(this._vcf);

			this._lfo.connect(this._node1.frequency);
			this._lfo.connect(this._node2.frequency);
			this._lfo.connect(this._vcf.detune);
			this._vcf.connect(this._vcfGain);
			this._vcfGain.connect(this._controleGain);
			this._controleGain.connect(this._masterGain);

			this._node2.type = "sawtooth";

			this._node2.detune.value = -35;
			this._lfo.frequency.value = 10000;
			this._vcf.frequency.value = 50;

			this._baseFrequency = freq;
			this.frequency = freq;
			this._vcfGain.gain.value = 2;

			this.gain = gain;
		} else {
			console.error("audioContext is not defiened");
		}
	}

	_createClass(SoundBox, {
		start: {
			value: function start() {
				this._node1.start();
				this._node2.start();
				this._lfo.start();
			}
		},
		stop: {
			value: function stop() {
				this._node1.stop();
				this._node2.stop();
				this._node3.stop();
				this._lfo.stop();
			}
		},
		gain: {
			set: function (value) {
				this._controleGain.gain.value = value;
			}
		},
		frequency: {
			set: function (value) {
				this._node1.frequency.value = value;
				this._node2.frequency.value = value;
			},
			get: function () {
				return this._node1.frequency.value;
			}
		},
		baseFreq: {
			get: function () {
				return this._baseFrequency;
			}
		},
		node: {
			get: function () {
				return this._masterGain;
			}
		},
		connect: {
			value: function connect(node) {
				this._masterGain.connect(node);
			}
		}
	});

	return SoundBox;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Termin = (function (_SoundBox) {
  function Termin(ctx, targetElem) {
    var freq = arguments[2] === undefined ? 440 : arguments[2];
    var gain = arguments[3] === undefined ? 0.5 : arguments[3];
    var octabeDistance = arguments[4] === undefined ? 100 : arguments[4];

    _classCallCheck(this, Termin);

    this.noteGuideElement = $(targetElem);
    this.octabeDistance = octabeDistance;
    _get(Object.getPrototypeOf(Termin.prototype), "constructor", this).call(this, ctx, freq, gain);
    this.setGuide();
  }

  _inherits(Termin, _SoundBox);

  _createClass(Termin, {
    setNote: {
      value: function setNote(distance) {
        var step = distance / (this.octabeDistance / 12);
        var stepNum = Math.pow(2, step / 12);
        this.setCurrentNote(step);
        this.frequency = this.baseFreq * stepNum;
      }
    },
    setGuide: {
      value: function setGuide() {
        var ul = $("<ul>").addClass("note-guide");
        var li;
        var notes = {
          note_0: "C",
          note_4: "D",
          note_8: "E",
          note_10: "F",
          note_14: "G",
          note_18: "A",
          note_22: "B",
          note_24: "C",
          note_28: "D",
          note_32: "E",
          note_34: "F",
          note_38: "G",
          note_42: "A",
          note_46: "B",
          note_48: "C"
        };
        for (var i = 0; i < 49; i++) {
          li = $("<li class=\"noge-guide__indicator\"><div class=\"note-guide_notemark-wrapper\"><span class=\"note-guide__notemark\"></span></div></li>");
          var note_index = "note_" + i;
          if (notes[note_index]) li.append("<span class=\"note-guide__notename\">" + notes[note_index] + "</span>");
          ul.append(li);
        }
        this.noteGuideElement.append(ul);
      }
    },
    setCurrentNote: {
      value: function setCurrentNote(step) {
        var guideStep = Math.round(step * 2) + 18;
        var notemarks = $(this.noteGuideElement).find(".note-guide__notemark");
        for (var i = 0, l = notemarks.length; i < 49; i++) {
          if (i === guideStep) {
            $(notemarks[i]).css("opacity", 1);
          } else {
            $(notemarks[i]).css("opacity", 0);
          }
        }
      }
    },
    setGain: {
      value: function setGain(distance) {
        if (distance > 0.05) distance = 0.05;
        this.gain = distance;
      }
    }
  });

  return Termin;
})(SoundBox);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LeapController = (function () {
	function LeapController() {
		_classCallCheck(this, LeapController);

		this._rightHand = {};
		this._leftHand = {};
	}

	_createClass(LeapController, {
		startTracking: {
			value: function startTracking() {
				var _this = this;

				Leap.loop(function (frame) {
					var l = frame.hands.length;
					if (l > 2) l = 2;
					for (var i = 0; i < l; i++) {
						_this.setData(frame.hands[i]);
					}
				});
			}
		},
		setData: {
			value: function setData(data) {

				if (data.isRigth) {
					console.log(data);
					this._rightHand = data;
				} else if (data.isLeft) {
					this._leftHand = data;
				}
			}
		},
		leftHand: {
			get: function () {
				return this._leftHand;
			}
		},
		rightHand: {
			get: function () {
				return this._rightHand;
			}
		}
	});

	return LeapController;
})();
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var LoadObject = function LoadObject() {
	_classCallCheck(this, LoadObject);
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Main = (function () {
  function Main(element) {
    _classCallCheck(this, Main);

    this.UPDATE_LEFT = "update_left";
    this.UPDATE_RIGHT = "update_right";
    this.scale = 0.7;
    this.events = {};
    _.extend(this.events, Backbone.Events);
    this.init(element);
  }

  _createClass(Main, {
    init: {
      value: function init(element) {
        this.setScene(element);
        this.renderStart();
        this.setHands();
        this.setInstruments();
        this.listenHandMove();
      }
    },
    setScene: {
      value: function setScene(element) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        element.appendChild(this.renderer.domElement);

        this.camera.position.set(0, -100, 100);
        this.camera.lookAt({ x: 0, y: 80, z: 0 });

        var groundGeo = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        var groundMaterial = new THREE.MeshBasicMaterial({ color: 2236962, wireframe: true });
        var ground = new THREE.Mesh(groundGeo, groundMaterial);

        this.scene.add(ground);

        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
      }
    },
    setHands: {
      value: function setHands() {
        this.leftHand = new Hand(false);
        this.leftHand.position.set(-15, -5, 0);
        this.rightHand = new Hand();
        this.rightHand.position.set(15, -5, 0);
        this.scene.add(this.leftHand, this.rightHand);
      }
    },
    setInstruments: {
      value: function setInstruments() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.termin = new Termin(this.audioContext, document.getElementById("noteGuid"));
        this.distortion = new Distortion(this.audioContext);
        this.delay = new Delay(this.audioContext);
        this.termin.connect(this.distortion.input);
        this.distortion.connect(this.delay.input);
        this.delay.connect(this.audioContext.destination);
        //this.soundBox.connect(this.audioContext.destination);
        this.termin.gain = 0.005;
        this.termin.start();
      }
    },
    renderStart: {
      value: function renderStart() {
        var _this = this;

        setInterval(function () {
          _this.renderer.render(_this.scene, _this.camera);
        }, 60);
      }
    },
    listenHandMove: {
      value: function listenHandMove() {
        var _this = this;

        this.events.listenTo(this.events, this.UPDATE_LEFT, function (data) {
          _this.updateLeftHand(data);
        });
        this.events.listenTo(this.events, this.UPDATE_RIGHT, function (data) {
          _this.updateRightHand(data);
        });

        this.startLeap();
      }
    },
    startLeap: {
      value: function startLeap() {
        var _this = this;

        var hand;
        var data;
        Leap.loop(function (frame) {
          for (var i = 0, l = frame.hands.length; i < l; i++) {
            hand = frame.hands[i];
            data = {
              rotation: new THREE.Vector3(hand.pitch(), hand.roll() * -1, hand.yaw() * -1),
              position: new THREE.Vector3(hand.palmPosition[0] * _this.scale, hand.palmPosition[2] * _this.scale * -1, (hand.palmPosition[1] - 80) * _this.scale)
            };
            if (hand.type == "left") {
              _this.events.trigger(_this.UPDATE_LEFT, data);
            } else {
              _this.events.trigger(_this.UPDATE_RIGHT, data);
            }
          }
        });
      }
    },
    updateLeftHand: {
      value: function updateLeftHand(data) {
        this.updateHandPosition(this.leftHand, data);
        this.updateGain(data.position.z);
      }
    },
    updateRightHand: {
      value: function updateRightHand(data) {
        this.updateHandPosition(this.rightHand, data);
        this.updateFrequency(data.position.x);
      }
    },
    updateHandPosition: {
      value: function updateHandPosition(target, data) {
        target.position.copy(data.position);
        target.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
      }
    },
    updateFrequency: {
      value: function updateFrequency(input) {
        var distance = input * 2;
        this.termin.setNote(distance);
      }
    },
    updateGain: {
      value: function updateGain(input) {
        var distance = input - 15;
        if (distance < 0) distance = 0;
        this.termin.setGain(distance / 30);
      }
    }
  });

  return Main;
})();
//# sourceMappingURL=termin.js.map