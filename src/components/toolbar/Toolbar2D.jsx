/**
 * 二维地图toolbar功能
 * @author  lee
 */
import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Button, Icon, Avatar } from 'antd';

import {
  MAP_ACTION_CLEAR_GRAPHICS,
  VIEW_MODE_2D,
  ACTION_PRINT_2D_MAP,
  INIT_SPLITMAP,
  ACTION_LEGENDLIST_DEACTIVATE,
  ACTION_LEGENDLIST_SHOW,
  MAP_ACTION_CLIP_MAP,
} from '../../constants/action-types';

import styles from './Toolbar2D.css';

const ButtonGroup = Button.Group;

class Toolbar2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.measureLine = this.measureLine.bind(this);
    this.imageTool = this.imageTool.bind(this);
    this.outputSubmenuOnClick = this.outputSubmenuOnClick.bind(this);
  }
  componentDidMount() {}

  //pensiveant:数据选择
  showLayerList = () => {
    this.props.dispatch({
      type: 'layerList/changeLayerListVisible',
      payload: !this.props.layerList.layerListVisible,
    });
  };

  //pensiveant:疑点标绘
  showPoltPanel = () => {
    this.props.dispatch({
      type: 'layerList/changePoltPanelVisible',
      payload: !this.props.layerList.poltPanelVisible,
    });
    this.props.dispatch({
      type: 'agsmap/identifyChangeState',
      payload: !this.props.agsmap.identifyflags,
    });
  };

  /**
   * 输出结果各个子菜单点击事件
   * @param {Object} param0 事件参数
   * @param {string} param0.key 被点击子菜单的key值
   */
  // 输出结果子菜单点击事件
  outputSubmenuOnClick({ key }) {
    switch (key) {
      case 'print2DMap':
        this.props.dispatch({
          type: ACTION_PRINT_2D_MAP,
        });
        break;
      case 'clipMap':
        this.props.dispatch({
          type: MAP_ACTION_CLIP_MAP,
        });
        break;
      default:
        break;
    }
  }
  // 工具箱子菜单点击事件
  measureLine({ key }) {
    switch (key) {
      // 地图二维长度测量
      case 'measure2DLine':
        this.props.dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'measure-line-2d',
        });
        break;
      // 地图二维面积测量
      case 'measure2DArea':
        this.props.dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'measure-area-2d',
        });
        break;
      case 'mapclear': {
        this.props.dispatch({
          type: MAP_ACTION_CLEAR_GRAPHICS,
        });
        break;
      }
      // 地图图例
      case 'legend': {
        this.props.dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'legend',
        });
        break;
      }
      case 'bookmark': {
        if (this.props.agsmap.bookflags) {
          // prepare();
          this.props.dispatch({
            type: 'agsmap/bookmarkChangeState',
            payload: false,
          });
        } else {
          this.props.dispatch({
            type: 'agsmap/bookmarkChangeState',
            payload: true,
          });
        }
        break;
      }
      default:
        break;
    }
  }
  // 影像工具子菜单点击事件
  imageTool({ key }) {
    switch (key) {
      case 'juanMap': {
        if (this.props.agsmap.rollerflags) {
          // prepare();
          this.props.dispatch({
            type: 'agsmap/rollscreenChangeState',
            payload: false,
          });
        } else {
          this.props.dispatch({
            type: 'agsmap/rollscreenChangeState',
            payload: true,
          });
          if (document.getElementById('rollerBlind')) {
            this.props.dispatch({
              type: INIT_SPLITMAP,
              payload: {
                containers: document.getElementById('rollerBlind'),
              },
            });
          }
        }
        break;
      }
      case 'splitMap': {
        this.props.dispatch({
          type: 'layerList/changeSplitState',
          payload: true,
        });
        if (this.props.agsmap.splitflags) {
          // prepare();
          this.props.dispatch({
            type: 'agsmap/splitscreenChangeState',
            payload: false,
          });
        } else {
          this.props.dispatch({
            type: 'agsmap/splitscreenChangeState',
            payload: true,
          });
          if (document.getElementById('splitscreenDom')) {
            this.props.dispatch({
              type: 'agsmap/initsplitMap',
              payload: {
                containers: document.getElementById('splitscreenDom'),
              },
            });
          }
        }
        break;
      }
      case 'timeslider': {
        this.props.dispatch({
          type: 'agsmap/showTimerSliderCompare',
          payload: !this.props.agsmap.timerLayersSelectvisible,
        });
        break;
      }
      default:
        break;
    }
  }

  //  工具箱下拉菜单功能内容
  renderMenuItems() {
    const items = [];
    items.push([
      <Menu.Item key="measure2DLine" style={{ textAlign: 'center' }}>
        <Icon type="edit" />
        <span>&nbsp;测距</span>
      </Menu.Item>,
      <Menu.Item key="measure2DArea" style={{ textAlign: 'center' }}>
        <Icon type="picture" />
        <span>&nbsp;测面</span>
      </Menu.Item>,
      <Menu.Item key="legend" style={{ textAlign: 'center' }}>
        <Icon type="bars" />
        <span>&nbsp;图例</span>
      </Menu.Item>,
      <Menu.Item key="bookmark" style={{ textAlign: 'center' }}>
        <Icon type="book" />
        <span>&nbsp;书签</span>
      </Menu.Item>,
      <Menu.Item key="mapclear" style={{ textAlign: 'center' }}>
        <Icon type="delete" theme="outlined" />
        <span>&nbsp;清除</span>
      </Menu.Item>,
    ]);

    return items;
  }

  //  影像工具下拉菜单功能内容
  renderYXMenuItems() {
    const items = [];
    items.push([
      <Menu.Item key="juanMap" onClick={this.rollerScreen} style={{ textAlign: 'center' }}>
        <Icon type="border-horizontal" />
        <span>&nbsp;卷帘对比</span>
      </Menu.Item>,

      <Menu.Item key="splitMap" onClick={this.splitScreen} style={{ textAlign: 'center' }}>
        <Icon type="border-horizontal" />
        <span>&nbsp;分屏对比</span>
      </Menu.Item>,
      <Menu.Item key="timeslider" onClick={this.timerSilder} style={{ textAlign: 'center' }}>
        <Icon type="clock-circle" />
        <span>&nbsp;&nbsp;多&nbsp;时&nbsp;相</span>
      </Menu.Item>,
    ]);

    return items;
  }

  //  结果输出下拉菜单功能内容
  renderJGMenuItems() {
    const items = [];
    items.push([
      <Menu.Item key="print2DMap" style={{ textAlign: 'center' }}>
        <Icon type="printer" />
        <span>&nbsp;打印</span>
      </Menu.Item>,
      <Menu.Item key="clipMap" style={{ textAlign: 'center' }}>
        <Icon type="scissor" />
        <span>&nbsp;截屏</span>
      </Menu.Item>,
    ]);

    return items;
  }

  render() {
    const menu = (
      <Menu className={styles.noradius} onClick={this.measureLine}>
        {this.renderMenuItems()}
      </Menu>
    );
    const yx_menu = (
      <Menu className={styles.noradius} onClick={this.imageTool}>
        {this.renderYXMenuItems()}
      </Menu>
    );
    const jg_menu = (
      <Menu className={styles.noradius} onClick={this.outputSubmenuOnClick}>
        {this.renderJGMenuItems()}
      </Menu>
    );

    return (
      <div
        className={styles.toolbar}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
        }}
      >
        <ButtonGroup className={styles.buttonGroup}>
          <Button className={styles.btnStyle} onClick={this.showLayerList}>
            <Icon type="profile" />
            数据选择
          </Button>
          <Button className={styles.btnStyle} onClick={this.showPoltPanel}>
            <Icon type="highlight" />
            疑点标绘
          </Button>

          <Dropdown overlay={yx_menu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="picture" theme="filled" />
              影像工具
              <Icon type="down" />
            </Button>
          </Dropdown>
          <Dropdown overlay={jg_menu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="picture" theme="filled" />
              结果输出
              <Icon type="down" />
            </Button>
          </Dropdown>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="medicine-box" theme="filled" />
              工具箱
              <Icon type="down" />
            </Button>
          </Dropdown>
        </ButtonGroup>

        <Avatar
          style={{ marginLeft: '20px', backgroundColor: '#87d068' }}
          icon="user"
          size="large"
        />
      </div>
    );
  }
}

export default connect(({ agsmap, layerList }) => {
  return {
    agsmap,
    layerList,
  };
})(Toolbar2D);
