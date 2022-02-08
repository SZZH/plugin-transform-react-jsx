let babel = require('@babel/core');
let types = require('@babel/types');
let traverse = require("@babel/traverse").default;
let generate = require("@babel/generator").default;
const code = `function ast() {}`;
const ast = babel.parse(code);
let indent = 0;
const padding = ()=>" ".repeat(indent);
traverse(ast, {
    enter(path){
        console.log(padding()+path.node.type+'进入');
        indent+=2;
        if(types.isFunctionDeclaration(path.node)){
            path.node.id.name = 'newAst';
        }
    },
    exit(path){
        indent-=2;
        console.log(padding()+path.node.type+'离开');
    }
});
const output = generate(ast,{},code);
console.log(output.code);