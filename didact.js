// ============================================================
// Mission 1: createElement and render
// ============================================================

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(element, container) {
  // Create the DOM node: text node for TEXT_ELEMENT, otherwise a regular element
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  // Assign all props except "children" directly onto the DOM node
  Object.keys(element.props)
    .filter(key => key !== "children")
    .forEach(name => {
      dom[name] = element.props[name]
    })

  // Recursively render each child into the newly created node
  element.props.children.forEach(child => render(child, dom))

  // Finally, attach this node to the container
  container.appendChild(dom)
}

const Didact = { createElement, render }
