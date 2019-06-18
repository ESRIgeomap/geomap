import React, { Component } from 'react';
import { connect } from 'dva';
import { Collapse, Button, Icon, message, Tooltip, Modal, Input } from 'antd';
// import CollectionLayer from './CollectionLayer';
import SystemSplitLayer from './SystemSplitLayer';
import styles from './SplitLayerList.less';
// import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';

import {
  VIEW_MODE_2D,
  LAYERLIST_WEBMAP_CHANGE,
  LAYERLIST_WEBMAP_LIST,
  SUBJECTLAYERLIST_SAVE,
} from '../../constants/action-types';
import {
  getPortalToken,
  getPortalSelf,
  searchItems,
  getItemInfoByItemId,
} from '../../services/portal';

const { Panel } = Collapse;
class SplitLayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comheight:840,
      contentheight: 804,
      visible: false,
      modalvisible: false,
      title: '',
      snippet: '',
    };
  }

  componentDidMount() {
    const height = document.body.clientHeight - 150;
    this.setState({
      comheight:height,
      contentheight: height - 36,
    });
    /**暂时先放在这,应放在登陆验证后的操作 */
    // this.getPotrtalToken();
  }
  getPotrtalToken = () => {
    getPortalToken(window.username, window.password)
      .then(data => {
        sessionStorage.setItem('token', data.data.token);
        getPortalSelf(sessionStorage.token).then(user => {
          sessionStorage.setItem('username', user.data.username);
          sessionStorage.setItem('role', user.data.role);
        });
      })
      .catch(err => {
        message.warn('获取用户失败···');
      });
  };
  getMyWebmap = () => {
    const q = `owner:${sessionStorage.username} orgid:0123456789ABCDEF AND type: 'Web Map'`;
    const items = searchItems(sessionStorage.token, q, 1, 100, null, null);
    items.then(data => {
      this.props.dispatch({
        type: 'splitLayerList/setWebMapsList',
        payload: data.data.results,
      });
      const webMapsListWidth = (data.data.results.length + 1) * 205;
      this.props.dispatch({
        type: 'splitLayerList/setWebMapsListWidth',
        payload: webMapsListWidth,
      });
    });
  };

  changeLayerListVisible = e => {
    e.stopPropagation();

    this.props.dispatch({
      type: 'splitLayerList/changeLayerListVisible',
      payload: !this.props.splitLayerList.layerListVisible,
    });
  };
  showThematicPanel = () => {
    // this.getMyWebmap();
    this.props.dispatch({
      type: 'splitLayerList/showSubjectLayerList',
      payload: !this.props.splitLayerList.subjectLayerListShow,
    });
  };
  //onMouseDown
  drag = e => {
    const Drag = this.refs.layerListPanel;
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
    const Drag = this.refs.layerListPanel;
    Drag.style.cursor = 'default';
  };
  saveToCollection = () => {
    const subjectInfo = {
      title: this.state.title,
      snippet: this.state.snippet,
    };
    this.props.dispatch({
      type: SUBJECTLAYERLIST_SAVE,
      payload: subjectInfo,
    });
    this.props.dispatch({
      type: 'splitLayerList/getCollectionWebMap',
    });
  };
  handleOk = e => {
    if (this.state.title === '') {
      message.warn('标题不能为空！');
      return;
    }
    this.saveToCollection();
    this.setState({
      title: '',
      snippet: '',
      modalvisible: false,
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'splitLayerList/getCollectionWebMap',
      });
    }, 1000);
  };

  handleCancel = e => {
    this.setState({
      title: '',
      snippet: '',
      modalvisible: false,
    });
  };
  showSaveModal = e => {
    this.setState({
      modalvisible: true,
    });
  };
  titleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };
  snippetChange = e => {
    this.setState({
      snippet: e.target.value,
    });
  };

  genExtra = () => (
    <Icon
      type="double-right"
      onClick={(event) => {
        
      }}
    />
  );

  render() {
    return (
      <div
        className={styles.leftPanel}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
        }}
      >     
        <div
          className={styles.layerListPanel}
          style={{ display: this.props.splitLayerList.layerListVisible ? 'block' : 'none',
            height: this.state.comheight,
           }}
          ref="layerListPanel"
        >
          <div className={styles.title} onMouseDown={this.drag} onMouseUp={this.removeDrag}>
          图层列表
          <Tooltip title='关闭'>
              <div onClick={this.changeLayerListVisible} className={styles.close}>
                <Icon type="close" />
              </div>
            </Tooltip>
          </div>

          <div className={styles.content}
              style={{height: this.state.contentheight}}
          >
            {/* <Collapse>
            <Panel header='我的收藏' key="1" showArrow={false} extra={this.genExtra()}>
                <CollectionLayer />
              </Panel>
            </Collapse> */}
            <h4 className={styles.header}> 图层列表</h4>
            <SystemSplitLayer />
          </div>
        </div>
        
      </div>
    );
  }
}
SplitLayerList.propTypes= {
  
}
export default connect(({ agsmap, splitLayerList }) => {
  return {
    agsmap,
    splitLayerList,
  };
})(SplitLayerList);
