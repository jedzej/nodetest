import React, { Component } from 'react';


const event2pos = event => {
  if (event.touches)
    event = event.touches[0];
  return [
    event.pageX - event.target.offsetLeft,
    event.pageY - event.target.offsetTop
  ];
}


class SketchCanvas extends Component {
  constructor(props) {
    super(props);

    this.handlers = {
      'touchstart': this.startTracking.bind(this),
      'touchend': this.stopTracking.bind(this),
      'touchmove': this.onMove.bind(this),

      'mouseup': this.stopTracking.bind(this),
      'mousedown': this.startTracking.bind(this),
      'mousemove': this.onMove.bind(this)
    };

    this.state = {
      isTracking: false,
      sketchBuffer: []
    }
  }

  onMove(event) {
    const [x, y] = event2pos(event);
    const sketchBuffer = this.state.sketchBuffer
    var distance = Infinity;
    if (sketchBuffer.length > 0) {
      const [px, py] = sketchBuffer[sketchBuffer.length - 1];
      distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
    }
    if (distance > 5 || sketchBuffer.length === 0) {
      this.setState({
        sketchBuffer: [
          ...this.state.sketchBuffer,
          [x, y]
        ]
      })
    }
    event.preventDefault();
  }

  startTracking(event) {
    console.log('start', event)

    this.setState({
      isTracking: true,
      sketchBuffer: []
    });
    this.onMove(event);

    (['mousemove', 'touchmove'])
      .forEach(eventType => {
        this.canvas.addEventListener(eventType,
          this.handlers[eventType], false);
      }, this);
  }

  stopTracking() {
    const sketchBuffer = this.state.sketchBuffer;
    this.setState({ isTracking: false, sketchBuffer: [] });
    (['mousemove', 'touchmove'])
      .forEach(eventType => {
        this.canvas.removeEventListener(eventType,
          this.handlers[eventType], false);
      }, this);
    if (sketchBuffer.length > 0) {
      this.props.onSketch(sketchBuffer);
    }
  }

  componentDidMount() {
    this.setState({
      isTracking: false
    });
    (['mousedown', 'mouseup', 'touchstart', 'touchend'])
      .forEach(eventType => {
        this.canvas.addEventListener(eventType,
          this.handlers[eventType], false);
      }, this);
  }

  componentDidUpdate() {
    console.log('update')
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.props.paths.forEach(shape => {
      if (shape.path.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = shape.style;
        ctx.moveTo(shape.path[0][0], shape.path[0][1]);
        shape.path.slice(1).forEach(([x, y]) =>
          ctx.lineTo(x, y)
          , this);
        ctx.stroke();
        ctx.closePath();
      }
    }, this)

    const sketchBuffer = this.state.sketchBuffer;
    if (sketchBuffer.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#000000";
      ctx.moveTo(sketchBuffer[0][0], sketchBuffer[0][1]);
      sketchBuffer.slice(1).forEach(([x, y]) =>
        ctx.lineTo(x, y)
        , this);
      ctx.stroke();
      ctx.closePath();
    }
  }

  render() {
    return (
      <canvas height="400" width="300" style={{ backgroundColor: '#FFFFFF', border: 'black 1px dotted' }}
        ref={e => this.canvas = e} />
    );
  }
}

export default SketchCanvas;
