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

// ============================================================
// Mission 2: Concurrent Mode and the Fiber Tree
// ============================================================

let nextUnitOfWork = null

// Breaks rendering into small chunks using idle time,
// yielding to the browser whenever the deadline runs out.
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

// Creates the actual DOM node for a fiber (no children yet).
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
  updateDom(dom, {}, fiber.props)
  return dom
}

// Processes one fiber and returns the next unit of work.
// Traversal order: child → sibling → parent's sibling (uncle).
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 1. Go deeper if there is a child
  if (fiber.child) {
    return fiber.child
  }

  // 2. No child — try sibling, then walk up looking for an uncle
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

  // 3. Reached the root with no more work
  return undefined
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

// ============================================================
// Placeholders for Missions 3 & 4 (needed by workLoop / createDom)
// ============================================================

let wipRoot = null
let currentRoot = null
let deletions = null

function render(element, container) {
  wipRoot = {
    dom: container,
    props: { children: [element] },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

function commitRoot() { /* implemented in Mission 3 */ }
function updateDom() { /* implemented in Mission 3 */ }
function reconcileChildren() { /* implemented in Mission 3 */ }
function updateFunctionComponent() { /* implemented in Mission 4 */ }

const Didact = { createElement, render }
