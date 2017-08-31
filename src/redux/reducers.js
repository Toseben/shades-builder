const initialState = {
  shades: 2,
  buy: false,
  loaded: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case 'SET_SAHDES':
      return Object.assign({}, state, {
        shades: action.id
      })

    case 'SET_BUY':
      return Object.assign({}, state, {
        buy: action.bool,
        loaded: false
      })

    case 'SET_LOADED':
      return Object.assign({}, state, {
        loaded: true
      })

    default:
      return state

  }
}
