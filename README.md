# React Media Editor

#### React components library to edit Images and Video using canvas.

[![npm version](https://badge.fury.io/js/react-media-editor.svg)](https://badge.fury.io/js/react-media-editor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/morzhanov/react-media-editor/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img src="https://ibb.co/Jy50yNn" alt="logo" />

## Description

Use this library to add image/video editor to you React application.

This library contains drawing tools which you can use to draw graphical shapes on your image sources. Package contains ImageEditor component.

## Installation


NPM package:
```
yarn i react-media-editor
```

Also you can modify project files directly, project built using <a href="https://rollupjs.org/guide/en">RollupJS</a> module bundler.

#### Example

To run example: 

* go to /example folder
* yarn i
* yarn start
* open <a href="localhost:3000">localhost:3000</a>

## Usage

Example using ImageEditor:

```
import React from 'react'
import Loader from "../LocalLoader/Loader";
import { ImageEditor } from '@denisko28/react-media-editor'
import Tools from '@denisko28/react-media-editor/src/painter/entities/Tools'

const Image = () => (
  <div className="page-wrapper editor">
    <div className="container">
      <ImageEditor 
        imgSrc={ExampleImage} 
        onSave={(e) => {console.log(e)}} 
        height={400}
        loader={<Loader/>}
      >
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
```

Result: [Imgur](https://ibb.co/Jy50yNn)

## Main Technologies and libraries

- <a href="https://reactjs.org/">React</a>
- <a href="https://casesandberg.github.io/react-color/">react-color</a>
- <a href="https://rollupjs.org">Rollup.JS</a>
- <a href="https://webpack.js.org/">Webpack 4</a>
- <a href="https://eslint.org/">ESLint</a>
- <a href="https://github.com/prettier/prettier">Prettier</a>
- <a href="https://babeljs.io/">Babel</a>

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Original Author

Vlad Morzhanov

## Extension Author

Denys Kharitesku

## License

#### (The MIT License)

Copyright (c) 2018 Vlad Morzhanov.
You can review license in the LICENSE file.
