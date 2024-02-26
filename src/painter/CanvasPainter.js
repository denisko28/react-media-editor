import React from 'react'
import CanvasController from './CanvasController'

class CanvasPainter extends React.Component {
  static defaultProps = {
    brushColor: '#f33',
    brushSize: 10,
    textSize: 18
  }

  constructor(props) {
    super(props)
    this.state = { canvasWidth: this.props.canvasWidth, canvasHeight: this.props.canvasHeight, ratio: this.props.ratio }
    this.controller = new CanvasController()
  }

  componentDidMount() {
    if(this.canvas) {
      this.controller.init({
        canvas: this.canvas,
        ctx: this.ctx,
        canvasPainter: this,
        ...this.props
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.canvasWidth !== this.props.canvasWidth) {
      this.setState({
        canvasWidth: this.props.canvasWidth,
        canvasHeight: this.props.canvasHeight,
        ratio: this.props.ratio
      });
    }
  }

  redraw = () => {
    const { beforeRender, afterRender } = this.props
    if (beforeRender) beforeRender()
    this.controller.onRedraw()
    if (afterRender) afterRender()
  }

  handleSave = () => {
    const url = this.controller.onSave();
    this.props.onSave(url);
  }

  render() {
    const { style, children} = this.props;
    const { canvasWidth, canvasHeight, ratio } = this.state;
    const width = canvasWidth / ratio;
    const height = canvasHeight / ratio;
    if(!ratio || !canvasWidth || !canvasHeight)
      return <></>;

    return (
      <>
        <div className="canvas-painter">
          <canvas
            ref={canvas => {
              if (canvas) {
                this.canvas = canvas
                this.ctx = canvas.getContext('2d')
              }
            }}
            style={{
              background: '#000',
              display: 'block',
              touchAction: 'none',
              width: width,
              height: height,
              ...style
            }}
            width={canvasWidth}
            height={canvasHeight}
            onClick={() => false}
            onMouseDown={this.controller.onMouseDown}
            onMouseUp={this.controller.onMouseUp}
            onMouseMove={this.controller.onMouseMove}
            onMouseOut={() => {
              this.controller.isMouseDown = false
            }}
            onTouchStart={this.controller.onMouseDown}
            onTouchMove={this.controller.onMouseMove}
            onTouchEnd={this.controller.onMouseUp}
            onTouchCancel={() => {
              this.controller.isMouseDown = false
            }}
          />
        </div>
        {
          children({
            undo: this.controller.onUndo,
            clear: this.controller.onClear,
            save: this.handleSave,
            setActiveTool: this.controller.onToolsChange,
            setActiveColor: this.controller.onColorChange,
            setBrushSize: this.controller.onBrushSizeChange
          })
        }
      </>
    )
  }
}

export default CanvasPainter
