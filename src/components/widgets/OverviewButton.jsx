import React, { Component } from 'react';

import { Tooltip } from 'antd';

import styles from './WidgetButtons.css';

class OverviewButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <div>
        <Tooltip placement="left" title="显示/隐藏鹰眼图">
          <a
            className={styles.btn} onClick={() => {
              this.setState({
                visible: !this.state.visible,
              });
              this.props.toggle();
            }} style={{ background: this.state.visible ? '#00DEC9' : '' }}
          >
            <span className="esri-icon-maps" />
          </a>
        </Tooltip>
      </div>
    );
  }
}

export default OverviewButton;
