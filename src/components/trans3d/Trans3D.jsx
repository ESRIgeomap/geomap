import React from 'react';
import { connect } from 'dva';

import { VIEW_MODE_2D, VIEW_MODE_3D } from '../../constants/action-types';
import styles from './Trans3D.css';

class Trans3D extends React.Component {
  constructor(props) {
    super(props);

    this.transform = this.transform.bind(this);
  }
  transform() {
    if (this.props.agsmap.mode === VIEW_MODE_2D) {
      this.props.dispatch({
        type: 'agsmap/transMode3d',
        payload: VIEW_MODE_3D,
      });
    } else if (this.props.agsmap.mode === VIEW_MODE_3D) {
      this.props.dispatch({
        type: 'agsmap/transMode2d',
        payload: VIEW_MODE_2D,
      });
    }
  }

  render() {
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
        <a className={styles.tranfBtn} onClick={this.transform}>
          {this.props.agsmap.mode === VIEW_MODE_2D ? '2D' : '3D'}
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    agsmap: state.agsmap,
  };
}
export default connect(mapStateToProps)(Trans3D);

