import React from 'react'
import CanvasController from './CanvasController'

class CanvasPainter extends React.Component {
  static defaultProps = {
    brushColor: '#f33',
    brushSize: 5,
    textSize: 18
  }

  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.textContainer = React.createRef()
    this.state = {
      canvasWidth: this.props.canvasWidth,
      canvasHeight: this.props.canvasHeight,
      ratio: this.props.ratio
    }
    this.controller = new CanvasController()
    this.setTextFocus = this.setTextFocus.bind(this)
  }

  componentDidMount() {
    if (this.canvas) {
      this.controller.init({
        canvas: this.canvas,
        ctx: this.ctx,
        canvasPainter: this,
        textInputRef: this.textInput,
        textContainerRef: this.textContainer,
        setTextFocus: this.setTextFocus,
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
      })
    }

    this.redraw()
  }

  setTextFocus() {
    setTimeout(() => this.textInput.current.focus(), 200)
  }

  redraw = () => {
    const { beforeRender, afterRender } = this.props
    if (beforeRender) beforeRender()
    this.controller.onRedraw()
    if (afterRender) afterRender()
  }

  handleSave = () => {
    const url = this.controller.onSave()
    this.props.onSave(url)
  }

  render() {
    const { style, children } = this.props
    const { canvasWidth, canvasHeight, ratio } = this.state
    const width = canvasWidth / ratio
    const height = canvasHeight / ratio
    if (!ratio || !canvasWidth || !canvasHeight) return <></>

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
              width,
              height,
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
          <div
            ref={this.textContainer}
            style={{
              display: 'none',
              position: 'fixed',
              zIndex: '1000'
            }}
          >
            <input
              ref={this.textInput}
              autoFocus
              style={{
                outline: 'none',
                border: 'none',
                background: 'transparent',
                lineHeight: 'normal',
                fontSize: 'inherit'
              }}
            />
          </div>
        </div>
        {children({
          undo: this.controller.onUndo,
          clear: this.controller.onClear,
          save: this.handleSave,
          setActiveTool: this.controller.onToolsChange,
          setActiveColor: this.controller.onColorChange,
          setBrushSize: this.controller.onBrushSizeChange
        })}
      </>
    )
  }
}

export default CanvasPainter
