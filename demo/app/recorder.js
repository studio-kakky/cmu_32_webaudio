class Recorder {
  constructor(ctx) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    this.ctx = ctx;
    this.bufferSize = 2048;
    this.soundContainer = [];
    this.recordedData = [];
    this._gainNode = this.ctx.createGain();

    this.scriptProccessr = this.ctx.createScriptProcessor(this.bufferSize, 1, 1);
  }

  startRecord(element) {
    this.soundContainer = [];
    navigator.getUserMedia(
      {audio:true},
      (stream)=> {
        var mediastreamsource = this.ctx.createMediaStreamSource(stream);
        mediastreamsource.connect(this.scriptProccessr);
        this.countDown(element,3);
        this.scriptProccessr.connect(this.ctx.destination);
      },
      function (e) {
        console.log(e);
      }
    );
  }

  countDown(element,number) {
    element.innerHTML = number;
    if(number === 0) {
      element.innerHTML = 'START!'
      this.scriptProccessr.onaudioprocess = (e)=>{
        this.onAudioProcess(e);
      }
      return;
    }
    number--;
    setTimeout(()=>{
      this.countDown(element,number);
    },1000)
  }

  stopRecord(element) {
    element.innerHTML = "";
    this.scriptProccessr.onaudioprocess = null;
    console.log(this.soundContainer.length);
  }

  onAudioProcess(e) {
    console.log(e);
    var input = e.inputBuffer.getChannelData(0);
    var bufferData = new Float32Array(this.bufferSize);
    for (var i = 0; i < this.bufferSize; i++) {
        bufferData[i] = input[i];
    }
    this.soundContainer.push(bufferData);
  }

  playRecordedVoice() {
    console.log(this.soundContainer);
    var buf = this.ctx.createBuffer(1, this.soundContainer.length * this.bufferSize, this.ctx.sampleRate);
    var channel = buf.getChannelData(0);

    for (var i = 0, il = this.soundContainer.length; i < il; i++) {
      for (var j = 0, jl = this.bufferSize; j < jl; j++) {
        channel[i * this.bufferSize + j] = this.soundContainer[i][j];
      }
    }
    var src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this._gainNode);
    src.start(0);
  }

  connect(node) {
    this._gainNode.connect(node);
  }

  get gain() {
    return this._gainNode.gain;
  }

  set gain(value) {
    this._gainNode.gain.value = value;
  }

}
