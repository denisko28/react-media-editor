import React from 'react'
import { ImageEditor } from '@denisko28/react-media-editor'
import ExampleImage from '../assets/img/ex11.png'
import Tools from '../../../src/painter/entities/Tools'

const Image = () => (
  <div className="page-wrapper editor">
    <div className="container">
      <ImageEditor
        imgSrc={ExampleImage}
        onSave={e => {
          console.log(e)
        }}
        height={400}
      >
        {({
          undo,
          clear,
          save,
          setActiveTool,
          setActiveColor,
          setBrushSize
        }) => (
          <div>
            <button type="button" onClick={() => setActiveTool(Tools.Line)}>
              Line
            </button>
            <button type="button" onClick={() => setActiveTool(Tools.Arrow)}>
              Arrow
            </button>
            <button type="button" onClick={() => setActiveTool(Tools.Elipse)}>
              Elipse
            </button>
            <button
              type="button"
              onClick={() => setActiveTool(Tools.Rectangle)}
            >
              Rectangle
            </button>
            <button type="button" onClick={() => setActiveTool(Tools.Text)}>
              Text
            </button>
            <button type="button" onClick={() => clear()}>
              Clear
            </button>
            <button type="button" onClick={() => undo()}>
              Undo
            </button>
            <button type="button" onClick={() => save()}>
              Save
            </button>
            <button type="button" onClick={() => setActiveColor('green')}>
              Set green brush
            </button>
            <button type="button" onClick={() => setBrushSize(30)}>
              Set brush size to 50
            </button>
          </div>
        )}
      </ImageEditor>
    </div>
  </div>
)

export default Image
