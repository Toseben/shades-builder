import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setBuy, setLoaded } from '../redux/actions'

import AFrame from '../components/AFrame'

const itemList = [
  'Shiny Shades',
  'Wooden Shades',
  'Golden Shades',
  'Flat Shades'
]

class App extends Component {

  redirect = (e, bool) => {
    let url = e.target.dataset.url;
    this.props.updateBuy(bool);
  }

  render() {

    // REDUCERS AND STATE FOR COMPONENTS
    let updateLoaded = this.props.updateLoaded;

    manager.onLoad = function () {
      updateLoaded();
      console.log('Textures loaded!');
    };

    const loadingVis = this.props.loaded ? 0 : 1;
    let loading_css = {
      opacity: loadingVis
    };

    if (this.props.buy) {
      return(
        <div>
          <div className="text-center">
            <div className="item-name">
              <span>Thanks for buying – </span>
              <span className="bold">{itemList[this.props.shades]}</span>
            </div>
          </div>
          <div className="ui buttons">
            <div className="text-center">
              <button className="btn btn-default" onClick={(e) => this.redirect(e, false)}>Return</button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>

          <div className="loading" style={loading_css}>
            <div className="sk-circle">
              <div className="sk-circle1 sk-child"></div>
              <div className="sk-circle2 sk-child"></div>
              <div className="sk-circle3 sk-child"></div>
              <div className="sk-circle4 sk-child"></div>
              <div className="sk-circle5 sk-child"></div>
              <div className="sk-circle6 sk-child"></div>
              <div className="sk-circle7 sk-child"></div>
              <div className="sk-circle8 sk-child"></div>
              <div className="sk-circle9 sk-child"></div>
              <div className="sk-circle10 sk-child"></div>
              <div className="sk-circle11 sk-child"></div>
              <div className="sk-circle12 sk-child"></div>
            </div>
          </div>

          <div className="ui buttons">
            <div className="text-center">
              <button className="btn btn-default" onClick={(e) => this.redirect(e, true)}>Buy</button>
            </div>
          </div>

          <div className="aframe-container">
            <AFrame />
          </div>
        </div>
      );
    }
  }
}

// PROP TYPES
App.propTypes = {
  updateBuy: PropTypes.func.isRequired,
  buy: PropTypes.bool.isRequired,
  updateLoaded: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  shades: PropTypes.number.isRequired
}

// CONNECT
const mapStateToProps = (state) => {
  return {
    buy: state.buy,
    loaded: state.loaded,
    shades: state.shades
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBuy: (bool) => dispatch(setBuy(bool)),
    updateLoaded: () => dispatch(setLoaded())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
