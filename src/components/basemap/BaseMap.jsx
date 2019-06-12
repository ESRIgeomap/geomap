import React, { Component } from 'react';
import styles from './BaseMap.less';
import defautBmap from './img/map.png';
import BaseMapPanel from './BaseMapPanel';
import PropTypes from 'prop-types';
class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bmapPanelStateFlag: false,
      activeBmapIcon: defautBmap,
    };
  }

  changeBmapPanelState = () => {
    this.setState({
      bmapPanelStateFlag: !this.state.bmapPanelStateFlag,
    });
  };
  setBmapIcon = activeBmapIcon => {
    this.setState({
      activeBmapIcon,
    });
  };
  hiddeBmapPanel = () => {
    this.setState({
      bmapPanelStateFlag: false,
    });
  };
  render() {
    return (
      <div className={styles.wrap} title='切换底图'>
        <img src={this.state.activeBmapIcon} onClick={this.changeBmapPanelState} />
        <BaseMapPanel
          show={this.state.bmapPanelStateFlag}
          setBmapIcon={this.setBmapIcon}
          hide={this.hiddeBmapPanel}
        />
      </div>
    );
  }
}
BaseMap.propTypes= {
  
}

export default BaseMap;


