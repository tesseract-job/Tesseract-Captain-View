export default {
  listToMap: (list, keyName, valueName) => {
    const map = new Map()
    for (const item of list) {
      if (!keyName) {
        keyName = "key"
      }
      if (!valueName) {
        valueName = "value"
      }
      map.set(item[keyName], item[valueName])
    }
    return map
  },
  listToObjectMap: (list, keyName) => {
    const map = new Map()
    list.forEach((obj) => {
      map.set(obj[keyName], obj)
    })
    return map
  },
  listToTreeData(list) {
    let treeDataMap = new Map();
    let treeList = []
    for (let item of list) {
      let id = item.id
      let metaTitle = item.metaTitle
      let parentId = item.parentId;
      //如果为根结点
      if (parentId == 0) {
        let newVar = treeDataMap.get(id);
        //如果对象存在的情况下更新
        if (newVar) {
          newVar.id = id
          newVar.label = metaTitle
        } else {
          newVar = {id: id, label: metaTitle, children: []}
          treeDataMap.set(id, newVar)
        }
        continue
      }
      //如果是非根节点
      let parentValue = treeDataMap.get(parentId);
      if (!parentValue) {
        //如果父节点为空，初始化父节点
        parentValue = {id: parentId, label: null, children: []}
        treeDataMap.set(parentId, parentValue)
      }
      //保存当前节点,parentId 为选中父节点准备
      let currentValue = {id: id, label: metaTitle, isLeaf: true, parentId: parentId, children: []}
      treeDataMap.set(id, currentValue)
      //将当前节点加入到父节点
      parentValue.children.push(currentValue)
    }
    for (let treeData of treeDataMap) {
      if (!treeData[1].isLeaf) {
        treeList.push(treeData[1])
      }
    }
    debugger
    return {treeDataMap, treeList}
  },
  clearObject(obj) {
    for (let key in obj) {
      if (obj[key] instanceof Array) {
        obj[key].splice(0, obj[key].length)
      } else {
        obj[key] = null
      }
    }
  }
}


