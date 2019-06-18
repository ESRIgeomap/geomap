//pensiveant:LayerList的子组件

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Button, message, Row, Col, Input, Tooltip, DatePicker } from 'antd';
import styles from './SystemLayer.less';

import {
  LAYERLIST_ADD_LAYERS,
  LAYERLIST_REMOVE_LAYERS,
  LAYERLIST_CHANGE_INDEX,
} from '../../../constants/action-types';
import common from '../../../utils/common';
import treeUtil from '../../../utils/layertreeutils';

const { TreeNode } = Tree;
const Search = Input.Search;
const dataList = [];
const SystemLayer = props => {
  const [gData, setGData] = useState(window.subjectMapConfig);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkAllNode, setCheckAllNode] = useState(false);
  const [allKeys, setallKeys] = useState([]);
  // 树节点移动
  const onDrop = info => {
    if (!info.node.props.checked) {
      message.warn('请调整可见图层顺序');
      return;
    }
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    props.dispatch({
      type: LAYERLIST_CHANGE_INDEX,
      payload: { dropKey, dragKey },
    });

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...window.subjectMapConfig];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        if (dragObj) item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        if (dragObj) item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        if (ar && dragObj) ar.splice(i, 0, dragObj);
      } else {
        if (ar && dragObj) ar.splice(i + 1, 0, dragObj);
      }
    }

    setGData(data);
  };

  //图层列表树形结构check处理回调
  const treeNodeCheckHandle = (checkedKeys, { checked, checkedNodes, node, event }) => {
    let checkedTreeNode = checkedKeys;
    const key = node.props.eventKey;
    if (checked) {
      checkedTreeNode.push(key);
    } else {
      checkedTreeNode = common.deleteArrItem(checkedTreeNode, key);
    }
    props.dispatch({
      type: 'layerList/setCheckedTreeNode',
      payload: checkedTreeNode,
    });
    //------------------------------
    const obj = treeUtil.getTreeObjByKey(key);
    const trees = treeUtil.getAllChildrenNode(obj);
    //const view = window.ags.view;
    const view = window.agsGlobal.view;
    if (checked) {
      //去重加载图层
      props.dispatch({
        type: LAYERLIST_ADD_LAYERS,
        payload: { view: view, addedlayers: trees },
      });
    } else {
      // 移除对应图层
      props.dispatch({
        type: LAYERLIST_REMOVE_LAYERS,
        payload: { view: view, removedLayers: trees },
      });
    }
  };

  /*图层相关功能：搜索、全选、展开、收起、重置、保存、收藏*/

  /*图层搜索*/
  const searchTextChange = e => {
    const value = e.target.value;
    generateList(gData);
    let expandedKeys = [];
    if (value == '') {
    } else {
      expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  // 获取上级key
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  // 获取树节点
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      const title = node.title;
      dataList.push({ key, title: title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  // 展开事件
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  /*全选*/
  const checkAll = () => {
    const alltrees = treeUtil.getAllTreeNodes();
    const view = window.agsGlobal.view;
    const allkeys = alltrees.map(tree => {
      return tree.key;
    });
    if (!checkAllNode) {
      setCheckAllNode(true);
      props.dispatch({
        type: 'layerList/setCheckedTreeNode',
        payload: allkeys,
      });
      props.dispatch({
        type: LAYERLIST_ADD_LAYERS,
        payload: { view, addedlayers: alltrees },
      });
    } else {
      setCheckAllNode(false);
      props.dispatch({
        type: 'layerList/setCheckedTreeNode',
        payload: [],
      });
      props.dispatch({
        type: LAYERLIST_REMOVE_LAYERS,
        payload: { removedLayers: alltrees, view },
      });
    }
  };
  // 获取树
  const getTree = () => {
    // 此树结构读取配置文件
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          allKeys.push(item.key);
          return (
            <TreeNode key={item.key} title={getTreeTitle(item.key, item.title)}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={getTreeTitle(item.key, item.title)} />;
      });
    return (
      <Tree
        checkable
        className="draggable-tree"
        draggable
        blockNode
        checkedKeys={props.layerList.checkedTreeNodes}
        onDrop={onDrop}
        onCheck={treeNodeCheckHandle}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {loop(gData)}
      </Tree>
    );
  };
  // 获取树标题
  const getTreeTitle = (key, title) => {
    const index = title.indexOf(searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + searchValue.length);
    const titl =
      index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{title}</span>
      );
    return <span>{titl}</span>;
  };

  //清除图层回调
  const clearLayer = () => {
    //清除所有图层
    props.dispatch({
      type: 'layerList/setCheckedTreeNode',
      payload: [],
    });
    window.agsGlobal.view.map.removeAll();
  };

  return (
    <div className={styles.wrap}>
      <Row className={styles.toolbar}>
        <Col span={13}>
          <Search placeholder="关键字、图层名称" onChange={searchTextChange} />
        </Col>
        <Col span={11}>
          <ul className={styles.actionbar}>
            <li>
              <Tooltip title={checkAllNode ? '全不选' : '全选'}>
                <Button
                  key="check-square"
                  className={styles.noeffect}
                  icon="check-square"
                  onClick={checkAll}
                />
              </Tooltip>
            </li>
            <li>
              <Tooltip title="展开所有图层">
                <Button
                  key="menu-fold"
                  className={styles.noeffect}
                  icon="menu-fold"
                  onClick={() => {
                    setExpandedKeys(allKeys);
                  }}
                />
              </Tooltip>
            </li>
            <li>
              <Tooltip title="折叠所有图层">
                <Button
                  key="menu-unfold"
                  className={styles.noeffect}
                  icon="menu-unfold"
                  onClick={() => {
                    setExpandedKeys([]);
                  }}
                />
              </Tooltip>
            </li>
            <li>
              <Tooltip title="清除图层">
                <Button key="undo" className={styles.noeffect} icon="delete" onClick={clearLayer} />
              </Tooltip>
            </li>
          </ul>
        </Col>
      </Row>

      <div className={styles.treediv}>{getTree()}</div>
    </div>
  );
};

SystemLayer.propTypes = {};
export default connect(({ layerList }) => {
  return { layerList };
})(SystemLayer);
