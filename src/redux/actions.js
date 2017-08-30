export function setShades(id) {
  return { type: 'SET_SAHDES',
    id: id
  }
}

export function setBuy(bool) {
  return { type: 'SET_BUY',
  bool: bool
 }
}

export function setLoaded() {
  return { type: 'SET_LOADED'}
}
