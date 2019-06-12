//pensiveant:LayerList的子组件

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tree, Button, message, Row, Col, Input, Tooltip, DatePicker } from 'antd';
import styles from './SystemLayer.less';
//import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';

import {
  LAYERLIST_ADD_LAYERS,
  LAYERLIST_REMOVE_LAYERS,
  SUBJECTLAYERLIST_SAVE,
  LAYERLIST_CHANGE_INDEX,
  LAYERLIST_RELOAD_WEATHER_LAYERS,
} from '../../constants/action-types';
import common from '../../utils/common';
import treeUtil from '../../utils/layertreeutils';

const { TreeNode } = Tree;
const Search = Input.Search;
const dataList = [];
class SystemLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gData: window.subjectMapConfig,
      title: '',
      snippet: '',
      modalvisible: false,
      searchvisible: true,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      checkAll: false,
      allKeys: [],
      datapickervisible: false,
    };
  }
  componentDidMount = () => {};
  onDragEnter = info => {};
  onDrop = info => {
    console.log(info);
    if (!info.node.props.checked) {
      message.warn('请调整可见图层顺序');
      return;
    }
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    this.props.dispatch({
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

    this.setState({
      gData: data,
    });
  };
  
  treeNodeCheckHandle = (checkedKeys, { checked, checkedNodes, node, event }) => {
    let checkedTreeNode = checkedKeys;
    const key = node.props.eventKey;
    if (checked) {
      checkedTreeNode.push(key);
    } else {
      checkedTreeNode = common.deleteArrItem(checkedTreeNode, key);
    }
    this.props.dispatch({
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
      this.props.dispatch({
        type: LAYERLIST_ADD_LAYERS,
        payload: { view: view, addedlayers: trees },
      });
    } else {
      // 移除对应图层
      this.props.dispatch({
        type: LAYERLIST_REMOVE_LAYERS,
        payload: { view: view, removedLayers: trees },
      });
    }
  };

  titleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };
  snippetChange = e => {
    this.setState({
      snippet: e.target.value,
    });
  };

  /*图层相关功能：搜索、全选、展开、收起、重置、保存、收藏*/

  /*图层收藏*/
  showCollectPanel = e => {
    this.setState({
      modalvisible: true,
    });
  };
  saveToCollection = () => {
    const subjectInfo = {
      title: this.state.title,
      snippet: this.state.snippet,
    };
    this.props.dispatch({
      type: SUBJECTLAYERLIST_SAVE,
      payload: subjectInfo,
    });
    this.props.dispatch({
      type: 'layerList/changeWebmapTopload',
      payload: true,
    });
  };
  handleOk = e => {
    if (this.state.title === '') {
      message.warn('标题不能为空');
      return;
    }
    this.saveToCollection();
    this.setState({
      title: '',
      snippet: '',
      modalvisible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      title: '',
      snippet: '',
      modalvisible: false,
    });
  };

  /*图层搜索*/
  searchTextChange = e => {
    const value = e.target.value;
    this.generateList(this.state.gData);
    let expandedKeys = [];
    if (value == '') {
    } else {
      expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.state.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      const title = node.title;
      dataList.push({ key, title: title });
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  /*全选*/
  checkAll = () => {
    const alltrees = treeUtil.getAllTreeNodes();
    const allkeys = alltrees.map(tree => {
      return tree.key;
    });
    if (!this.state.checkAll) {
      this.setState({
        checkAll: true,
      });
      this.props.dispatch({
        type: 'layerList/setCheckedTreeNode',
        payload: allkeys,
      });
      this.props.dispatch({
        type: LAYERLIST_ADD_LAYERS,
        payload: alltrees,
      });
    } else {
      this.setState({
        checkAll: false,
      });
      this.props.dispatch({
        type: 'layerList/setCheckedTreeNode',
        payload: [],
      });
      this.props.dispatch({
        type: LAYERLIST_REMOVE_LAYERS,
        payload: alltrees,
      });
    }
  };

  /*展开*/
  expandAll = () => {
    this.setState({
      expandedKeys: this.state.allKeys,
    });
  };

  /*折叠*/
  collapseAll = () => {
    this.setState({
      expandedKeys: [],
    });
  };

  /*重置*/
  resetTree = () => {
    const initTreeNodes = this.props.layerList.initCheckTreeNodes;
    this.props.dispatch({
      type: 'layerList/setCheckedTreeNode',
      payload: initTreeNodes,
    });
    const allTrees = treeUtil.getAllTreeNodes();
    const initTrees = initTreeNodes.map(key => {
      return treeUtil.getTreeObjByKey(key);
    });
    this.props.dispatch({
      type: LAYERLIST_REMOVE_LAYERS,
      payload: allTrees,
    });
    this.props.dispatch({
      type: LAYERLIST_ADD_LAYERS,
      payload: initTrees.filter(Boolean),
    });
  };
  getTree = () => {
    // 此树结构读取配置文件
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(this.state.searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + this.state.searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          this.state.allKeys.push(item.key);
          return (
            <TreeNode key={item.key} title={this.getTreeTitle(item.key, item.title)}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={this.getTreeTitle(item.key, item.title)} />;
      });
    return (
      <Tree
        checkable
        className="draggable-tree"
        draggable
        blockNode
        checkedKeys={this.props.layerList.checkedTreeNodes}
        //onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        onCheck={this.treeNodeCheckHandle}
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
      >
        {loop(this.state.gData)}
      </Tree>
    );
  };
  showWeatherDatePicker = () => {
    this.setState({
      datapickervisible: true,
    });
  };
  hideWeatherDatePicker = () => {
    this.setState({
      datapickervisible: false,
    });
  };
  getTreeTitle = (key, title) => {
    const index = title.indexOf(this.state.searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + this.state.searchValue.length);
    const titl =
      index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{title}</span>
      );
    if (title && title.indexOf('气象') > -1) {
      return (
        <div
          style={{ width: 350 }}
          onMouseEnter={this.showWeatherDatePicker}
          onMouseLeave={this.hideWeatherDatePicker}
        >
          <div style={{ float: 'left', width: '100%' }}>{titl}</div>
          <div
            style={{
              float: 'right',
              position: 'absolute',
              right: 20,
              display: this.state.datapickervisible ? 'block' : 'none',
            }}
          >
            <DatePicker
              size="small"
              defaultValue={moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))}
              onChange={(date, dateString) => {
                this.weatherDateChange(date, dateString, title);
              }}
            />
          </div>
        </div>
      );
    } else {
      return <span>{titl}</span>;
    }
  };
  weatherDateChange = (date, dateString, treeTitle) => {
    const dstr = date.format('YYYY/M/D');
    this.props.dispatch({
      type: LAYERLIST_RELOAD_WEATHER_LAYERS,
      payload: dstr,
    });
  };
  render() {
    return (
      <div className={styles.wrap}>
        <Row className={styles.toolbar}>
          <Col span={13}>
            <Search
              placeholder='关键字、图层名称'
              onChange={this.searchTextChange}
            />
          </Col>
          <Col span={11}>
            <ul className={styles.actionbar}>
              <li>
                <Tooltip
                  title={
                    this.state.checkAll
                      ? '全不选'
                      : '全选'
                  }
                >
                  <Button
                    key="check-square"
                    className={styles.noeffect}
                    icon="check-square"
                    onClick={this.checkAll}
                  />
                </Tooltip>
              </li>
              <li>
                <Tooltip title='展开所有图层'>
                  <Button
                    key="menu-fold"
                    className={styles.noeffect}
                    icon="menu-fold"
                    onClick={this.expandAll}
                  />
                </Tooltip>
              </li>
              <li>
                <Tooltip title='折叠所有图层'>
                  <Button
                    key="menu-unfold"
                    className={styles.noeffect}
                    icon="menu-unfold"
                    onClick={this.collapseAll}
                  />
                </Tooltip>
              </li>
              {/*<li>
                <Tooltip title={formatMessage({ id: 'systemlayer.reset' })}>
                  <Button
                    key="undo"
                    className={styles.noeffect}
                    icon="undo"
                    onClick={this.resetTree}
                  />
                </Tooltip>
              </li>*/}
              {/* <li>
                <Tooltip title={formatMessage({id:"systemlayer.save"})}>     
                  <Button key="save" className={styles.noeffect} icon="save" onClick={this.saveTree}></Button>
                </Tooltip>  
              </li> */}
              {/*<li>
                <Tooltip title={formatMessage({ id: 'systemlayer.collect' })}>
                  <Button
                    key="collect"
                    className={styles.noeffect}
                    onClick={this.showCollectPanel}
                    icon="star"
                  />
                </Tooltip>
              </li>*/}
            </ul>
          </Col>
        </Row>
        <Row
          className={styles.collectionPanel}
          style={{ display: this.state.modalvisible ? 'block' : 'none' }}
        >
          <center>
            <p>
              <Input
                className={styles.inputmargin}
                addonBefore="标题:"
                value={this.state.title}
                onChange={this.titleChange}
              />
            </p>
            <p>
              <Input
                className={styles.inputmargin}
                addonBefore="摘要:"
                value={this.state.snippet}
                onChange={this.snippetChange}
              />
            </p>
            <p>
              <Button type="primary" style={{ marginRight: '5px' }} onClick={this.handleOk}>
                保存
              </Button>
              <Button style={{ marginLeft: '5px' }} onClick={this.handleCancel}>
                取消
              </Button>
            </p>
          </center>
        </Row>
        <div className={styles.treediv}>{this.getTree()}</div>
      </div>
    );
  }
}
SystemLayer.propTypes = {};
export default connect(({ layerList }) => {
  return { layerList };
})(SystemLayer);
