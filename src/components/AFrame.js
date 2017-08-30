import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setShades } from '../redux/actions'

import AFRAME from 'aframe'
import { Scene, Entity } from 'aframe-react'

import CameraLight from './CameraLight'

import 'aframe-animation-component'
import 'aframe-mouse-cursor-component'

// COMPONENTS
import './Materials'
import './Interactions'

// LOAD POSTPROCESSING
THREE.EffectComposer = require('../lib/EffectComposer')
THREE.CopyShader = require('../lib/CopyShader');
THREE.RenderPass = require('../lib/RenderPass');
THREE.ShaderPass = require('../lib/ShaderPass');
THREE.LUTShader = require('../lib/LUTShader');
require('../effects-system');

// OUTPUT COLOR
// let color = new THREE.Color(0xFA9397)
// console.log(color.r.toFixed(2), color.g.toFixed(2), color.b.toFixed(2));

var updateShades, shades;
AFRAME.registerComponent('shades-selector', {
  schema: {
    listen: {default: ''},
    emit: {default: ''}
  },

  update: function () {
    var data = this.data;
    this.el.addEventListener(data.listen, function () {

      var direction = data.emit === "shader-left" ? -1 : 1;
      var number = shades + direction;

      if (number < 0) { number = 3 }
      number = number % 4;

      updateShades(number);
    });
  }
});

class AFrame extends Component {

  render() {
    // REDUCERS AND STATE FOR COMPONENTS
    updateShades = this.props.updateShades;
    shades = this.props.shades;

    return (
      <Scene vr-mode-ui="enabled: false">
        <a-assets>
          <a-asset-item id="shades-obj" src="./geo/shades.obj"></a-asset-item>
          <a-asset-item id="glasses-obj" src="./geo/glasses.obj"></a-asset-item>
          <a-asset-item id="box-obj" src="./geo/box.obj"></a-asset-item>
          <a-asset-item id="dwarf-obj" src="./geo/dwarf.obj"></a-asset-item>
          <a-asset-item id="shadow-obj" src="./geo/shadow.obj"></a-asset-item>

          <a-mixin id="arrow-hover"
            animation__scale-up="property: scale; dur: 250; to: 1.5 1.5 1.5; startEvents: scale-up"
            animation__scale-down="property: scale; dur: 250; to: 1 1 1; startEvents: scale-down">
          </a-mixin>
        </a-assets>

        <Entity id="target" position="0 0.75 -2"></Entity>
        <Entity position="0 0 -2" id="geo_GRP">
          <Entity id="shades" material obj-model="obj: #shades-obj" shades-material={{mtlIdx: shades}}></Entity>
          <Entity id="glasses" material obj-model="obj: #glasses-obj" glasses-material={{mtlIdx: shades}}></Entity>
          <Entity id="box" material obj-model="obj: #box-obj" env-material scale="1.5 1.5 1.5" position="0 -0.01 0"></Entity>
          <Entity id="character" material obj-model="obj: #dwarf-obj" dwarf-material></Entity>
          <Entity id="shadow" material obj-model="obj: #shadow-obj" shadow-material position="0 0.005 0"></Entity>

          <Entity follow-camera position="0 0 0.125" id="control_GRP">
            <Entity geometry={{primitive: 'circle', radius: 0.15}} selector-hover
              position="0.6 1.3 0" mixin="arrow-hover" arrow-material="invert: true"
              shades-selector="listen: click; emit: shader-right">
            </Entity>
            <Entity geometry={{primitive: 'circle', radius: 0.15}} selector-hover
              position="-0.6 1.3 0" mixin="arrow-hover" arrow-material="invert: false"
              shades-selector="listen: click; emit: shader-left">
            </Entity>
          </Entity>
        </Entity>

        <CameraLight/>
      </Scene>
    )
  }
}

// PROP TYPES
AFrame.propTypes = {
  updateShades: PropTypes.func.isRequired,
  shades: PropTypes.number.isRequired
}

// CONNECT
const mapStateToProps = (state) => {
  return {
    shades: state.shades
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateShades: (id) => dispatch(setShades(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AFrame)
