const types = require("@babel/types");
const pluginSyntaxJsx = require("@babel/plugin-syntax-jsx").default;
const pluginTransformReactJsx = {
  inherits: pluginSyntaxJsx,
  visitor: {
    JSXElement(path) {
      let callExpression = buildJSXElementCall(path);
      path.replaceWith(callExpression);
    },
  },
};

function buildJSXElementCall(path) {
  const args = [];
  const openingElementPath = path.get("openingElement");
  const { name } = openingElementPath.node.name;
  const tag = types.stringLiteral(name);
  args.push(tag);
  const attributes = [];

  // attributes
  for (const attribute of openingElementPath.get("attributes")) {
    attributes.push(attribute.node);
  }

  //children
  const children = buildChildren(path.get("children"));

  const props = attributes.map(convertAttribute);
  props.push(buildChildrenProperty(children))
  const attributesObject = types.objectExpression(props);
  args.push(attributesObject);

  return call(path, "jsx", args);
}

function convertAttribute(node) {
  const value = node.value;
  node.name.type = "Identifier";
  return types.objectProperty(node.name, value);
}

function buildChildren(jsxChildren) {
  const elements = [];
  for (const i in jsxChildren) {
    if (!Object.prototype.hasOwnProperty.call(jsxChildren, i)) continue;
    const node = jsxChildren[i].node
    if (types.isJSXText(node)) {
      const element = types.stringLiteral(node.value)
      elements.push(element);
    } else {
      elements.push(buildJSXElementCall(jsxChildren[i]))
    }
  }
  return elements;
}

function buildChildrenProperty(children) {
  let childrenNode;
  if (children.length > 0) {
    childrenNode = types.arrayExpression(children);
  } else {
    return undefined;
  }
  const a = types.objectProperty(types.identifier("children"), childrenNode)
  return types.objectProperty(types.identifier("children"), childrenNode);
}

function call(path, name, args) {
  const callee = types.identifier("_jsx");
  const node = types.callExpression(callee, args);
  return node;
}
module.exports = pluginTransformReactJsx;
