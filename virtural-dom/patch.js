
  
function patch($dom, patches) {
    const index = 0
    dfsWalk($dom, index, patches);
}

patch.NODE_DELETE = 'NODE_DELETE'; // 节点被删除
patch.NODE_TEXT_MODIFY = 'NODE_TEXT_MODIFY'; // 文本节点被更改
patch.NODE_REPLACE = 'NODE_REPLACE'; // 节点被替代
patch.NODE_ADD = 'NODE_ADD'; // 添加节点
patch.NODE_ATTRIBUTE_MODIFY = 'NODE_ATTRIBUTE_MODIFY'; // 更新属性
patch.NODE_ATTRIBUTE_ADD = 'NODE_ATTRIBUTE_ADD'; // 添加属性
patch.NODE_ATTRIBUTE_DELETE = 'NODE_ATTRIBUTE_DELETE'; // 删除属性


// 根据不同类型的差异对当前节点进行 DOM 操作：
function dfsWalk1($node, index, patches, isEnd = false){
    
    if(patches[index]){

        patches[index].forEach( v => {
            
            switch(v.type){
                case patch.NODE_DELETE:
                    $node.remove();
                break;
                case patch.NODE_TEXT_MODIFY:
                    $node.textContent = v.value;
                break;
                case patch.NODE_REPLACE:
                    $node.replaceWith(v.value.render())
                break;                      
                case patch.NODE_ADD:
                    $node.appendChild(v.value.render())
                break;
                case patch.NODE_ATTRIBUTE_MODIFY:
                    $node.setAttribute(v.key, v.value);
                break;
                case patch.NODE_ATTRIBUTE_ADD:
                    $node.setAttribute(v.key, v.value);
                break;
                case patch.NODE_ATTRIBUTE_DELETE:
                    $node.removeAttribute(v.key,v.value)
                break;
                default:
                    // console.log(v)
            }
        })
    };
    if(isEnd){
        return;
    }

    for (let i = 0; i < $node.children.length; i++) {  
        index++;
        dfsWalk1($node.children[i], index, patches);
    }
    
}