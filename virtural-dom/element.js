

class CrtatElement{
    constructor(tagName,props,children){ 
        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }
    render(){
        let virtualDOM  = document.createElement(this.tagName);   // 根据tagName构建
        
        for(let propName in this.props){
            virtualDOM.setAttribute(propName,this.props[propName])  // 设置节点的DOM属性
        }

        this.children.forEach( el => {
                let childElement = (el instanceof  CrtatElement) ? el.render() : document.createTextNode(el);  // 如果子节点也是虚拟DOM，递归构建DOM节点，如果是字符串，则只构建文本节点
                virtualDOM.appendChild(childElement);
        } );
        return virtualDOM
    }
}

function element(tagName,props,children){
    return new CrtatElement(tagName,props,children)
}

module.exports = element