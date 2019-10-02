// import React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  MODE_DIR_BUS,
  MODE_DIR_DRIVE,
  MODE_DIR_WALK,
  MODE_DIR_RIDE,
} from '../../../constants/search';
import styles from './CircuitTypeSelector.css';

/**
 * 路线类型 - 选择器
 * 1. 公交
 * 2. 驾车
 * 3. 步行
 * 4. 骑行
 */

  const CircuitTypeSelector = props => {
  
  const [mode, setMode] = useState(MODE_DIR_BUS);

  function onButtonClick(inmode) {
    setMode(inmode);
    if (props.onChange) {
      props.onChange(inmode);
    }
  }

  function getModeColor(inmode) {
    return {
      color: mode === inmode ? '#1870ff' : 'rgb(0, 0, 0, 0.65)',
    };
  }

  function getIconPosition(inmode) {
    switch (inmode) {
      case MODE_DIR_BUS:
        return {
          backgroundPosition: mode === MODE_DIR_BUS ? '0 -51px' : '0 -34px',
          height: '15px',
          width: '13px',
        };
      case MODE_DIR_DRIVE:
        return {
          backgroundPosition: mode === MODE_DIR_DRIVE ? '0 -84px' : '0 -68px',
          width: '15px',
          height: '14px',
        };
      case MODE_DIR_WALK:
        return {
          backgroundPosition: mode === MODE_DIR_WALK ? '0 -119px' : '0 -100px',
          width: '15px',
          height: '17px',
        };
      case MODE_DIR_RIDE:
        return {
          backgroundPosition: mode === MODE_DIR_RIDE ? '0 -155px' : '0 -136px',
          width: '19px',
          height: '17px',
        };
      default:
        break;
    }

    return {};
  }

    return (
      <div {...props}>
        <div className={styles.wrap}>
          <span
            className={styles.btn}
            style={getModeColor(MODE_DIR_BUS)}
            onMouseDown={() =>{onButtonClick(MODE_DIR_BUS)}}
            
          >
            <i className={styles.icon} style={getIconPosition(MODE_DIR_BUS)} title="公交" />
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.bus'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: mode === MODE_DIR_BUS ? '' : 'none',
              }}
            />
          </span>
          <span
            className={styles.btn}
            style={getModeColor(MODE_DIR_DRIVE)}
            onMouseDown={() =>{onButtonClick(MODE_DIR_DRIVE)}}
          >
            <i className={styles.icon} style={getIconPosition(MODE_DIR_DRIVE)} title="驾车" />
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.drive'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: mode === MODE_DIR_DRIVE ? '' : 'none',
              }}
            />
          </span>

          <span
            className={styles.btn}
            style={getModeColor(MODE_DIR_WALK)}
            onMouseDown={() =>{onButtonClick(MODE_DIR_WALK)}}
          >
            <i className={styles.icon} style={getIconPosition(MODE_DIR_WALK)} title="步行" />
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.walk'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: mode === MODE_DIR_WALK ? '' : 'none',
              }}
            />
          </span>
          <span
            className={styles.btn}
            style={getModeColor(MODE_DIR_RIDE)}
            onMouseDown={() =>{onButtonClick(MODE_DIR_RIDE)}}
          >
            <i className={styles.icon} style={getIconPosition(MODE_DIR_RIDE)} title="骑行" />
            {/*<span>&nbsp;&nbsp;&nbsp;{formatMessage({id: 'circuittypeselector.riding'})}</span>*/}
            <span
              className={styles.triangle}
              style={{
                display: mode === MODE_DIR_RIDE ? '' : 'none',
              }}
            />
          </span>
        </div>
      </div>
    );
}

export default CircuitTypeSelector;
