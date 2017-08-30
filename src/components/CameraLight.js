import React, { Component } from 'react'
import { Entity } from 'aframe-react'

import 'aframe-orbit-controls-component-2'

export default class CameraLight extends Component {
  render() {
    return (
      <Entity>
        <Entity id="camera" camera mouse-cursor position="0 0.8 0"
          orbit-controls="
            target: #target;
            enableDamping: true;
            enablePan: false;
            enableZoom: false;
            dampingFactor: 0.125;
            minPolarAngle: 0.6;
            maxPolarAngle: 1.6;
            rotateSpeed: 0.15;
            rotateToSpeed: 0.05;
            logPosition: false;
            ">
        </Entity>

        <Entity light="type: ambient; color: #FBFFFD; intensity: 0.6"></Entity>
        <Entity light="type: directional; color: #FFFFFB; intensity: 0.325" position="-0.25 0.75 1"></Entity>
        <Entity light="type: directional; color: #FFFFFB; intensity: 0.275" position="0.75 0.75 -0.5"></Entity>
      </Entity>
    )
  }
}
