import React from 'react';

import { MODE_DIR_BUS, MODE_DIR_DRIVE, MODE_DIR_WALK, MODE_DIR_RIDE } from '../../constants/search';
import styles from './CircuitTypeSelector.css';

/**
 * 路线类型 - 选择器
 * 1. 公交
 * 2. 驾车
 */
export default class CircuitTypeSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: MODE_DIR_BUS,
    };
  }

  onButtonClick(mode) {
    this.setState({ mode });
    if (this.props.onChange) {
      this.props.onChange(mode);
    }
  }

  getModeColor(mode) {
    return {
      color: this.state.mode === mode ? '#1870ff' : 'rgb(0, 0, 0, 0.65)',
    };
  }

  getIconPosition(mode) {
    switch (mode) {
      case MODE_DIR_BUS:
        return {
          backgroundPosition: this.state.mode === MODE_DIR_BUS ? '0 -51px' : '0 -34px',
          height: '15px',
          width: '13px',
        };
      case MODE_DIR_DRIVE:
        return {
          backgroundPosition: this.state.mode === MODE_DIR_DRIVE ? '0 -84px' : '0 -68px',
          width: '15px',
          height: '14px',
        };
      case MODE_DIR_WALK:
        return {
          backgroundPosition: this.state.mode === MODE_DIR_WALK ? '0 -119px' : '0 -100px',
          width: '15px',
          height: '17px',
        };
      case MODE_DIR_RIDE:
        return {
          backgroundPosition: this.state.mode === MODE_DIR_RIDE ? '0 -155px' : '0 -136px',
          width: '19px',
          height: '17px',
        };
      default:
        break;
    }

    return {};
  }

  render() {
    return (
      <div {...this.props}>
        <div className={styles.wrap}>
          <span
            className={styles.btn}
            style={this.getModeColor(MODE_DIR_BUS)}
            onMouseDown={() => this.onButtonClick(MODE_DIR_BUS)}
          >
            <i className={styles.icon} style={this.getIconPosition(MODE_DIR_BUS)} title="公交"/>
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.bus'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: this.state.mode === MODE_DIR_BUS ? '' : 'none',
              }}
            />
          </span>
          <span
            className={styles.btn}
            style={this.getModeColor(MODE_DIR_DRIVE)}
            onMouseDown={() => this.onButtonClick(MODE_DIR_DRIVE)}
          >
            <i className={styles.icon} style={this.getIconPosition(MODE_DIR_DRIVE)} title="驾车"/>
             {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.drive'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: this.state.mode === MODE_DIR_DRIVE ? '' : 'none',
              }}
            />
          </span>

          <span
            className={styles.btn}
            style={this.getModeColor(MODE_DIR_WALK)}
            onMouseDown={() => this.onButtonClick(MODE_DIR_WALK)}
          >
            <i className={styles.icon} style={this.getIconPosition(MODE_DIR_WALK)} title="步行"/>
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.walk'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: this.state.mode === MODE_DIR_WALK ? '' : 'none',
              }}
            />
          </span>
          <span
            className={styles.btn}
            style={this.getModeColor(MODE_DIR_RIDE)}
            onMouseDown={() => this.onButtonClick(MODE_DIR_RIDE)}
          >
            <i className={styles.icon} style={this.getIconPosition(MODE_DIR_RIDE)} title="骑行"/>
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.riding'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: this.state.mode === MODE_DIR_RIDE ? '' : 'none',
              }}
            />
          </span>
        </div>
      </div>
    );
  }
}
