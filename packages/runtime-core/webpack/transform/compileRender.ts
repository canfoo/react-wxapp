const generate = require('babel-generator').default
const { kebabCase, uniq } = require('lodash') 
const t = require('babel-types')
const template = require('babel-template')
const { buildBlockElement, findMethodName } = require('../../util')
const { IS_LEO_READY } = require('../../util/constants')
let usedEvents = new Set()

function stringifyAttributes (input) {
  const attributes = []

  for (const key of Object.keys(input)) {
    let value = input[key]

    if (value === false) {
      continue
    }

    if (Array.isArray(value)) {
      value = value.join(' ')
    }

    let attribute = key

    if (value !== true) {
      attribute += `="${String(value)}"`
    }

    attributes.push(attribute)
  }

  return attributes.length > 0 ? ' ' + attributes.join(' ') : ''

}

function createHTMLElement(options) {
  options = Object.assign(
    {
      name: 'div',
      attributes: {},
      value: ''
    },
    options
  )
  const name = options.name
  let ret = `<${options.name}${stringifyAttributes(options.attributes, name)}>`

  ret += `${options.value}</${options.name}>`
  return ret
}

function generateJSXAttr (ast) {
  const code = generate(ast).code
  return code.replace(/(this\.props\.)|(this\.state\.)/g, '')
    .replace(/(props\.)|(state\.)/g, '')
    .replace(/this\./g, '')
}

function parseJSXChildren(children) {
  return children
  .reduce((str, child) => {
    if (t.isJSXText(child)) {
      const strings = []
      child.value.split(/(\r?\n\s*)/).forEach((val) => {
        const value = val.replace(/\u00a0/g, '&nbsp;')
        if (!value) {
          return
        }
        if (value.startsWith('\n')) {
          return
        }
        strings.push(value)
      })
      return str + strings.join('')
    }
    if (t.isJSXElement(child)) {
      return str + parseJSXElement(child)
    }
    if (t.isJSXExpressionContainer(child)) {
      if (t.isJSXElement(child.expression)) {
        return str + parseJSXElement(child.expression)
      }
      return str + `{${generateJSXAttr(child)}}`
    }
    return str
  }, '')
}

function parseJSXElement(element) {
  const children = element.children
  const { attributes, name } = element.openingElement
  const componentName = name.name
  let attributesTrans = {}
  if (attributes.length) {
    attributesTrans = attributes.reduce((obj, attr) => {
      let name = attr.name.name
      let value = true
      let attrValue = attr.value
      if (typeof name === 'string') {
        if (t.isStringLiteral(attrValue)) {
          value = attrValue.value
        } else if (t.isJSXExpressionContainer(attrValue)) {
          let isBindEvent = name.startsWith('bind') && name !== 'bind'
          let code = generate(attrValue.expression, {
            quotes: 'single',
            concise: true
          }).code
            .replace(/"/g, "'")
            .replace(/(this\.props\.)|(this\.state\.)/g, '')
            .replace(/this\./g, '')
          value = isBindEvent ? code : `{{${code}}}`
        }
      }
      obj[name] = value
      return obj
    }, {})
  }
  let eLe = createHTMLElement({
    name: kebabCase(componentName),
    attributes: attributesTrans,
    value: parseJSXChildren(children)
  })
  return eLe
}

function setCustomEvent (renderPath) {
  const classPath = renderPath.findParent(p => p.isClassExpression() || p.isClassDeclaration())
  const eventPropName = '$$events'
  const body = classPath.node.body.body.find(b => t.isClassProperty(b) && b.key.name === eventPropName)
  const _usedEvents = Array.from(usedEvents).map(s => t.stringLiteral(s))
  if (body && t.isArrayExpression(body.value)) {
    body.value = t.arrayExpression(uniq(body.value.elements.concat(_usedEvents)))
  } else {
    let classProp = t.classProperty(t.identifier(eventPropName), t.arrayExpression(_usedEvents))
    classProp.static = true
    classPath.node.body.body.unshift(classProp)
  }
}

module.exports = function compileRender (renderPath) {
  let finalReturnElement = null
  let outputTemplate = null
  renderPath.traverse({
    JSXAttribute (path) {
      const node = path.node
      const value = path.node.value
      const attributeName = node.name.name
      if (attributeName === 'className') {
        path.node.name.name = 'class'
      }
      if (attributeName === 'onClick' && t.isJSXExpressionContainer(value)) {
        const methodName = findMethodName(path.node.value.expression)
        methodName && usedEvents.add(methodName)
        path.node.name.name = 'bindtap'
      }
    }
  })
  renderPath.traverse({
    JSXElement (path) {
      if (t.isReturnStatement(path.parent) && !finalReturnElement) {
        const block = buildBlockElement([
          t.jSXAttribute(
            t.jSXIdentifier('wx:if'),
            t.jSXExpressionContainer(t.jSXIdentifier(IS_LEO_READY))
          )
        ])
        finalReturnElement = block
        block.children.push(path.node)
        outputTemplate = parseJSXElement(block)
        path.replaceWith(block)
      }
    }
  })
  renderPath.traverse({
    BlockStatement (path) {
      path.node.body = []
      path.node.body.unshift(template('this.__state = arguments[0] || this.state || {};')())
    }
  })

  setCustomEvent(renderPath)

  return outputTemplate
}