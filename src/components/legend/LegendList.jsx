import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Tooltip, Icon } from 'antd';
import { ACTION_LEGENDLIST_DEACTIVATE,VIEW_MODE_2D } from '../../constants/action-types';
import styles from './LegendList.css';
// import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';

class LegendList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.visblechange = this.visblechange.bind(this);
    this.drag = this.drag.bind(this);
    this.removeDrag = this.removeDrag.bind(this);
  }

  visblechange() {
    if (this.props.agsmap.legendflags) {
      // prepare();
      this.props.dispatch({
        type: 'agsmap/legendChangeState',
        payload: false,
      });
      this.props.dispatch({
        type: ACTION_LEGENDLIST_DEACTIVATE,
      });
    } else {
      this.props.dispatch({
        type: 'agsmap/legendChangeState',
        payload: true,
      });
    }
  }
  //onMouseDown
  drag = e => {
    const Drag = this.refs.legendListDiv;
    const ev = event || window.event;
    event.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
    };
  };
  //onMouseUp
  removeDrag = e => {
    document.onmousemove = null;
    const Drag = this.refs.legendListDiv;
    Drag.style.cursor = 'default';
  };
  render() {
    return (
      <div
        id="tuli"
        className={styles.modal}
        style={{ display: this.props.agsmap.legendflags&&this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none' }}
        ref="legendListDiv"
      >
        <div className={styles.title} onMouseDown={this.drag} onMouseUp={this.removeDrag}>
          图例
          <Tooltip title="关闭">
            <div onClick={this.visblechange} className={styles.close}>
              <Icon type="close" />
            </div>
          </Tooltip>
        </div>
        <div
          className={styles.listdiv}
          id="legendlistDiv"/>
      </div>
    );
  }
}
LegendList.propTypes = {};
export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(LegendList);
