import { includes } from 'lodash'
import Text from './entities/Text'
import Tools from './entities/Tools'
import Shape from './entities/Shape'
import Path from './entities/Path'

class CanvasController {
  init = data => {
    this.canvasPainter = data.canvasPainter
    this.canvas = data.canvas
    this.ctx = data.ctx
    this.textInputRef = data.textInputRef
    this.textContainerRef = data.textContainerRef
    this.setTextFocus = data.setTextFocus
    this.brushColor = data.brushColor
    this.brushSize = data.brushSize * data.ratio
    this.textSize = data.canvasWidth > 500 ? data.textSize : 70
    this.width = data.canvasWidth
    this.height = data.canvasHeight
    this.forceRedraw = data.forceRedraw
    this.ratio = data.ratio

    this.tool = Tools.Rectangle
    this.isMouseDown = false
    this.hasInput = false
    this.textPosition = {}
    this.startDrawIdx = []
    this.pathsArray = []
    this.shapesArray = []
    this.textsArray = []
    this.history = []
  }

  onRedraw = () => {
    this.pathsArray.forEach(path =>
      path.data.forEach(item => this.drawPath(item))
    )
    this.shapesArray.forEach(shape => this.drawShape(shape))
    this.textsArray.forEach(text => this.drawText(text))

    if (this.isMouseDown && this.tool === Tools.Shape) {
      this.drawCurrentShape()
    }
  }

  // Mouse listeners

  onMouseUp = e => {
    this.isMouseDown = false
    const shapes = [Tools.Line, Tools.Arrow, Tools.Elipse, Tools.Rectangle]

    if (includes(shapes, this.tool)) {
      const { x, y } = this.getMousePos(e)
      const shape = new Shape(
        this.shapeStart.x,
        this.shapeStart.y,
        x,
        y,
        this.brushColor,
        this.tool
      )
      this.shapesArray.push(shape)
      this.history.push(Tools.Shape)
    }
  }

  onMouseDown = e => {
    if (this.tool === Tools.Pencil) {
      this.drawPathStart(e)
      return
    }
    if (this.tool === Tools.Text && !this.hasInput) {
      this.textPosition = this.getMousePos(e, true)
      this.addTextInput(this.textPosition)
      return
    }
    this.drawShapeStart(e)
  }

  onMouseMove = e => {
    if (!this.ctx || !this.isMouseDown) return

    if (this.tool === Tools.Pencil) {
      this.drawPaths(e)
      return
    }
    this.drawCurrentShape(e)
  }

  /* eslint-disable */
  getMousePos = (e, forText = false) => {
    const rect = this.canvas.getBoundingClientRect()
    let clientX = e.clientX
    let clientY = e.clientY
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    }

    if(forText)
      return {
        x: clientX,
        y: clientY
      }

    return {
      x: (clientX - rect.left) * this.ratio,
      y: (clientY - rect.top) * this.ratio
    }
  }
  /* eslint-enable */

  // Draw text methods

  addTextInput = ({ x, y }) => {
    const inputContainer = this.textContainerRef.current
    const input = this.textInputRef.current
    input.style.borderBottom = `2px solid ${this.brushColor}`
    input.style.color = this.brushColor
    input.onblur = this.handleTextEnter
    inputContainer.style.display = 'block'
    inputContainer.style.fontSize = `${Number(this.textSize)}px`
    inputContainer.style.left = `${x}px`
    inputContainer.style.top = `${y - this.textSize}px`
    this.setTextFocus()
    this.hasInput = true
  }

  cancelText = () => {
    this.textContainerRef.current.style.display = 'none'
    this.textInputRef.current.value = ''
    this.hasInput = false
  }

  handleTextEnter = () => {
    const { x, y } = this.textPosition
    const rect = this.canvas.getBoundingClientRect()
    const text = new Text(
      (x - rect.left) * this.ratio,
      (y - rect.top + this.textSize * 0.5) * this.ratio,
      this.textInputRef.current.value,
      this.brushColor,
      this.textSize * this.ratio
    )

    this.textContainerRef.current.style.display = 'none'
    this.textInputRef.current.value = ''
    this.hasInput = false
    this.textsArray.push(text)
    this.history.push(Tools.Text)
    this.drawText(text)
  }

  drawText = content => {
    const { ctx } = this
    const { x, y, text, color, textSize } = content

    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.font = `${textSize}px Arial`
    ctx.fillText(text, x, y - textSize - 4)
  }

  // Draw path methods

  drawPathStart = e => {
    this.isMouseDown = true
    this.startDrawIdx.push(this.pathsArray.length)

    const { x, y } = this.getMousePos(e)
    this.x = x
    this.y = y
    this.drawPaths(e, true)
  }

  drawPaths = (e, isNew) => {
    const { x, y } = this.getMousePos(e)
    const newX = x + 1
    const newY = y + 1
    const path = {
      color: this.brushColor,
      size: this.brushSize,
      startX: this.x,
      startY: this.y,
      endX: newX,
      endY: newY
    }

    this.drawPath(path)
    if (isNew) {
      const newData = [path]
      this.pathsArray.push(new Path(newData))
      this.history.push(Tools.Pencil)
    }
    this.pathsArray[this.pathsArray.length - 1].data.push(path)
    this.x = newX
    this.y = newY
  }

  drawPath = path => {
    this.ctx.strokeStyle = path.color
    this.ctx.lineWidth = path.size
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    this.ctx.moveTo(path.startX, path.startY)
    this.ctx.lineTo(path.endX, path.endY)
    this.ctx.stroke()
  }

  // Draw shape methods

  drawShapeStart = e => {
    this.isMouseDown = true
    this.shapeStart = this.getMousePos(e)
  }

  drawCurrentShape = e => {
    if (e) {
      const { x, y } = this.getMousePos(e)
      const shape = new Shape(
        this.shapeStart.x,
        this.shapeStart.y,
        x,
        y,
        this.brushColor,
        this.tool
      )
      this.currentShape = shape
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.forceRedraw()
      this.canvasPainter.redraw()
      this.drawShape(shape)
    } else if (this.currentShape) {
      this.drawShape(this.currentShape)
    }
  }

  drawShape = shape => {
    const { ctx } = this
    const { x1, y1, x2, y2, color, type } = shape

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = this.brushSize
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    switch (type) {
      case Tools.Arrow:
      case Tools.Line:
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        break
      case Tools.Elipse:
        this.drawElipse(shape)
        break
      case Tools.Rectangle:
        ctx.rect(x1, y1, x2 - x1, y2 - y1)
        break
      default:
    }

    ctx.stroke()
    if (type === Tools.Arrow) this.drawArrowTip(shape)
  }

  drawArrowTip = line => {
    const { ctx } = this
    const { x1, y1, x2, y2 } = line
    const tipLength = 10
    const angle = Math.atan2(y2 - y1, x2 - x1)

    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(
      x2 - tipLength * Math.cos(angle - Math.PI / 6),
      y2 - tipLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.moveTo(x2, y2)
    ctx.lineTo(
      x2 - tipLength * Math.cos(angle + Math.PI / 6),
      y2 - tipLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.stroke()
  }

  drawElipse = ({ x1, y1, x2, y2 }) => {
    const { ctx } = this
    const radiusX = (x2 - x1) * 0.5
    const radiusY = (y2 - y1) * 0.5
    const centerX = x1 + radiusX
    const centerY = y1 + radiusY
    const step = 0.01
    let i = step
    const pi2 = Math.PI * 2 - step
    ctx.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0))
    for (; i < pi2; i += step) {
      ctx.lineTo(
        centerX + radiusX * Math.cos(i),
        centerY + radiusY * Math.sin(i)
      )
    }
  }

  // Tools and controls methods

  onUndo = () => {
    switch (this.history.pop()) {
      case Tools.Text:
        this.textsArray.pop()
        break
      case Tools.Pencil:
        this.pathsArray.pop()
        break
      case Tools.Shape:
        this.shapesArray.pop()
        break
      default:
    }
    this.canvasPainter.redraw()
  }

  onClear = () => {
    this.pathsArray = []
    this.shapesArray = []
    this.textsArray = []
    this.forceRedraw()
    this.canvasPainter.redraw()
  }

  onSave = () => this.canvas.toDataURL('image/png')

  onToolsChange = id => {
    this.tool = id
    this.canvasPainter.redraw()
  }

  onColorChange = color => {
    this.brushColor = color
    this.canvasPainter.redraw()
  }

  onBrushSizeChange = size => {
    this.brushSize = size
    this.canvasPainter.redraw()
  }
}

export default CanvasController
