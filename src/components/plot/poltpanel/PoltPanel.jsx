//pensiveant:标绘组件（包含编辑）

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Button, Tabs } from 'antd';
import styles from './PoltPanel.less';
//引入子组件
import PoltToolBar from '../poltbar/PoltToolBar';
import {
  VIEW_MODE_2D,
  POLT_EDIT_DELETE,
  POLT_EDIT_UNDO,
  POLT_EDIT_REDO,
  POLT_EDIT_CLEAR,
  POLT_EDITOR_REMOVE,
  POLT_EDIT_COMPLETE,
} from '../../../constants/action-types';
import poltUtils from '../../../utils/arcgis/plot/poltUtils';

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const PoltPanel = props => {
  const [comheight, setComheight] = useState(835);
  const [contentheight, setContentheight] = useState(799);
  const [activePoltType, setActivePoltType] = useState('');
  const domRef = useRef(null);

  useEffect(() => {
    const height = document.body.clientHeight - 150;
    setComheight(height);
    setContentheight(height - 36);
  }, []);

  //按键按下拖拽事件
  const drag = e => {
    const Drag = domRef.current;
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

  //按键松开停止拖拽
  const removeDrag = e => {
    document.onmousemove = null;
    const Drag = domRef.current;
    Drag.style.cursor = 'default';
  };

  //标绘关闭“X”回调
  const closePoltPanel = () => {
    //设置标绘组件不可见
    props.dispatch({
      type: 'layerList/changePoltPanelVisible',
      payload: false,
    });

    deActivePolt();
    props.dispatch({
      type: POLT_EDITOR_REMOVE,
    });
  };
  //销毁标绘状态
  const deActivePolt = () => {
    poltUtils.deactivePolt();
  };

  //“编辑节点”回调
  const editActive = e => {
    setActivePoltType('');
    deActivePolt();
  };

  //“属性/样式”回调
  const editComplete = e => {
    setActivePoltType('');
    props.dispatch({
      type: POLT_EDIT_COMPLETE,
    });
  };

  //“删除”回调
  const editDelete = e => {
    props.dispatch({
      type: POLT_EDIT_DELETE,
    });
  };

  //“撤销”回调
  const editUndo = e => {
    props.dispatch({
      type: POLT_EDIT_UNDO,
    });
  };

  //“恢复”回调
  const editRedo = e => {
    props.dispatch({
      type: POLT_EDIT_REDO,
    });
  };

  //“清除”回调
  const editClear = e => {
    props.dispatch({
      type: POLT_EDIT_CLEAR,
    });
  };

  return (
    <div
      style={{
        display: props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
      }}
    >
      <div style={{ display: props.layerList.poltPanelVisible ? 'block' : 'none' }}>
        <div className={styles.wrap} ref={domRef} style={{ height: comheight }}>
          <div className={styles.title} onMouseDown={drag} onMouseUp={removeDrag}>
            标绘
            <Tooltip title="关闭">
              <div onClick={closePoltPanel} className={styles.close}>
                <Icon type="close" />
              </div>
            </Tooltip>
          </div>
          <div className={styles.content} style={{ height: contentheight }}>
            <Tabs activeKey="1" style={{ height: '100%' }}>
              <TabPane tab="标绘" key="1">
                <PoltToolBar
                  setActivePoltType={setActivePoltType}
                  activePoltType={activePoltType}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.editTool}>
          {props.layerList.poltedittoolbarvisible ? (
            <div style={{ display: props.layerList.poltedittoolbarvisible ? 'block' : 'none' }}>
              <ButtonGroup>
                <Button
                  onClick={e => {
                    editActive(e);
                  }}
                >
                  <Icon type="edit" />
                  编辑节点
                </Button>
                <Button onClick={editComplete}>
                  <Icon type="save" />
                  属性/样式
                </Button>
                <Button onClick={editDelete}>
                  <Icon type="delete" />
                  删除
                </Button>
                <Button onClick={editUndo}>
                  <Icon type="arrow-left" />
                  撤销
                </Button>
                <Button onClick={editRedo}>
                  <Icon type="arrow-right" />
                  恢复
                </Button>
                <Button onClick={editClear}>
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
};

export default connect(({ layerList, agsmap }) => {
  return { layerList, agsmap };
})(PoltPanel);
