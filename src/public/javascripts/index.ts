interface Action {
  (elm: HTMLElement, part: string): void
}

function textToNode(text: string) {
  const template = document.createElement("template")
  template.innerHTML = text
  return template.content
}

const actions = {
  inner: function inner(elm: HTMLElement, part: string) {
    elm.innerHTML = part
  },
  appendChild: function appendChild(elm: HTMLElement, part: string) {
    elm.appendChild(textToNode(part))
  },
  prependChild: function prependChild(_elm: HTMLElement, _part: string): void {
    throw new Error('Unimplemented');
  },
  replace: function replace(elm: HTMLElement, part: string) {
    elm.parentElement?.replaceChild(textToNode(part), elm)
  }
}

type ActionNames = keyof typeof actions

async function partial(path: string, selector: string | [[string, ActionNames]], actionName: ActionNames = "inner", options: RequestInit = {}) {
  if (typeof actionName !== 'string') {
    options = actionName
    actionName = "inner"
  }

  let selectorActionPairs: [[string, ActionNames]]
  if (selector instanceof Array) {
    selectorActionPairs = selector
  } else {
    selectorActionPairs = [[selector, actionName]]
  }

  const res = await fetch(path, options)
  const { partials } = await res.json() as Record<string, Record<string, string>>
  for (const [selector, actionName] of selectorActionPairs) {
    const html = partials[selector]
    if (!html) {
      throw new Error(`${selector} is not found in a server response`)
    }

    const action: Action = partial.actions[actionName]
    if (!action) {
      throw new Error(`${actionName} is not found in partial actions`)
    }
    action(document.querySelector(selector) as HTMLElement, html)
  }
}

partial.actions = actions

async function partialForm(form: HTMLFormElement, selector: string | [[string, ActionNames]], actionName: ActionNames = "inner", options: RequestInit = {}) {
  return partial(form.action, selector, actionName, {
    method: 'post',
    body: new FormData(form),
    ...options
  })
}