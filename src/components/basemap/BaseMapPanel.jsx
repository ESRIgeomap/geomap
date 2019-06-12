import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import styles from './BaseMapPanel.less';
import switchBaseMapByWebmapId from '../../utils/switchBaseMap';

class BaseMapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  switchBmap = e => {
    const itemId = e.target.dataset.itemid;
    switchBaseMapByWebmapId(itemId);
    this.props.setBmapIcon(e.target.src);
    this.props.hide();
  };
  renderBmapList = () => {
    return window.basemapConfig.map(item => {
      return (
        <Col span={12} key={item.itemId}>
          <div className={styles.basemapitemwrap}>
            <img
              onClick={this.switchBmap}
              data-itemid={item.itemId}
              title={item.title}
              src={item.icon}
            />
            <center>
              <span>{item.title}</span>
            </center>
          </div>
        </Col>
      );
    });
  };
  render() {
    return (
      <div
        className={styles.BaseMapPanelWrap}
        style={{ display: this.props.show ? 'block' : 'none' }}
      >
        <Row gutter={10} style={{ margin: 10 }}>
          {this.renderBmapList()}{' '}
        </Row>
      </div>
    );
  }
}
BaseMapPanel.propTypes ={
  show: PropTypes.bool,
  setBmapIcon : PropTypes.func,
  hide: PropTypes.func,
}

export default BaseMapPanel;
