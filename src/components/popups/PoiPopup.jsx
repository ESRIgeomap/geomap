import React from 'react';
import styles from './Popup.css';

import transparentSrc from './images/transparent.gif';

class PoiPopup extends React.Component {
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.attrWrap}>
          <div className={styles.attrRow}>
            <span className={styles.attrLabel}>地址:</span>
            <span>
              {this.props.graphic.attributes[window.poiCfg[0].locationField]}
            </span>
          </div>
        </div>
        <div className={styles.nearbyBar}>
          <img alt="" src={transparentSrc} />
          <span>在附近找</span>
        </div>
      </div>
    );
  }
}

export default PoiPopup;
