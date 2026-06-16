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
// Mission 3: Render and Commit Phases & Reconciliation
// ============================================================

// --- 3.1 Commit Phase ---

let wipRoot = null      // the fiber tree being built right now
let currentRoot = null  // the fiber tree currently reflected in the DOM
let deletions = null    // fibers scheduled for removal from the DOM

// Replaces Mission 1's naive render: instead of touching the DOM immediately,
// we build a work-in-progress tree and let the Work Loop process it.
function render(element, container) {
  // Create the root fiber of the new work-in-progress tree.
  // 'alternate' links it to the current tree so the reconciler can diff them.
  wipRoot = {
    dom: container,
    props: { children: [element] },
    alternate: currentRoot,
  }
  deletions = []          // reset the deletion list for this render cycle
  nextUnitOfWork = wipRoot // wake up the Work Loop
}

// Called once the entire fiber tree has been processed (nextUnitOfWork is null).
// This is the only moment we touch the real DOM — atomically.
function commitRoot() {
  deletions.forEach(commitWork)  // remove obsolete nodes first
  commitWork(wipRoot.child)      // recursively apply PLACEMENT and UPDATE
  currentRoot = wipRoot          // the work-in-progress tree is now the current tree
  wipRoot = null
}

// Applies one fiber's effectTag to the real DOM, then recurses into children and siblings.
function commitWork(fiber) {
  if (!fiber) return

  // Function components don't own a DOM node, so walk up until we find one.
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // New node — insert it into the parent
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // Existing node — patch only what changed
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    // Obsolete node — remove it (may need to find the real DOM node deeper in)
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// Removes a fiber from the DOM. If the fiber has no DOM node (function component),
// keep descending until we reach one that does.
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

// --- 3.2 updateDom ---

const isEvent     = key => key.startsWith("on")
const isProperty  = key => key !== "children" && !isEvent(key)
const isNew       = (prev, next) => key => prev[key] !== next[key]
const isGone      = (prev, next) => key => !(key in next)

// Patches a real DOM node by diffing prevProps against nextProps.
function updateDom(dom, prevProps, nextProps) {
  // 1. Remove event listeners that changed or disappeared
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isGone(prevProps, nextProps)(key) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // 2. Remove regular props that no longer exist
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // 3. Set new or changed regular props
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // 4. Add new or changed event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

// --- 3.3 reconcileChildren ---

// Diffs the new elements against the previous fiber children and assigns effectTags,
// maximising DOM node reuse (UPDATE) and scheduling removals (DELETION).
function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType = oldFiber && element && element.type == oldFiber.type

    // Case 1: same type → recycle the existing DOM node (UPDATE)
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,       // reuse the real DOM node
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }

    // Case 2: new element with different (or no) old fiber → create from scratch (PLACEMENT)
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,               // DOM node will be created in updateHostComponent
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }

    // Case 3: old fiber exists but type changed → schedule its removal (DELETION)
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

// ============================================================
// Mission 2: Concurrent Mode and the Fiber Tree
// ============================================================

let nextUnitOfWork = null

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

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
  updateDom(dom, {}, fiber.props)
  return dom
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

  return undefined
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

// ============================================================
// Mission 4: Function Components and useState
// ============================================================

let wipFiber = null   // the function-component fiber currently being rendered
let hookIndex = null  // cursor into wipFiber.hooks[], advances with each useState call

// Function components don't produce a DOM node — their children come from
// calling the function. We set the global cursor before calling so that
// useState can find its slot without receiving an explicit ID.
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []                          // fresh array for this render
  const children = [fiber.type(fiber.props)]  // call the component function
  reconcileChildren(fiber, children)
}

// useState stores state inside the fiber's hooks array, indexed by call order.
// Updates are batched in a queue and applied at the start of the next render.
function useState(initial) {
  // Recover the hook from the previous render, if any
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]

  const hook = {
    state: oldHook ? oldHook.state : initial, // carry forward previous state
    queue: [],                                 // actions scheduled via setState
  }

  // Apply all batched actions to compute the new state value
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = typeof action === "function" ? action(hook.state) : action
  })

  // setState enqueues the action and schedules a re-render
  const setState = action => {
    hook.queue.push(action)
    // Point wipRoot at the current tree so the Work Loop restarts from there
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    deletions = []
    nextUnitOfWork = wipRoot
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

const Didact = { createElement, render, useState }
