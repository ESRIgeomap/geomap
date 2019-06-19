//pensiveant：数据选择依赖

export default {
  /**
   * 获取树节点初始化选中状态
   */
  getInitCheckTreeNode() {
    const allTreeNodes = this.getAllTreeNodes();
    const checkTreeNodes = allTreeNodes.filter(node => {
      return node.visible === true;
    });
    return checkTreeNodes;
  },
  /**
   * 根据树节点key获取树节点对象
   * @param {*} key
   */
  getTreeObjByKey(key) {
    const treesArr = this.getAllTreeNodes();
    const treeObj = treesArr.find(obj => {
      return obj.key === key;
    });
    return treeObj;
  },
  /**
   * 获取所有树节点对象
   */
  getAllTreeNodes() {
    const trees = window.subjectMapConfig;
    const treesArr = [];
    trees.map(tree => {
      if (tree.children) {
        tree.children.map(son => {
          if (son.children) {
            son.children.map(s => {
              treesArr.push(s);
            });
          } else {
            treesArr.push(son);
          }
          treesArr.push(son);
        });
        treesArr.push(tree);
      } else {
        treesArr.push(tree);
      }
    });
    return treesArr;
  },
  /**
   * 获取所有子节点
   * @param {*} node
   * @param {*} arr
   */
  getAllChildrenNode(node, arr) {
    const nodes = arr || [];
    if (node.children) {
      node.children.map(son => {
        this.getAllChildrenNode(son, nodes);
      });
    } else {
      nodes.push(node);
    }

    return nodes;
  },
  /**
   * 根据树节点title获取key
   * @param {*} titles [title1,title2...]
   */
  getKeyByTitle(titles) {
    let ts = Array.isArray(titles) ? titles : [].concat(titles);
    const alltrees = this.getAllTreeNodes();
    const keys = [];
    ts.map(title => {
      const treeNode = alltrees.find(node => {
        return node.title === title;
      });
      keys.push(treeNode.key);
    });
    return keys.filter(Boolean);
  },
  /**根据标题获取树节点
   *
   * @param {*} title
   */
  getTreeNodeByTitle(title) {
    const trees = this.getAllTreeNodes();
    const node = trees.find(tree => {
      return tree.title === title;
    });
    return node;
  },
};
