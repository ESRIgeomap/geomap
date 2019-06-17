//pensiveant:标绘组件（包含编辑）


import React from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Button, message, Tabs, Modal, Input } from 'antd';
import styles from './PoltPanel.less';
//引入子组件
import PoltToolBar from './PoltToolBar';
import {
  VIEW_MODE_2D,
  POLT_CLEAR_LAYER,
  POLT_CANCLE_LASTONE,
  POLT_EDIT_UPDATE,
  POLT_EDIT_ACTIVE,
  POLT_EDIT_DELETE,
  POLT_EDIT_UNDO,
  POLT_EDIT_REDO,
  POLT_EDIT_CLEAR,
  POLT_EDITOR_REMOVE,
  POLT_EDITOR_CREATE,
  POLT_EDIT_COMPLETE,
} from '../../constants/action-types';
import PoltLayer from './PoltLayer';
//import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';

import { LAYERLIST_POLT_LAYER_SAVE } from '../../constants/action-types';
import poltUtils from '../../utils/poltUtils';

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;


class PoltPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comheight: 835,
      contentheight: 799,
      layertitle: '',
      modalvisible: false,
      tabkey: '1',
    };
  }

  componentDidMount() {
    const height = document.body.clientHeight - 150;
    this.setState({
      comheight: height,
      contentheight: height - 36,
    });
  }







  finishPlot = () => {
    // message.info('完成标绘保存图层，关闭面板不保存');
    this.setState({
      modalvisible: true,
    });
  };

  clearPoltLayer = () => {
    this.props.dispatch({
      type: POLT_CLEAR_LAYER,
    });
  };

  cancelPoltLastOne = () => {
    this.props.dispatch({
      type: POLT_CANCLE_LASTONE,
    });
  };

 

  layertitleChange = e => {
    const value = e.target.value;
    this.setState({
      layertitle: value,
    });
  };

  //
  editUpdate = e => {
    this.props.dispatch({
      type: POLT_EDIT_UPDATE,
    });
  };


  //切换tab回调
  changeTabPane = e => {
    if (e === '1') {
      // this.props.dispatch({
      //   type: POLT_EDITOR_REMOVE,
      // });
      this.props.dispatch({
        type: 'layerList/changePoltEditToolbarVisible',
        payload: true,
      });
    } else {
      // this.props.dispatch({
      //   type: POLT_EDITOR_CREATE,
      // });
      // this.props.dispatch({
      //   type: 'layerList/changePoltEditToolbarVisible',
      //   payload: false,
      // });
    }
    this.setState({
      tabkey: e,
    });
  };

   //按键按下拖拽事件
   drag = e => {
    const Drag = this.refs.poltPanel;
    const ev = event || window.event;
    event.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function (event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
    };
  };

  //按键松开停止拖拽
  removeDrag = e => {
    document.onmousemove = null;
    const Drag = this.refs.poltPanel;
    Drag.style.cursor = 'default';
  };

  
  //标绘关闭“X”回调
  closePoltPanel = () => {
    // this.childPoltToolBar.deActivePolt();

    //设置标绘组件不可见
    this.props.dispatch({
      type: 'layerList/changePoltPanelVisible',
      payload: false,
    });

    this.deActivePolt();
    this.props.dispatch({
      type: POLT_EDITOR_REMOVE,
    });
  };

  deActivePolt = () => {
    this.setState({
      activePoltType: '',
    });
    poltUtils.deactivePolt();
  };

  //“编辑节点”回调
  editActive = e => {
    this.childPoltToolBar.deActivePolt();
  };

  //“属性/样式”回调
  editComplete = e => {
    this.childPoltToolBar.deActivePolt();
    this.props.dispatch({
      type: POLT_EDIT_COMPLETE,
    });
  };

  //“删除”回调
  editDelete = e => {
    this.props.dispatch({
      type: POLT_EDIT_DELETE,
    });
  };

  //“撤销”回调
  editUndo = e => {
    this.props.dispatch({
      type: POLT_EDIT_UNDO,
    });
  };

  //“恢复”回调
  editRedo = e => {
    this.props.dispatch({
      type: POLT_EDIT_REDO,
    });
  };

  //“清除”回调
  editClear = e => {
    this.props.dispatch({
      type: POLT_EDIT_CLEAR,
    });
  };


  render() {
    return (
      <div
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
        }}
      >
        <div style={{ display: this.props.layerList.poltPanelVisible ? 'block' : 'none' }}>
          <div className={styles.wrap} ref="poltPanel" style={{ height: this.state.comheight }}>
            <div className={styles.title} onMouseDown={this.drag} onMouseUp={this.removeDrag}>
              标绘
              <Tooltip title='关闭'>
                <div onClick={this.closePoltPanel} className={styles.close}>
                  <Icon type="close" />
                </div>
              </Tooltip>
            </div>
            <div className={styles.content} style={{ height: this.state.contentheight }}>
              <Tabs
                activeKey={this.state.tabkey}
                style={{ height: '100%' }}
                onTabClick={this.changeTabPane}
              >
                <TabPane tab='标绘' key="1">
                  <PoltToolBar
                    onRef={ref => {
                      this.childPoltToolBar = ref;
                    }}
                  />
                </TabPane>
                {/* 去掉我的标绘 */}
                {/* <TabPane tab='我的标绘' key="2">
                  <PoltLayer changeTab={this.changeTabPane} />
                </TabPane> */}
              </Tabs>
            </div>
          </div>
          <div className={styles.editTool}>
            {this.props.layerList.poltedittoolbarvisible ? (
              <div
                style={{ display: this.props.layerList.poltedittoolbarvisible ? 'block' : 'none' }}
              >
                <ButtonGroup>
                  <Button onClick={(e) => { this.editActive(e) }}>
                    <Icon type="edit" />                  
                    编辑节点
                  </Button>
                  <Button onClick={this.editComplete}>
                    <Icon type="save" />
                    属性/样式
                  </Button>
                  <Button onClick={this.editDelete}>
                    <Icon type="delete" />
                    删除
                  </Button>
                  <Button onClick={this.editUndo}>
                    <Icon type="arrow-left" />
                    撤销
                  </Button>
                  <Button onClick={this.editRedo}>
                    <Icon type="arrow-right" />
                    恢复
                  </Button>
                  <Button onClick={this.editClear}>
                    <Icon type="radius-setting" />
                    清除
                  </Button>
                </ButtonGroup>
              </div>
            ) : (
                <div id="editcontainer" />
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ layerList, agsmap }) => {
  return { layerList, agsmap };
})(PoltPanel);
