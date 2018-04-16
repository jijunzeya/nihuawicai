class Draw {
  offx = 0;
  offy = 0;
  canvasWidth;
  canvasHeight;

  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    let dom = this.canvas.getBoundingClientRect();
    this.offx = this.canvas.offsetLeft;
    this.offy = this.canvas.offsetTop;
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    // this.offx = dom.left;
    // this.offy = dom.top;
    // this.canvasWidth = dom.width;
    // this.canvasHeight = dom.height;
    console.log('@@##offx offy :' + dom.left + ' ' + this.offx + ' ' + this.offy + ' ' + this.canvasWidth + ' ' + this.canvasHeight);
  }

  test () {
    console.log('@@@##test');
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(100, 100);
    this.context.lineTo(200, 100);
    this.context.lineTo(250, 110);
    // this.context.closePath();
  }

  drawLines (lines) {
    // this.context.closePath();
    // this.context.beginPath();
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let line of lines) {
      for (let point of line.points) {
        this.draw(point);
      }
    }
  }

  reflesh (points) {

  }

  draw (data) {
    if (data.type && this.context) {
      // console.log('@@##offx offy:' + this.offx + ' ' + this.offy);
      var x = data.x - this.offx;
      var y = data.y - this.offy;

      if (data.type === 'start') {
        console.log('@@##start line ' + JSON.stringify(data));
        if (data.line) {
          this.context.lineWidth = data.line.width;
          this.context.strokeStyle = data.line.color;
        } else {
          this.context.lineWidth = 2;
          this.context.strokeStyle = 'black';
        }

        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.stroke();
      } else if (data.type === 'move') {
        // console.log('@@##move line ' + JSON.stringify(data));
        this.context.lineTo(x, y);
        this.context.stroke();
      } else if (data.type === 'end') {
        this.context.stroke();
        this.context.closePath();

        // context.lineWidth = 10;
        // context.strokeStyle = "red";
        // context.stroke();
        console.log('@@s##end line ');
      } else if (data.type === 'clear') {
        console.log('@@##the canvas:' + this.canvasWidth + ' ' + this.canvasHeight);
        // context.closePath();
        // this.context.beginPath();
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        x = 0;
        y = 0;
      }
    }
  }
}

export default Draw;
