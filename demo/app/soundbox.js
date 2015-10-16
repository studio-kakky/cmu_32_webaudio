class SoundBox {
  constructor(ctx) {
    this.ONLOAD_BUFFER = "ONLOAD_BUFFER";
    this.keybind = {};
    this.ctx = ctx;
    this.output = this.ctx.createGain();
    this.events = {};
    _.extend(this.events,Backbone.Events);
    this.events.listenTo(this.events, this.ONLOAD_BUFFER, (data)=>{
      this.mapPlayBtn(data);
    });
    $(window).keydown((e)=>{
      if(this.keybind[e.keyCode]){
        var source = this.ctx.createBufferSource();
        source.buffer = this.keybind[e.keyCode].buffer;
        source.connect(this.output);
        source.playbackRate.value = this.keybind[e.keyCode].speed;
        source.start(0);
      }
    });
  }

  loadSound(path, keymap, element, speed) {
    var xhr = new XMLHttpRequest();
    var url = path;

    xhr.onload = ()=> {
      if(xhr.status === 200) {
        var arrayBuffer = xhr.response;
        if(arrayBuffer instanceof ArrayBuffer) {
          this.events.trigger(this.ONLOAD_BUFFER,{
            buffer:arrayBuffer,
            keymap:keymap,
            element:element,
            speed:speed
          });
        }
      }
    }
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send(null);
  }

  mapPlayBtn(data) {
    this.ctx.decodeAudioData(data.buffer, (decodedData)=>{
      if(data.keymap) {
        this.addKeymap(data.keymap, decodedData, data.speed);
      }
      if(data.element) {
        this.createBtn(data.element,decodedData, data.speed);
      }
    });
  }

  createBtn(element,decodedData,speed) {
    _.extend(element,{
      decodedData:decodedData,
      speed:speed
    });
    var _this = this;
    element.addEventListener('click',function() {
      var source = _this.ctx.createBufferSource();
      source.buffer = this.decodedData;
      source.connect(_this.output);
      if(this.speed) {
        source.playbackRate.value = this.speed;
      }
      source.start(0);
    });
  }

  addKeymap(keynum,buffer,speed = 1) {
    console.log(speed);
    this.keybind[keynum] = {
      buffer:buffer,
      speed:speed
    };
  }

  connect(node) {
    this.output.connect(node);
  }
}
