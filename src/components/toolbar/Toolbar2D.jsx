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
  MAP_ACTION_CLIP_MAP,
} from '../../constants/action-types';

import styles from './Toolbar2D.css';

const ButtonGroup = Button.Group;

const Toolbar2D = ({ agsmap, layerList, bookmark, dispatch }) => {
  /**
   * 【数据选择】点击回调
   * author：
   * @memberof Toolbar2D
   */
  const showLayerList = () => {
    dispatch({
      type: 'layerList/changeLayerListVisible',
      payload: !layerList.layerListVisible,
    });
  };

  /**
   * 【疑点标绘】单击回调
   * author：
   * @memberof Toolbar2D
   */
  const showPoltPanel = () => {
    dispatch({
      type: 'layerList/changePoltPanelVisible',
      payload: !layerList.poltPanelVisible,
    });
    dispatch({
      type: 'agsmap/identifyChangeState',
      payload: !agsmap.identifyflags,
    });
  };

  /**
   *【影像工具】单击回调
   * author：
   */
  const imageTool = ({ key }) => {
    switch (key) {
      case 'juanMap': {
        if (agsmap.rollerflags) {
          // prepare();
          dispatch({
            type: 'agsmap/rollscreenChangeState',
            payload: false,
          });
        } else {
          dispatch({
            type: 'agsmap/rollscreenChangeState',
            payload: true,
          });
          if (document.getElementById('rollerBlind')) {
            dispatch({
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
        dispatch({
          type: 'layerList/changeSplitState',
          payload: true,
        });
        if (agsmap.splitflags) {
          // prepare();
          dispatch({
            type: 'agsmap/splitscreenChangeState',
            payload: false,
          });
        } else {
          dispatch({
            type: 'agsmap/splitscreenChangeState',
            payload: true,
          });
          if (document.getElementById('splitscreenDom')) {
            dispatch({
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
        dispatch({
          type: 'agsmap/showTimerSliderCompare',
          payload: !agsmap.timerLayersSelectvisible,
        });
        break;
      }
      default:
        break;
    }
  };

  /**
   * 【结果输出】各个子菜单点击事件
   * author:
   * @param {string} key 被点击子菜单的key值
   */
  const outputSubmenuOnClick = ({ key }) => {
    switch (key) {
      case 'print2DMap':
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'print-map-2d',
        });
        break;
      case 'clipMap':
        // dispatch({
        //   type: MAP_ACTION_CLIP_MAP,
        // });
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'view-clip-map',
        });
        break;
      default:
        break;
    }
  };

  /**
   * 【工具箱】点击回调
   *author：
   * @param {*} { key }
   * @memberof Toolbar2D
   */
  const measureLine = ({ key }) => {
    switch (key) {
      //地图二维测量
      case 'measure2DBox':
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'measure-2d-box',
        });
        break;
      // 地图二维长度测量
      case 'measure2DLine':
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'measure-line-2d',
        });
        break;
      // 地图二维面积测量
      case 'measure2DArea':
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'measure-area-2d',
        });
        break;
      case 'mapclear': {
        dispatch({
          type: MAP_ACTION_CLEAR_GRAPHICS,
        });
        break;
      }
      // 地图图例
      case 'legend': {
        dispatch({
          type: 'toolbar/updateCurrentView',
          payload: 'legend',
        });
        break;
      }
      case 'bookmark': {
        if (bookmark.bookflags) {
          // prepare();
          dispatch({
            type: 'bookmark/bookmarkChangeState',
            payload: false,
          });
        } else {
          dispatch({
            type: 'bookmark/bookmarkChangeState',
            payload: true,
          });
        }
        break;
      }

      default:
        break;
    }
  };

  //工具箱下拉菜单UI构建
  const renderMenuItems = () => {
    const items = [];
    items.push([
      <Menu.Item key="measure2DBox" style={{ textAlign: 'center' }}>
        <Icon type="edit" />
        <span>&nbsp;测量</span>
      </Menu.Item>,
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
  };

  //  影像工具下拉菜UI构建
  const renderYXMenuItems = () => {
    const items = [];
    items.push([
      <Menu.Item key="juanMap" style={{ textAlign: 'center' }}>
        <Icon type="border-horizontal" />
        <span>&nbsp;卷帘对比</span>
      </Menu.Item>,

      <Menu.Item key="splitMap" style={{ textAlign: 'center' }}>
        <Icon type="border-horizontal" />
        <span>&nbsp;分屏对比</span>
      </Menu.Item>,
      <Menu.Item key="timeslider" style={{ textAlign: 'center' }}>
        <Icon type="clock-circle" />
        <span>&nbsp;&nbsp;多&nbsp;时&nbsp;相</span>
      </Menu.Item>,
    ]);

    return items;
  };

  /**
   * 结果输出下拉菜单UI构建
   *
   * @returns
   * @memberof Toolbar2D
   */
  const renderJGMenuItems = () => {
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
  };

  //影像工具menu
  const yx_menu = (
    <Menu className={styles.noradius} onClick={imageTool}>
      {renderYXMenuItems()}
    </Menu>
  );

  //结果输出menu
  const jg_menu = (
    <Menu className={styles.noradius} onClick={outputSubmenuOnClick}>
      {renderJGMenuItems()}
    </Menu>
  );

  //工具箱menu
  const menu = (
    <Menu className={styles.noradius} onClick={measureLine}>
      {renderMenuItems()}
    </Menu>
  );

  return (
    <div
      className={styles.toolbar}
      style={{
        display: agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
      }}
    >
      <ButtonGroup className={styles.buttonGroup}>
        <Button className={styles.btnStyle} onClick={showLayerList}>
          <Icon type="profile" />
          数据选择
        </Button>
        <Button className={styles.btnStyle} onClick={showPoltPanel}>
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

      <Avatar style={{ marginLeft: '20px', backgroundColor: '#87d068' }} icon="user" size="large" />
    </div>
  );
};

export default connect(({ agsmap, layerList, bookmark }) => {
  return {
    agsmap,
    layerList,
    bookmark,
  };
})(Toolbar2D);
