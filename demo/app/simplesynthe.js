class SynmpleSynthe {
  constructor(ctx) {
    this.ctx = ctx;
    this._baseFreq = 440;
    this._gain = this.ctx.createGain();
    this._vcf = this.ctx.createBiquadFilter();
    this._vcf.connect(this._gain);
    this._gain.gain.value = 0.3;
  }

  startNote(freq) {
    var vco1 = this.ctx.createOscillator();
    var vco2 = this.ctx.createOscillator();
    var lfo = this.ctx.createOscillator();
    vco1.connect(this._vcf);
    vco2.connect(this._vcf);
    lfo.connect(vco1.frequency);
    lfo.connect(vco2.frequency);
    lfo.connect(this._vcf.detune);

    vco1.start();
    vco2.start();
    lfo.start();

    vco1.type="sawtooth";
    vco2.detune.value=-35;
    lfo.frequency.value=2;
    this._vcf.frequency.value=10000;
    vco1.frequency.value = vco2.frequency.value = freq;

    setTimeout(()=>{
      vco1.stop();
      vco2.stop();
      lfo.stop();
    },500);
  }

  set gain(value) {
    this._gain.gain.value = value;
  }

  connect(node) {
    this._gain.connect(node);
  }
}
