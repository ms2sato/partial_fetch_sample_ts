async function partial(path, selector, actionName = "inner", options = {}) {
  if (typeof actionName !== 'string') {
    options = actionName
    actionName = undefined
  }

  let selectorActionPairs
  if (selector instanceof Array) {
    selectorActionPairs = selector
  } else {
    selectorActionPairs = [[selector, actionName]]
  }

  const res = await fetch(path, options)
  const { partials } = await res.json()
  for ([selector, actionName] of selectorActionPairs) {
    const html = partials[selector]
    if (!html) {
      throw new Error(`${selector} is not found in a server response`)
    }

    actionName = actionName || 'inner'

    const action = partial.actions[actionName]
    if (!action) {
      throw new Error(`${actionName} is not found in partial actions`)
    }
    action(document.querySelector(selector), html)
  }
}

partial.actions = {
  inner: function inner(elm, part) {
    elm.innerHTML = part
  },
  appendChild: function appendChild(elm, part) {
    elm.appendChild(textToNode(part))
  },
  prependChild: function prependChild(elm, part) {
    elm.prependChild(textToNode(part))
  },
  replace: function replace(elm, part) {
    elm.parentNode.replaceChild(textToNode(part), elm)
  }
}

function textToNode(text) {
  const template = document.createElement("template")
  template.innerHTML = text
  return template.content
}

