import React from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
//import { formatMessage } from 'umi/locale';
import { InputNumber, Slider, message, Divider } from 'antd';
import styles from './PolyLineSymbolEditor.less';
import common from '../../utils/common';

class PolyLineSymbolEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingssvisible: true,
      fillColorPickerVisible: false,
      borderColorPickerVisible: false,
      fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      opacity: 0.5,
      bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      bordersize: 1,
    };
  }
  componentDidMount() {
    const symbol = this.props.geometry.symbol;
    this.setState({
      opacity: symbol.color.a,
      fillcolor: { hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color },
      bordercolor: { hex: common.colorRGB2Hex(symbol.outline.color), rgb: symbol.outline.color },
      bordersize: symbol.outline.width,
    });
  }
  showpolygonFillColorPicker = () => {
    this.setState({
      fillColorPickerVisible: !this.state.fillColorPickerVisible,
    });
  };
  showpolygonBorderColorPickerBorder = () => {
    this.setState({
      borderColorPickerVisible: !this.state.borderColorPickerVisible,
    });
  };
  onpolygonFillColorChange = color => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.color.r = color.rgb.r;
      newGeo.symbol.color.g = color.rgb.g;
      newGeo.symbol.color.b = color.rgb.b;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        fillcolor: color,
      });
    }
  };
  onpolygonOpacityChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.color.a = value / 100;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        opacity: value / 100,
      });
    }
  };

  onpolygonBorderColorChange = color => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.outline.color.r = color.rgb.r;
      newGeo.symbol.outline.color.g = color.rgb.g;
      newGeo.symbol.outline.color.b = color.rgb.b;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        bordercolor: color,
      });
    }
  };
  onpolygonBorderSizeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.outline.width = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        bordersize: value,
      });
    }
  };
  render() {
    const marks = {
      0: '0%',
      50: '50%',
      100: '100%',
    };
    return (
      <div>
        {/* 颜色 */}
        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
            填充颜色：
          </div>
          <div className={styles.rightsetting}>
            <div
              className={styles.fillcolor}
              style={{ background: this.state.fillcolor.hex }}
              onClick={this.showpolygonFillColorPicker}
            />
            {this.state.fillColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showpolygonFillColorPicker} />
                <SketchPicker
                  color={this.state.fillcolor}
                  onChange={this.onpolygonFillColorChange}
                />
              </div>
            ) : null}
          </div>
        </div>
        {/* 颜色 */}
        <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
        {/* 透明度 */}
        <div
          className={styles.settingdiv}
          style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
        >
          <div className={styles.leftsetting}>
            透明度：
          </div>
          <div className={styles.rightsetting}>
            <Slider
              marks={marks}
              min={0}
              max={100}
              value={this.state.opacity * 100}
              onChange={this.onpolygonOpacityChange}
            />
          </div>
        </div>
        {/* 透明度 */}

        {/* 轮廓颜色 */}
        <div
          className={styles.settingdiv}
          style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
        >
          <div className={styles.leftsetting}>
          轮廓颜色：
          </div>
          <div className={styles.rightsetting}>
            <div
              className={styles.fillcolor}
              defaultValue={this.state.opacity * 100}
              style={{ background: this.state.bordercolor.hex }}
              onClick={this.showpolygonBorderColorPickerBorder}
            />
            {this.state.borderColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showpolygonBorderColorPickerBorder} />
                <SketchPicker
                  color={this.state.bordercolor}
                  onChange={this.onpolygonBorderColorChange}
                />
              </div>
            ) : null}
          </div>
        </div>
        {/* 轮廓颜色 */}

        {/* 轮廓宽度 */}
        <div
          className={styles.settingdiv}
          style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
        >
          <div className={styles.leftsetting}>
            轮廓宽度：
          </div>
          <div className={styles.rightsetting}>
            <InputNumber
              min={0}
              max={20}
              value={this.state.bordersize}
              onChange={this.onpolygonBorderSizeChange}
            />
          </div>
        </div>
        {/* 轮廓宽度 */}
      </div>
    );
  }
}

PolyLineSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default PolyLineSymbolEditor;
