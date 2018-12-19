import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Button, Icon, Avatar } from 'antd';

import {
  MAP_ACTION_CLEAR_GRAPHICS,
  ACTION_MEASURE_LINE_3D,
  ACTION_MEASURE_AREA_3D,
  VIEW_MODE_3D,
  VIEW_MODE_2D,
  ACTION_MEASURE_2D_LINE,
  ACTION_MEASURE_2D_AREA,
  ACTION_MAP_2D_CORRECT,
  ACTION_PRINT_2D_MAP,
} from '../../constants/action-types';

import styles from './Toolbar2D.css';
import Callout from '../callout/Callout';
import AreaSelector from '../stat/AreaSelector';

const ButtonGroup = Button.Group;

class Toolbar2D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.measureLine = this.measureLine.bind(this);
    this.visblechangebook = this.visblechangebook.bind(this);
    this.splitScreen = this.splitScreen.bind(this);
  }
  componentDidMount() {}
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

  splitScreen(e) {
    e.stopPropagation();
    const el = e.target.children[1];
    if (el.innerText === '分屏') {
      el.innerText = '退出';
    } else {
      el.innerText = '分屏';
    }
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

  renderMenuItems() {
    const items = [];
    if (this.props.agsmap.mode === VIEW_MODE_3D) {
      items.push(
        <Menu.Item key="measure3DLine" style={{ textAlign: 'center' }}>
          <Icon type="mail" />
          <span>&nbsp;测距</span>
        </Menu.Item>
      );

      items.push(
        <Menu.Item key="measure3DArea" style={{ textAlign: 'center' }}>
          <Icon type="ant-design" />
          <span>&nbsp;测面</span>
        </Menu.Item>
      );
    } else if (this.props.agsmap.mode === VIEW_MODE_2D) {
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
      ]);
      // items.push(
      //   <Menu.Item key="mapCorrection" style={{ textAlign: 'center' }}>
      //     <Icon type="ant-design" />
      //     <span>&nbsp;地图纠错</span>
      //   </Menu.Item>,
      // );
    }
    return items;
  }

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
          <AreaSelector className={styles.btnStyle} />
          <Button onClick={this.visblechangebook} className={styles.btnStyle}>
            <Icon type="book" />
            书签
          </Button>
          <Dropdown overlay={drawmenu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="environment-o" />标 注<Icon type="down" />
            </Button>
          </Dropdown>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className={styles.btnStyle}>
              <Icon type="medicine-box" theme="filled" />
              工具箱
              <Icon type="down" />
            </Button>
          </Dropdown>

          <Button
            className={styles.btnStyle}
            onClick={() => {
              window.open('multiDate.html');
            }}
          >
            <Icon type="clock-circle-o" />
            多时相
          </Button>
          <Button className={styles.btnStyle} onClick={this.splitScreen}>
            <Icon type="switcher" />
            分屏
          </Button>
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
