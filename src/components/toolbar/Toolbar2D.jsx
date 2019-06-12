import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Button, Icon, Avatar } from 'antd';

import {
  MAP_ACTION_CLEAR_GRAPHICS,
  ACTION_MEASURE_LINE_3D,
  ACTION_MEASURE_AREA_3D,
  VIEW_MODE_2D,
  ACTION_MEASURE_2D_LINE,
  ACTION_MEASURE_2D_AREA,
  ACTION_MAP_2D_CORRECT,
  ACTION_PRINT_2D_MAP,
  INIT_SPLITMAP,
  ACTION_LEGENDLIST_DEACTIVATE,
  ACTION_LEGENDLIST_SHOW,
  MAP_ACTION_CLIP_MAP,
} from '../../constants/action-types';

import styles from './Toolbar2D.css';
import Callout from '../callout/Callout';
import imageDivideTool from '../../utils/arcgis/image-divide';

const ButtonGroup = Button.Group;

class Toolbar2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.measureLine = this.measureLine.bind(this);
    this.visblechangebook = this.visblechangebook.bind(this);
    this.visibleLegend = this.visibleLegend.bind(this);
    this.splitScreen = this.splitScreen.bind(this);
    this.imageTool = this.imageTool.bind(this);
    this.rollerScreen = this.rollerScreen.bind(this);
  }
  componentDidMount() {}
  imageTool({ key }) {
    switch (key) {
      case 'imageDivide': {
        imageDivideTool.init();
        break;
      }
      default:
        break;
    }
  }
  measureLine({ key }) {
    switch (key) {
      case 'measure3DLine':
        this.props.dispatch({
          type: ACTION_MEASURE_LINE_3D,
        });
        break;
      case 'measure3DArea':
        this.props.dispatch({
          type: ACTION_MEASURE_AREA_3D,
        });
        break;
      case 'measure2DLine':
        this.props.dispatch({
          type: ACTION_MEASURE_2D_LINE,
        });
        break;
      case 'measure2DArea':
        this.props.dispatch({
          type: ACTION_MEASURE_2D_AREA,
        });
        break;
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
      case 'mapCorrection':
        this.props.dispatch({
          type: ACTION_MAP_2D_CORRECT,
        });
        break;
      case 'mapclear': {
        this.props.dispatch({
          type: MAP_ACTION_CLEAR_GRAPHICS,
        });
        break;
      }
      default:
        break;
    }
  }

  visblechangebook(e) {
    e.stopPropagation();
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
  }

  rollerScreen(e) {
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
  }

  splitScreen(e) {
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
      // console.log(document.getElementById('splitscreenDom'));
      if (document.getElementById('splitscreenDom')) {
        this.props.dispatch({
          type: 'agsmap/initsplitMap',
          payload: {
            containers: document.getElementById('splitscreenDom'),
          },
        });
      }
    }
  }

  visibleLegend = () => {
    // this.props.dispatch({
    //   type: ACTION_LEGENDLIST_SHOW,
    // });
    if (this.props.agsmap.legendflags) {
      // prepare();
      this.props.dispatch({
        type: 'agsmap/legendChangeState',
        payload: false,
      });
      this.props.dispatch({
        type: ACTION_LEGENDLIST_DEACTIVATE,
      });
    } else {
      this.props.dispatch({
        type: 'agsmap/legendChangeState',
        payload: true,
      });
      this.props.dispatch({
        type: ACTION_LEGENDLIST_SHOW,
      });
    }
  };

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
        <Menu.Item key="mapclear" style={{ textAlign: 'center' }}>
          <Icon type="delete" theme="outlined" />
          <span>&nbsp;清除</span>
        </Menu.Item>,
        <Menu.Item key="print2DMap" style={{ textAlign: 'center' }}>
          <Icon type="printer" />
          <span>&nbsp;打印</span>
        </Menu.Item>,
        <Menu.Item key="clipMap" style={{ textAlign: 'center' }}>
          <Icon type="scissor" />
          <span>&nbsp;截屏</span>
        </Menu.Item>,
        <Menu.Item key="legend" style={{ textAlign: 'center' }} onClick={this.visibleLegend}>
          <Icon type="bars" />
          <span>&nbsp;图例</span>
        </Menu.Item>,
      ]);

    return items;
  }
  timerSilder = () => {
    this.props.dispatch({
      type: 'agsmap/showTimerSliderCompare',
      payload: !this.props.agsmap.timerLayersSelectvisible,
    });
  };
  render() {
    const menu = (
      <Menu className={styles.noradius} onClick={this.measureLine}>
        {this.renderMenuItems()}
      </Menu>
    );
    const drawmenu = (
      // <Menu className={styles.noradius} onClick={this.measureLine}>
      <Callout />
      // </Menu>
    );
    return (
      <div
        className={styles.toolbar}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
        }}
      >
        <ButtonGroup className={styles.buttonGroup}>
          <Button onClick={this.visblechangebook} className={styles.btnStyle}>
            <Icon type="book" />
            书签
          </Button>
          <Dropdown overlay={drawmenu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="environment-o" />标 注<Icon type="down" />
            </Button>
          </Dropdown>

          <Dropdown
            overlay={
              <Menu className={styles.noradius} onClick={this.imageTool}>
                <Menu.Item
                  key="juanMap"
                  onClick={this.rollerScreen}
                  style={{ textAlign: 'center' }}
                >
                  <Icon type="border-horizontal" />
                  <span>&nbsp;卷帘对比</span>
                </Menu.Item>

                <Menu.Item
                  key="splitMap"
                  onClick={this.splitScreen}
                  style={{ textAlign: 'center' }}
                >
                  <Icon type="border-horizontal" />
                  <span>&nbsp;分屏对比</span>
                </Menu.Item>
                <Menu.Item key="imageDivide" style={{ textAlign: 'center' }}>
                  <Icon type="border-outer" />
                  <span>&nbsp;全域划分</span>
                </Menu.Item>
                <Menu.Item
                  key="timeslider"
                  onClick={this.timerSilder}
                  style={{ textAlign: 'center' }}
                >
                  <Icon type="play-circle" theme="filled" />
                  <span>&nbsp;多时相</span>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button className={styles.btnStyle}>
              <Icon type="picture" theme="filled" />
              影像工具
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

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(Toolbar2D);
