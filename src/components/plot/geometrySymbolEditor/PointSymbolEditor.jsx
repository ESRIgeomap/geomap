import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
import { InputNumber, Slider, message, Divider } from 'antd';
import styles from './PointSymbolEditor.less';
import common from '../../../utils/common';

const PointSymbolEditor = props => {
  const [settingssvisible, setSettingssvisible] = useState(true);
  const [fillColorPickerVisible, setSetfillColorPickerVisible] = useState(false);
  const [borderColorPickerVisible, setBorderColorPickerVisible] = useState(false);
  const [fillcolor, setFillcolor] = useState({ hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } });
  const [fillsize, setFillsize] = useState(5);
  const [opacity, setOpacity] = useState(0.5);
  const [bordercolor, setBordercolor] = useState({
    hex: '#1890ff',
    rgb: { r: 32, g: 142, b: 245 },
  });
  const [bordersize, setBordersize] = useState(1);

  useEffect(() => {
    const symbol = props.geometry.symbol;
    setOpacity(symbol.color.a);
    setFillcolor({ hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color });
    setFillsize(symbol.size);
    setBordercolor({ hex: common.colorRGB2Hex(symbol.outline.color), rgb: symbol.outline.color });
    setBordersize(symbol.outline.width);
  }, []);

  // 显示填充色选择器
  const showpointFillColorPicker = () => {
    setSetfillColorPickerVisible(!fillColorPickerVisible);
  };
  // 显示边框色选择器
  const showpointBorderColorPickerBorder = () => {
    setBorderColorPickerVisible(!borderColorPickerVisible);
  };
  //填充色变化回调
  const onpointFillColorChange = color => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.color.r = color.rgb.r;
      newGeo.symbol.color.g = color.rgb.g;
      newGeo.symbol.color.b = color.rgb.b;
      props.geometry.symbol = newGeo.symbol;

      setFillcolor(color);
    }
  };
  //点大小变化回调
  const onpointFillSizeChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.size = value;
      props.geometry.symbol = newGeo.symbol;

      setFillsize(value);
    }
  };
  // 透明度变化回调
  const onpointOpacityChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.color.a = value / 100;
      props.geometry.symbol = newGeo.symbol;

      setOpacity(value / 100);
    }
  };
  // 边框色变化回调
  const onpointBorderColorChange = color => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.outline.color.r = color.rgb.r;
      newGeo.symbol.outline.color.g = color.rgb.g;
      newGeo.symbol.outline.color.b = color.rgb.b;
      props.geometry.symbol = newGeo.symbol;

      setBordercolor(color);
    }
  };
  //边框大小变化回调
  const onpointBorderSizeChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.outline.width = value;
      props.geometry.symbol = newGeo.symbol;

      setBordersize(value);
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
            onClick={showpointFillColorPicker}
          />
          {fillColorPickerVisible ? (
            <div className={styles.popover}>
              <div className={styles.cover} onClick={showpointFillColorPicker} />
              <SketchPicker color={fillcolor} onChange={onpointFillColorChange} />
            </div>
          ) : null}
        </div>
      </div>
      {/* 颜色 */}

      <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
      {/* 大小 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>符号大小：</div>
        <div className={styles.rightsetting}>
          <InputNumber min={1} max={50} value={fillsize} onChange={onpointFillSizeChange} />
        </div>
      </div>
      {/* 大小 */}
      {/* 透明度 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>透明度：</div>
        <div className={styles.rightsetting}>
          <Slider
            marks={marks}
            min={0}
            max={100}
            value={opacity * 100}
            onChange={onpointOpacityChange}
          />
        </div>
      </div>

      {/* 透明度 */}
      {/* 轮廓颜色 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>轮廓颜色：</div>
        <div className={styles.rightsetting}>
          <div
            className={styles.fillcolor}
            style={{ background: bordercolor.hex }}
            onClick={showpointBorderColorPickerBorder}
          />
          {borderColorPickerVisible ? (
            <div className={styles.popover}>
              <div className={styles.cover} onClick={showpointBorderColorPickerBorder} />
              <SketchPicker color={bordercolor} onChange={onpointBorderColorChange} />
            </div>
          ) : null}
        </div>
      </div>
      {/* 轮廓颜色 */}
      {/* 轮廓宽度 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>
          {/* {formatMessage({ id: 'plottoolbar.outlinewidth' })}： */}
          轮廓宽度:
        </div>
        <div className={styles.rightsetting}>
          <InputNumber min={0} max={20} value={bordersize} onChange={onpointBorderSizeChange} />
        </div>
      </div>
      {/* 轮廓宽度 */}
    </div>
  );
};

PointSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default PointSymbolEditor;
