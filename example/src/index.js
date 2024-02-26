import './assets/styles/main.css'
import React from 'react'
import { render } from 'react-dom'
import Image from './components/Image'

const rootNode = document.getElementById('app')

render(
  <>
    <Image />
  </>,
  rootNode
)
