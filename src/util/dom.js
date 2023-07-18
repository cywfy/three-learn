export const setElAttrs = (obj, attrs = {}) => {
  if (typeof obj !== 'object' && !Array.isArray(obj)) return
  if (typeof attrs !== 'object' && !Array.isArray(attrs)) return
  Object.entries(attrs).forEach(v => {
    obj[v[0]] = v[1]
  })
}

export const isExistEl = selector => {
  if (!selector) return false
  return !!document.getElementById(selector)
}

export const createElement = (el = 'div', selector, extraAttrs = {}) => {
  if (isExistEl(selector)) return
  const element = document.createElement(el);
  element.id = selector
  setElAttrs(element, extraAttrs)
  document.body.appendChild(element)
  return element
}