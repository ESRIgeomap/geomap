//pensiveant:标绘组件

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, InputNumber, Slider, Input, Select, message, Divider } from 'antd';
import SketchPicker from 'react-color';

import styles from './PoltToolBar.less';
import {
  LAYERLIST_POLT_BYTYPE,
  POLT_EDITOR_REMOVE,
  POLT_EDIT_CLEAR,
} from '../../../constants/action-types';
import poltUtils from '../../../utils/poltUtils';

const { Option } = Select;
const PoltToolBar = props => {
  const [comheight, setComheight] = useState(400);
  const [settingssvisible, setSettingssvisible] = useState(false);
  // const [activePoltType, setActivePoltType] = useState('');
  const [pointparam, setPointparam] = useState({
    fillColorPickerVisible: false,
    borderColorPickerVisible: false,
    fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    fillsize: 5,
    opacity: 0.5,
    bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    bordersize: 1,
    pointimg: '',
  });
  const [lineparam, setLineparam] = useState({
    fillColorPickerVisible: false,
    opacity: 0.5,
    fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    fillsize: 1,
    linetype: 'solid',
  });
  const [polygonparam, setPolygonparam] = useState({
    fillColorPickerVisible: false,
    borderColorPickerVisible: false,
    fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    opacity: 0.5,
    bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    bordersize: 1,
  });
  const [textparam, setTextparam] = useState({
    fillColorPickerVisible: false,
    text: '文本',
    fillsize: 18,
    fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
  });

  useEffect(() => {
    const height = document.body.clientHeight - 240;
    setComheight(height);
  });
  useEffect(() => {
    actionPolt();
  }, [textparam.text, lineparam.linetype]);

  // 清除所有标绘图层
  const clearAll = () => {
    deActivePolt();
    props.dispatch({
      type: POLT_EDITOR_REMOVE,
    });
    props.dispatch({
      type: POLT_EDIT_CLEAR,
    });
    props.dispatch({
      type: 'agsmap/identifyChangeState',
      payload: !props.agsmap.identifyflags,
    });
  };
  // 销毁标绘状态
  const deActivePolt = () => {
    props.setActivePoltType('');
    poltUtils.deactivePolt();
  };

  //标绘，点击各种绘制图形图标回调
  const poltByType = e => {
    const type = e && e.target.dataset.polttype;
    if (props.activePoltType === type) {
      poltUtils.deactivePolt();
      props.setActivePoltType('');
    } else {
      props.setActivePoltType(type);

      props.dispatch({
        type: LAYERLIST_POLT_BYTYPE,
        payload: {
          type,
          symbolparam: {
            pointparam,
            lineparam,
            polygonparam,
            textparam,
          },
        },
      });
    }
  };
  //激活标绘
  const actionPolt = () => {
    props.dispatch({
      type: LAYERLIST_POLT_BYTYPE,
      payload: {
        type: props.activePoltType,
        symbolparam: {
          pointparam,
          lineparam,
          polygonparam,
          textparam,
        },
      },
    });
  };
  // 显示高级设置
  const showAdvanceSetting = e => {
    if (props.activePoltType === '') {
      message.warn('请先选择标绘模式');
      return;
    }
    setSettingssvisible(!settingssvisible);
  };

  // 设置事件
  // 点大小回调
  const onpointFillSizeChange = value => {
    const {} = pointparam;
    const s = {
      ...pointparam,
      fillsize: value,
    };
    setPointparam(s);
    actionPolt();
  };
  // 显示点色选择器
  const showpointFillColorPicker = () => {
    const s = {
      ...pointparam,
      fillColorPickerVisible: !pointparam.fillColorPickerVisible,
    };
    setPointparam(s);
    actionPolt();
  };
  // 点颜色变化回调
  const onpointFillColorChange = hex => {
    const s = {
      ...pointparam,
      fillcolor: hex,
    };
    setPointparam(s);
    actionPolt();
  };
  // 点透明度变化
  const onpointOpacityChange = value => {
    const s = {
      ...pointparam,
      opacity: value / 100,
    };
    setPointparam(s);
    actionPolt();
  };
  // 显示点边框色拾取器
  const showpointBorderColorPickerBorder = () => {
    const s = {
      ...pointparam,
      borderColorPickerVisible: !pointparam.borderColorPickerVisible,
    };
    setPointparam(s);
    actionPolt();
  };
  // 点框色变化回调
  const onpointBorderColorChange = hex => {
    const s = {
      ...pointparam,
      bordercolor: hex,
    };
    setPointparam(s);
    actionPolt();
  };
  // 点框大小变化回调
  const onpointBorderSizeChange = value => {
    const s = {
      ...pointparam,
      bordersize: value,
    };
    setPointparam(s);
    actionPolt();
  };
  // 线
  // 线宽变化回调
  const onlineFillSizeChange = value => {
    const s = {
      ...lineparam,
      fillsize: value,
    };
    setLineparam(s);
    actionPolt();
  };
  // 显示色拾取器
  const showlineFillColorPicker = () => {
    const s = {
      ...lineparam,
      fillColorPickerVisible: !lineparam.fillColorPickerVisible,
    };
    setLineparam(s);
    actionPolt();
  };
  // 线色变化回调
  const onlineFillColorChange = hex => {
    const s = {
      ...lineparam,
      fillcolor: hex,
    };
    setLineparam(s);
    actionPolt();
  };
  // 线型变化回调
  const onLineTypeChange = value => {
    // setState(
    //   {
    //     lineparam: {
    //       ...lineparam,
    //       linetype: value,
    //     },
    //   },
    //   () => {
    //     actionPolt();
    //   }
    // );

    const s = {
      ...lineparam,
      linetype: value,
    };
    setLineparam(s);
  };
  // 线透明度变化回调
  const onlineOpacityChange = value => {
    const s = {
      ...lineparam,
      opacity: value / 100,
    };
    setLineparam(s);
    actionPolt();
  };

  // 面
  // 显示面色拾取器
  const showpolygonFillColorPicker = () => {
    setPolygonparam({
      ...polygonparam,
      fillColorPickerVisible: !polygonparam.fillColorPickerVisible,
    });
    actionPolt();
  };
  // 面色变化回调
  const onpolygonFillColorChange = hex => {
    setPolygonparam({
      ...polygonparam,
      fillcolor: hex,
    });
    actionPolt();
  };
  // 面透明度变化回调
  const onpolygonOpacityChange = value => {
    setPolygonparam({
      ...polygonparam,
      opacity: value / 100,
    });
    actionPolt();
  };
  // 显示面框色拾取器
  const showpolygonBorderColorPickerBorder = () => {
    setPolygonparam({
      ...polygonparam,
      borderColorPickerVisible: !polygonparam.borderColorPickerVisible,
    });
    actionPolt();
  };
  // 面框色变化回调
  const onpolygonBorderColorChange = hex => {
    setPolygonparam({
      ...polygonparam,
      bordercolor: hex,
    });
    actionPolt();
  };
  // 面框大小变化回调
  const onpolygonBorderSizeChange = value => {
    setPolygonparam({
      ...polygonparam,
      bordersize: value,
    });
    actionPolt();
  };
  //字体
  // 文字变化回调
  const onTextChange = e => {
    const value = e.target.value;
    setTextparam({
      ...textparam,
      text: value,
    });
  };
  // 显示字体色拾取器
  const showtextFillColorPicker = () => {
    setTextparam({
      ...textparam,
      fillColorPickerVisible: !textparam.fillColorPickerVisible,
    });
    actionPolt();
  };
  // 字体色变化回调
  const ontextFillColorChange = hex => {
    setTextparam({
      ...textparam,
      fillcolor: hex,
    });
    actionPolt();
  };
  // 字体大小
  const ontextFillSizeChange = value => {
    setTextparam({
      ...textparam,
      fillsize: value,
    });
    actionPolt();
  };

  const marks = {
    0: '0%',
    50: '50%',
    100: '100%',
  };
  return (
    <div className={styles.wrap} style={{ height: comheight }}>
      {/*<span>标绘模式:</span>*/}

      <div className={styles.barsdiv}>
        <div className={styles.bars}>
          <Tooltip title="绘点">
            <div
              className={
                props.activePoltType === 'point'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="point"
                data-mode="simple"
                onClick={poltByType}
                className={styles.point}
              />
            </div>
          </Tooltip>
          <Tooltip title="绘线">
            <div
              className={
                props.activePoltType === 'polyline'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="polyline"
                data-mode="simple"
                onClick={poltByType}
                className={styles.polyline}
              />
            </div>
          </Tooltip>
          <Tooltip title="绘面">
            <div
              className={
                props.activePoltType === 'polygon'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="polygon"
                data-mode="simple"
                onClick={poltByType}
                className={styles.polygon}
              />
            </div>
          </Tooltip>
          <Tooltip title="矩形">
            <div
              className={
                props.activePoltType === 'rectangle'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="rectangle"
                data-mode="simple"
                onClick={poltByType}
                className={styles.rectangle}
              />
            </div>
          </Tooltip>
          <Tooltip title="圆形">
            <div
              className={
                props.activePoltType === 'circle'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="circle"
                data-mode="simple"
                onClick={poltByType}
                className={styles.circle}
              />
            </div>
          </Tooltip>
          <Tooltip title="普通箭头">
            <div
              className={
                props.activePoltType === 'general_arrow'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="general_arrow"
                data-mode="simple"
                onClick={poltByType}
                className={styles.general_arrow}
              />
            </div>
          </Tooltip>
          <Tooltip title="双箭头">
            <div
              className={
                props.activePoltType === 'double_arrow'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="double_arrow"
                data-mode="simple"
                onClick={poltByType}
                className={styles.double_arrow}
              />
            </div>
          </Tooltip>
          <Tooltip title="燕尾箭头">
            <div
              className={
                props.activePoltType === 'swallowtail_arrow'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="swallowtail_arrow"
                data-mode="simple"
                onClick={poltByType}
                className={styles.swallowtail_arrow}
              />
            </div>
          </Tooltip>
          <Tooltip title="文字">
            <div
              className={
                props.activePoltType === 'font'
                  ? [styles.bar, styles.selected].join(' ')
                  : styles.bar
              }
            >
              <div
                data-polttype="font"
                data-mode="font"
                onClick={poltByType}
                className={styles.font}
              />
            </div>
          </Tooltip>
          <Tooltip title="清除">
            <div className={styles.bar}>
              <div data-polttype="clear" data-mode="" onClick={clearAll} className={styles.clear} />
            </div>
          </Tooltip>
        </div>
      </div>

      <div>
        {/* 高级设置 */}
        {/* 点 */}
        <div
          style={{
            display: ['point'].includes(props.activePoltType) ? 'block' : 'none',
          }}
        >
          {/* 颜色 */}
          <div className={styles.settingdiv}>
            <div className={styles.leftsetting}>符号颜色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                style={{ background: pointparam.fillcolor.hex }}
                onClick={showpointFillColorPicker}
              />
              {pointparam.fillColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showpointFillColorPicker} />
                  <SketchPicker color={pointparam.fillcolor} onChange={onpointFillColorChange} />
                </div>
              ) : null}
            </div>
            <div className={styles.morediv}>
              <a onClick={showAdvanceSetting}>高级设置</a>
            </div>
          </div>
          {/* 颜色 */}

          <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
          {/* 大小 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>符号大小：</div>
            <div className={styles.rightsetting}>
              <InputNumber
                min={1}
                max={50}
                defaultValue={pointparam.fillsize}
                onChange={onpointFillSizeChange}
              />
            </div>
          </div>
          {/* 大小 */}
          {/* 透明度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>透 明 度：</div>
            <div className={styles.rightsetting}>
              <Slider
                marks={marks}
                min={0}
                max={100}
                defaultValue={pointparam.opacity * 100}
                onChange={onpointOpacityChange}
              />
            </div>
          </div>

          {/* 透明度 */}
          {/* 轮廓颜色 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>轮廓颜色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                style={{ background: pointparam.bordercolor.hex }}
                onClick={showpointBorderColorPickerBorder}
              />
              {pointparam.borderColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showpointBorderColorPickerBorder} />
                  <SketchPicker
                    color={pointparam.bordercolor}
                    onChange={onpointBorderColorChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {/* 轮廓颜色 */}
          {/* 轮廓宽度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>轮廓宽度：</div>
            <div className={styles.rightsetting}>
              <InputNumber min={0} max={20} defaultValue={2} onChange={onpointBorderSizeChange} />
            </div>
          </div>
          {/* 轮廓宽度 */}
        </div>
        {/* 线 */}
        <div
          style={{
            display: ['polyline'].includes(props.activePoltType) ? 'block' : 'none',
          }}
        >
          {/* 颜色 */}
          <div className={styles.settingdiv}>
            <div className={styles.leftsetting}>符号颜色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                style={{ background: lineparam.fillcolor.hex }}
                onClick={showlineFillColorPicker}
              />
              {lineparam.fillColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showlineFillColorPicker} />
                  <SketchPicker color={lineparam.fillcolor} onChange={onlineFillColorChange} />
                </div>
              ) : null}
            </div>
            <div className={styles.morediv}>
              <a onClick={showAdvanceSetting}>高级设置</a>
            </div>
          </div>
          {/* 颜色 */}
          <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
          {/* 宽度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>线 宽：</div>
            <div className={styles.rightsetting}>
              <InputNumber
                min={1}
                max={50}
                defaultValue={lineparam.fillsize}
                onChange={onlineFillSizeChange}
              />
            </div>
          </div>
          {/* 宽度 */}

          {/* 样式 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>线 型：</div>{' '}
            <div className={styles.rightsetting}>
              <Select defaultValue="solid" onChange={onLineTypeChange}>
                <Option value="solid">实线</Option>
                <Option value="short-dot">虚线</Option>
              </Select>
            </div>
          </div>
          {/* 样式 */}

          {/* 透明度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>透 明 度 ：</div>
            <div className={styles.rightsetting}>
              <Slider
                marks={marks}
                min={0}
                max={100}
                defaultValue={lineparam.opacity * 100}
                onChange={onlineOpacityChange}
              />
            </div>
          </div>
          {/* 透明度 */}
        </div>
        {/* 线 */}
        {/* 面 */}
        <div
          style={{
            display: [
              'polygon',
              'polygon',
              'rectangle',
              'circle',
              'general_arrow',
              'double_arrow',
              'swallowtail_arrow',
            ].includes(props.activePoltType)
              ? 'block'
              : 'none',
          }}
        >
          {/* 颜色 */}
          <div className={styles.settingdiv}>
            <div className={styles.leftsetting}>填充颜色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                style={{ background: polygonparam.fillcolor.hex }}
                onClick={showpolygonFillColorPicker}
              />
              {polygonparam.fillColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showpolygonFillColorPicker} />
                  <SketchPicker
                    color={polygonparam.fillcolor}
                    onChange={onpolygonFillColorChange}
                  />
                </div>
              ) : null}
            </div>
            <div className={styles.morediv}>
              <a onClick={showAdvanceSetting}>高级设置</a>
            </div>
          </div>
          {/* 颜色 */}
          <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
          {/* 透明度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>透明度：</div>
            <div className={styles.rightsetting}>
              <Slider
                marks={marks}
                min={0}
                max={100}
                defaultValue={polygonparam.opacity * 100}
                onChange={onpolygonOpacityChange}
              />
            </div>
          </div>
          {/* 透明度 */}

          {/* 轮廓颜色 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>轮廓颜色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                defaultValue={polygonparam.opacity * 100}
                style={{ background: polygonparam.bordercolor.hex }}
                onClick={showpolygonBorderColorPickerBorder}
              />
              {polygonparam.borderColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showpolygonBorderColorPickerBorder} />
                  <SketchPicker
                    color={polygonparam.bordercolor}
                    onChange={onpolygonBorderColorChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {/* 轮廓颜色 */}

          {/* 轮廓宽度 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>轮廓宽度：</div>
            <div className={styles.rightsetting}>
              <InputNumber min={0} max={20} defaultValue={2} onChange={onpolygonBorderSizeChange} />
            </div>
          </div>
          {/* 轮廓宽度 */}
        </div>
        {/* 面 */}
        {/* 文本 */}
        <div
          style={{
            display: ['font'].includes(props.activePoltType) ? 'block' : 'none',
          }}
        >
          {/* 文本 */}
          <div className={styles.settingdiv}>
            <div className={styles.leftsetting}>文本内容：</div>{' '}
            <div className={styles.rightsetting}>
              <Input value={textparam.text} onChange={onTextChange} />
            </div>
            <div className={styles.morediv}>
              <a onClick={showAdvanceSetting}>高级设置</a>
            </div>
          </div>
          {/* 文本 */}
          <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
          {/* 字体颜色 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>颜 色：</div>
            <div className={styles.rightsetting}>
              <div
                className={styles.fillcolor}
                style={{ background: textparam.fillcolor.hex }}
                onClick={showtextFillColorPicker}
              />
              {textparam.fillColorPickerVisible ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={showtextFillColorPicker} />
                  <SketchPicker color={textparam.fillcolor} onChange={ontextFillColorChange} />
                </div>
              ) : null}
            </div>
          </div>
          {/* 字体颜色 */}

          {/* 字体大小 */}
          <div
            className={styles.settingdiv}
            style={{ display: settingssvisible ? 'block' : 'none' }}
          >
            <div className={styles.leftsetting}>大小：</div>
            <div className={styles.rightsetting}>
              <InputNumber
                min={1}
                max={50}
                defaultValue={textparam.fillsize}
                onChange={ontextFillSizeChange}
              />
            </div>
          </div>
          {/* 字体大小 */}
        </div>
        {/* 文本 */}

        {/*    高级设置 */}
      </div>
      <div id="geosymbol" />
      <div id="geoattr" />
    </div>
  );
};
PoltToolBar.propTypes = {};
export default connect(({ agsmap }) => {
  return { agsmap };
})(PoltToolBar);
