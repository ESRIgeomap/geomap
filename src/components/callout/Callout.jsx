import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import styles from './Callout.css';
import {
  ACTION_DRAW_POINT_2D,
  ACTION_DRAW_LINE_2D,
  ACTION_DRAW_FLAT_2D,
} from '../../constants/action-types';

class Callout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.measureLine = this.measureLine.bind(this);
  }

  componentWillMount() {}

  measureLine({ key }) {
    switch (key) {
      case 'drawpoint':
        this.props.dispatch({
          type: ACTION_DRAW_POINT_2D,
        });
        break;
      case 'drawline':
        this.props.dispatch({
          type: ACTION_DRAW_LINE_2D,
        });
        break;
      case 'drawflat':
        this.props.dispatch({
          type: ACTION_DRAW_FLAT_2D,
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Menu className={styles.noradius} onClick={this.measureLine}>
        <Menu.Item key="drawpoint" className={styles.menuItem}>
          <Icon type="environment-o" />绘点
        </Menu.Item>

        <Menu.Item key="drawline" className={styles.menuItem}>
          <Icon type="edit" />绘线
        </Menu.Item>

        <Menu.Item key="drawflat" className={styles.menuItem}>
          <Icon type="picture" />绘面
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(Callout);
