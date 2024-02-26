import React from 'react'
import { ImageEditor } from 'react-media-editor'
import ExampleImage from '../assets/img/ex3.jpg'
import Tools from '../../../src/painter/entities/Tools'

const Image = () => (
  <div className="page-wrapper editor">
    <div className="container">
      <ImageEditor imgSrc={ExampleImage} onSave={(e) => {console.log(e)}} height={400}>
      {
        ({ undo, clear, save, setActiveTool, setActiveColor, setBrushSize }) => (
          <div>
            <button onClick={() => setActiveTool(Tools.Line)}>Line</button>
            <button onClick={() => setActiveTool(Tools.Arrow)}>Arrow</button>
            <button onClick={() => setActiveTool(Tools.Elipse)}>Elipse</button>
            <button onClick={() => setActiveTool(Tools.Rectangle)}>Rectangle</button>
            <button onClick={() => clear()}>Clear</button>
            <button onClick={() => undo()}>Undo</button>
            <button onClick={() => save()}>Save</button>
            <button onClick={() => setActiveColor("green")}>Set green brush</button>
            <button onClick={() => setBrushSize(30)}>Set brush size to 50</button>
          </div>
        )
      }
      </ImageEditor>
    </div>
  </div>
)

export default Image
