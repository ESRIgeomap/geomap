import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import arcgis from '../../../utils/arcgis';
import { Layout, Icon, Button, Popover, Tabs } from 'antd';
import CustomScroll from 'react-custom-scrollbars';
import styles from './index.less';
import MeasureArea3D from './components/MeasureArea3D';
import MeasureLine3D from './components/MeasureLine3D';
import Slice3D from './components/Slice3D';
import changebasemap from './images/icon_measure1.png';
import changebasemap1 from './images/icon_measure2.png';

const { TabPane } = Tabs;

const Measure3Dbutton = ({ dispatch, agsmap }) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(null);
  const [content2, setContent2] = useState(null);
  const [content3, setContent3] = useState(null);
  //   const view = window.agsGlobal.view;
  const neasureVisible = () => {
    setVisible(!visible);

    dispatch({
      type: 'agsmap/shanchuweijian2',
      payload: visible,
    });
    dispatch({
      type: 'agsmap/shanchuweijian',
      payload: visible,
    });
    dispatch({
      type: 'agsmap/shanchuweijian3',
      payload: visible,
    });
  };
  useEffect(() => {
    if (arcgis.isViewReady()) {
      setContent(renderMenus());
      setContent2(renderMenus2());
      setContent3(renderMenus3());
    } else {
      const timer = setInterval(() => {
        if (arcgis.isViewReady()) {
          clearInterval(timer);
          setContent(renderMenus());
          setContent2(renderMenus2());
          setContent3(renderMenus3());
        }
      }, 300);
    }
  }, []);

  function renderMenus() {
    return <MeasureArea3D view={_.get(window.agsGlobal, 'view')} />;
  }

  function renderMenus2() {
    return <MeasureLine3D view={_.get(window.agsGlobal, 'view')} />;
  }

  function renderMenus3() {
    return <Slice3D view={_.get(window.agsGlobal, 'view')} />;
  }

  function callback(key) {
    if (key != 1) {
      dispatch({
        type: 'agsmap/shanchuweijian',
        payload: !agsmap.deactivate,
      });
      console.log(agsmap.deactivate);
    } else if (key != 2) {
      dispatch({
        type: 'agsmap/shanchuweijian2',
        payload: !agsmap.deactivate2,
      });
      console.log(agsmap.deactivate2);
    } else if (key != 3) {
      dispatch({
        type: 'agsmap/shanchuweijian3',
        payload: !agsmap.deactivate3,
      });
      console.log(agsmap.deactivate3);
    }
  }

  return (
    <div title="分析" className={styles.changebase}>
      <div className={styles.measurebox} style={{ display: visible ? 'block' : 'none' }}>
        <div className={styles.panelWrap}>
          <div className={styles.panelHead}>
            <span>分析</span>
            <span onMouseDown={neasureVisible}>
              <Icon type="close" />
            </span>
          </div>
          <div className={styles.panelContent}>
            <Tabs onChange={callback} type="card">
              <TabPane tab="测面" key="1">
                <CustomScroll autoHeight autoHeightMin={0} autoHeightMax={290}>
                  {content}
                </CustomScroll>
              </TabPane>
              <TabPane tab="测距" key="2">
                <CustomScroll autoHeight autoHeightMin={0} autoHeightMax={290}>
                  {content2}
                </CustomScroll>
              </TabPane>
              <TabPane tab="剖析" key="3">
                <CustomScroll autoHeight autoHeightMin={0} autoHeightMax={290}>
                  {content3}
                </CustomScroll>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <Button
        className={styles.basemapbutton}
        style={{ backgroundColor: visible ? '#47b479' : 'white' }}
        onClick={neasureVisible}
      >
        <img className={styles.baseIcon} src={visible ? changebasemap1 : changebasemap} />
      </Button>
      {/*</Popover>*/}
    </div>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(Measure3Dbutton);
