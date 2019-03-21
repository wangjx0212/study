
let patch = require('./patch')



function dfsWalk(oldNode, newNode, index, patches) {
    const currentIndex = index;
    const currentIndexPatches  = [];
    
    if(newNode === undefined){
        // 节点被移除
        currentIndexPatches.push({
            type:patch.NODE_DELETE,
        })
    }else if(typeof oldNode === 'string' && typeof newNode === 'string' ){
        // 文本节点被修改
      
        if(oldNode !== newNode){
          
            currentIndexPatches.push({
                type:patch.NODE_TEXT_MODIFY,
                value:newNode
            })
        }
     
    }else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key){
        var propsPatches  = diffProps(oldNode,newNode);
        if(propsPatches){
            propsPatches.forEach(v => {
                currentIndexPatches.push(v)
            })
        }
        diffChildren(oldNode.children, newNode.children, index, currentIndexPatches, patches);
    }else {
        currentIndexPatches.push({
            type: patch.NODE_REPLACE,
            value: newNode,
        })
    }
   
    if(currentIndexPatches.length > 0) {
       patches[currentIndex] = patches[currentIndex] ? [...patches[currentIndex],...currentIndexPatches] : currentIndexPatches;
    }
}

function diffChildren(oldChildren,newChildren,index,currentIndexPatches,patches){
    const currentIndex  = index;
    if(oldChildren.length < newChildren.length){
     
        // 有元素被添加
        let i = 0;
        for(; i < oldChildren.length; i++){
            if(typeof oldChildren[i] !== 'string' && typeof newChildren[i] !== 'string' ){
                currentIndex++;
            }
            dfsWalk(oldChildren[i],newChildren[i],index,patches)
        }
        for (; i < newChildren.length; i++) {
            currentIndexPatches.push({
                type: patch.NODE_ADD,
                value: newChildren[i]
            })
        }
    }else {
        // 对比新旧子元素的变化
      
        for(let i = 0; i< oldChildren.length; i++) {
            if(typeof oldChildren[i] !== 'string' && typeof newChildren[i] !== 'string' ){
                currentIndex++;
            }
            
            dfsWalk(oldChildren[i], newChildren[i], index, patches)
        }
    }    
}

function diffProps(oldNode,newNode){
    let oldProps = oldNode.props,
        newProps = newNode.props,
        count = 0,
        key,
        value,
        propsPatches = [];
    // 遍历旧的属性，找到被删除和修改的情况
    for(const propKey in oldProps){
        // 新属性不存在，旧属性存在，删除
        if(!newProps .hasOwnProperty(propKey)){
            count++
            propsPatches.push({
                type:patch.NODE_ATTRIBUTE_DELETE,
                key:propKey
            })
        } else if(newProps [propKey] !== oldProps[propKey]){  // 新旧属性不相等，修改
            count++
            propsPatches.push({
                type:patch.NODE_ATTRIBUTE_MODIFY,
                key:propKey,
                value:newProps [propKey]    
            })
        }
    }
    // 遍历新元素，找到添加的部分
    for(const propKey in newProps ){
        if(!oldProps.hasOwnProperty(propKey)){
            count++
            propsPatches.push({
                type:patch.NODE_ATTRIBUTE_ADD,
                key:propKey,
                value:newProps [propKey]
            })
        }
    }
    if(count === 0){
        return null;
    }

    return propsPatches;
}

function diff(oldTree,newTree){
    let index = 0,     
        patches = {} 
    dfsWalk(oldTree, newTree, index, patches)
    return patches
}

module.exports = diff