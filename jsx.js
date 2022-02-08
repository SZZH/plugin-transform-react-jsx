const babel = require("@babel/core");
const pluginTransformReactJsx = require('./plugin-transform-react-jsx');
const sourceCode = `<h1 id="title" key="1" ref="title2"><p aa='3'><a className='ss'>123213</a></p></h1>`;
const result = babel.transform(sourceCode, {
    plugins: [[pluginTransformReactJsx,{runtime:'automatic'}]]
    // plugins: [['@babel/plugin-transform-react-jsx',{runtime:'automatic'}]]
});
console.log(result.code);