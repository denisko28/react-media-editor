import React from 'react'
import CanvasPainter from '../painter/CanvasPainter'

class ImageEditor extends React.Component {
  canvasPainter = React.createRef()

  state = { canvasWidth: 0, canvasHeight: 0, ratio: null, media: null }

  componentDidMount() {
    const { imgSrc, height, width } = this.props
    const img = new window.Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.onload = () => {
      let ratio = 1
      if (width) ratio = img.width / width
      else if (height) ratio = img.height / height

      this.setState({
        canvasWidth: img.width,
        canvasHeight: img.height,
        ratio,
        media: img
      })
    }
    img.src = imgSrc
  }

  renderImage = () => {
    if (!this.canvasPainter) return

    const { canvas, ctx } = this.canvasPainter || {}
    const { media, canvasWidth, canvasHeight } = this.state
    if (canvas && media) {
      ctx.drawImage(media, 0, 0, canvasWidth, canvasHeight)
    }
  }

  render() {
    const { imgSrc, onSave, style, loader, children } = this.props
    const { canvasWidth, canvasHeight, ratio, media } = this.state

    return media && imgSrc ? (
      <div>
        <CanvasPainter
          onSave={onSave}
          forceRedraw={this.renderImage}
          beforeRender={this.renderImage}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          ratio={ratio}
          style={style}
          loader={loader}
          ref={ref => {
            this.canvasPainter = ref
            this.renderImage()
          }}
        >
          {children}
        </CanvasPainter>
      </div>
    ) : (
      <>{loader}</>
    )
  }
}

export default ImageEditor
