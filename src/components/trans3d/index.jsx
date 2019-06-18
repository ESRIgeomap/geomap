import React from 'react';
import { connect } from 'dva';

import { VIEW_MODE_2D, VIEW_MODE_3D } from '../../constants/action-types';
import styles from './Trans3D.css';

const Trans3D = props => {
  const transform = () => {
    if (props.agsmap.mode === VIEW_MODE_2D) {
      props.dispatch({
        type: 'agsmap/transMode3d',
        payload: VIEW_MODE_3D,
      });
    } else if (props.agsmap.mode === VIEW_MODE_3D) {
      props.dispatch({
        type: 'agsmap/transMode2d',
        payload: VIEW_MODE_2D,
      });
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '150px',
        right: '0px',
        zIndex: 1,
        width: '36px',
        height: '36px',
      }}
    >
      <a className={styles.tranfBtn} onClick={transform}>
        {props.agsmap.mode === VIEW_MODE_2D ? '2D' : '3D'}
      </a>
    </div>
  );
};

export default connect(({ agsmap }) => {
  return { agsmap };
})(Trans3D);
