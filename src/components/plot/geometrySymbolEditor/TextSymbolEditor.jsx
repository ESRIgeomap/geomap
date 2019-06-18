import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
import { InputNumber, message, Input, Divider } from 'antd';
import styles from './PointSymbolEditor.less';
import common from '../../../utils/common';

const TextSymbolEditor = props => {
  const [settingssvisible, setSettingssvisible] = useState(true);
  const [fillColorPickerVisible, setFillColorPickerVisible] = useState(false);
  const [text, setText] = useState('文本');
  const [fillsize, setFillsize] = useState(18);
  const [fillcolor, setFillcolor] = useState({ hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } });

  useEffect(() => {
    const symbol = props.geometry.symbol;
    setFillcolor({ hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color });
    setFillsize(symbol.font.size);
    setText(symbol.text);
  }, []);
  // 显示字体颜色选择器
  const showtextFillColorPicker = () => {
    setFillColorPickerVisible(!fillColorPickerVisible);
  };
  // 字体变化回调
  const onTextChange = e => {
    if (props.geometry) {
      const value = e.target.value;
      const newGeo = props.geometry.clone();
      newGeo.symbol.text = value;
      props.geometry.symbol = newGeo.symbol;

      setText(value);
    }
  };
  // 字体颜色变化回调
  const ontextFillColorChange = color => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.color.r = color.rgb.r;
      newGeo.symbol.color.g = color.rgb.g;
      newGeo.symbol.color.b = color.rgb.b;
      props.geometry.symbol = newGeo.symbol;

      setFillcolor(color);
    }
  };
  // 字体大小变化回调
  const ontextFillSizeChange = value => {
    if (props.geometry) {
      const newGeo = props.geometry.clone();
      newGeo.symbol.font.size = value;
      props.geometry.symbol = newGeo.symbol;

      setFillsize(value);
    }
  };

  return (
    <div>
      {/* 文本 */}
      <div className={styles.settingdiv}>
        <div className={styles.leftsetting}>文本内容：</div>{' '}
        <div className={styles.rightsetting}>
          <Input value={text} onChange={onTextChange} />
        </div>
      </div>
      {/* 文本 */}
      <Divider style={{ display: settingssvisible ? 'block' : 'none' }} />
      {/* 字体颜色 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>颜色：</div>
        <div className={styles.rightsetting}>
          <div
            className={styles.fillcolor}
            style={{ background: fillcolor.hex }}
            onClick={showtextFillColorPicker}
          />
          {fillColorPickerVisible ? (
            <div className={styles.popover}>
              <div className={styles.cover} onClick={showtextFillColorPicker} />
              <SketchPicker color={fillcolor} onChange={ontextFillColorChange} />
            </div>
          ) : null}
        </div>
      </div>
      {/* 字体颜色 */}

      {/* 字体大小 */}
      <div className={styles.settingdiv} style={{ display: settingssvisible ? 'block' : 'none' }}>
        <div className={styles.leftsetting}>大小：</div>
        <div className={styles.rightsetting}>
          <InputNumber min={1} max={50} value={fillsize} onChange={ontextFillSizeChange} />
        </div>
      </div>
      {/* 字体大小 */}
    </div>
  );
};

TextSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default TextSymbolEditor;
