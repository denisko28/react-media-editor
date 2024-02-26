import React from 'react'
import CanvasPainter from '../painter/CanvasPainter'

class ImageEditor extends React.Component {
  canvasPainter = React.createRef()

  state = { canvasWidth: 0, canvasHeight: 0, ratio: null, media: null }

  componentDidMount() {
    const { imgSrc, height, width } = this.props;
    const img = new window.Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.onload = () => {
      var ratio = 1;
      if(width)
        ratio = img.width / width;
      else if(height)
        ratio = img.height / height;
      
      this.setState({ canvasWidth: img.width, canvasHeight: img.height, ratio: ratio, media: img })
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
    const { imgSrc, onSave, children } = this.props
    const { media } = this.state

    if (!media || !imgSrc) return null

    return media ? (
      <div style={{ width: '100%' }}>
        <CanvasPainter
          onSave={onSave}
          forceRedraw={this.renderImage}
          beforeRender={this.renderImage}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight}
          ratio={this.state.ratio}
          ref={ref => {
            this.canvasPainter = ref
            this.renderImage()
          }}
        >
          {children}
        </CanvasPainter>
      </div>
    ) : null
  }
}

export default ImageEditor
