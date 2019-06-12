import React from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
//import { formatMessage } from 'umi/locale';
import { InputNumber,  message, Input, Divider } from 'antd';
import styles from './PointSymbolEditor.less';
import common from '../../utils/common';

class TextSymbolEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingssvisible: true,
      fillColorPickerVisible: false,
      text: '文本',
      fillsize: 18,
      fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
    };
  }
  componentDidMount() {
    const symbol = this.props.geometry.symbol;
    this.setState({
      opacity: symbol.color.a,
      fillcolor: { hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color },
      fillsize: symbol.font.size,
      text: symbol.text,
    });
  }
  showtextFillColorPicker = () => {
    this.setState({
      fillColorPickerVisible: !this.state.fillColorPickerVisible,
    });
  };
  onTextChange = e => {
    if (this.props.geometry) {
      const value = e.target.value;
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.text = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        text: value,
      });
    }
  };
  ontextFillColorChange = color => {
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

  ontextFillSizeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.font.size = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        fillsize: value,
      });
    }
  };

  render() {
    return (
      <div>
        {/* 文本 */}
        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
            文本内容：
          </div>{' '}
          <div className={styles.rightsetting}>
            <Input value={this.state.text} onChange={this.onTextChange} />
          </div>
        </div>
        {/* 文本 */}
        <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
        {/* 字体颜色 */}
        <div
          className={styles.settingdiv}
          style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
        >
          <div className={styles.leftsetting}>
            颜色：
          </div>
          <div className={styles.rightsetting}>
            <div
              className={styles.fillcolor}
              style={{ background: this.state.fillcolor.hex }}
              onClick={this.showtextFillColorPicker}
            />
            {this.state.fillColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showtextFillColorPicker} />
                <SketchPicker color={this.state.fillcolor} onChange={this.ontextFillColorChange} />
              </div>
            ) : null}
          </div>
        </div>
        {/* 字体颜色 */}

        {/* 字体大小 */}
        <div
          className={styles.settingdiv}
          style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
        >
          <div className={styles.leftsetting}>
            大小：
          </div>
          <div className={styles.rightsetting}>
            <InputNumber
              min={1}
              max={50}
              value={this.state.fillsize}
              onChange={this.ontextFillSizeChange}
            />
          </div>
        </div>
        {/* 字体大小 */}
      </div>
    );
  }
}

TextSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default TextSymbolEditor;
