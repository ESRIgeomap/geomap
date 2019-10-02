import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
import { InputNumber, Slider, Select, Divider } from 'antd';
import styles from './PolyLineSymbolEditor.less';
import common from '../../../utils/common';

const PolyLineSymbolEditor = props => {
  const [settingssvisible, setSettingssvisible] = useState(true);
  const [fillColorPickerVisible, setfillColorPickerVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.5);
  const [fillcolor, setFillcolor] = useState({ hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } });
  const [fillsize, setFillsize] = useState(1);
  const [linetype, setLinetype] = useState('solid');

  useEffect(() => {
    const symbol = props.geometry.symbol;
    setOpacity(symbol.color.a);
    setFillcolor({ hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color });
    setFillsize(symbol.width);
    setLinetype(symbol.style);
  }, []);
  // 显示线颜色选择器
  const showlineFillColorPicker = () => {
    setfillColorPickerVisible(!fillColorPickerVisible);
  };
  // 线颜色变化回调
  const onlineFillColorChange = color => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.color.r = color.rgb.r;
      newGeo.symbol.color.g = color.rgb.g;
      newGeo.symbol.color.b = color.rgb.b;
      props.geometry.symbol = newGeo.symbol;

      setFillcolor(color);
    }
  };
  // 线宽变化回调
  const onlineFillSizeChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.width = value;
      props.geometry.symbol = newGeo.symbol;

      setFillsize(value);
    }
  };
  // 线类型变化回调
  const onLineTypeChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.style = value;
      props.geometry.symbol = newGeo.symbol;

      setLinetype(value);
    }
  };
  // 透明度变化回调
  const onlineOpacityChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.color.a = value / 100;
      props.geometry.symbol = newGeo.symbol;

      setOpacity(value / 100);
    }
  };

  const marks = {
    0: '0%',
    50: '50%',
    100: '100%',
  };
  return (
    <div>
      {/* 颜色 */}
      <div className={styles.settingdiv}>
        <div className={styles.leftsetting}>符号颜色：</div>
        <div className={styles.rightsetting}>
          <div
            className={styles.fillcolor}
            style={{ background: fillcolor.hex }}
            onClick={showlineFillColorPicker}
          />
          {fillColorPickerVisible ? (
            <div className={styles.popover}>
              <div className={styles.cover} onClick={showlineFillColorPicker} />
              <SketchPicker color={fillcolor} onChange={onlineFillColorChange} />
            </div>
          ) : null}
        </div>
      </div>
      {/* 颜色 */}
      <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
      {/* 宽度 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>线宽：</div>
        <div className={styles.rightsetting}>
          <InputNumber min={1} max={50} value={fillsize} onChange={onlineFillSizeChange} />
        </div>
      </div>
      {/* 宽度 */}

      {/* 样式 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>线型：</div>{' '}
        <div className={styles.rightsetting}>
          <Select value={linetype} onChange={onLineTypeChange}>
            <Option value="solid">实线</Option>
            <Option value="short-dot">虚线</Option>
          </Select>
        </div>
      </div>
      {/* 样式 */}

      {/* 透明度 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>透明度：</div>
        <div className={styles.rightsetting}>
          <Slider
            marks={marks}
            min={0}
            max={100}
            value={opacity * 100}
            onChange={onlineOpacityChange}
          />
        </div>
      </div>
      {/* 透明度 */}
    </div>
  );
};

PolyLineSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default PolyLineSymbolEditor;
