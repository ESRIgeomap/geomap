import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { message, Divider, Input, Button } from 'antd';
import styles from './GeometryAttribute.less';

class GeometryAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      type: '',
    };
  }
  componentDidMount() {
    debugger;
    if (this.props.geo) {
      this.setState({
        name: (this.props.geo.attributes && this.props.geo.attributes.name) || '',
        description: (this.props.geo.attributes && this.props.geo.attributes.description) || '',
        type: (this.props.geo.attributes && this.props.geo.attributes.type) || '',
      });
    } else {
      message.warn('请选择图形');
      return;
    }
  }
  handleOk = async () => {
    const attributes = {
      name: this.state.name,
      type: this.state.type,
      description: this.state.description,
    };
    this.props.geo.attributes = attributes;

    ReactDom.unmountComponentAtNode(document.getElementById('geoattr'));
    ReactDom.unmountComponentAtNode(document.getElementById('geosymbol'));
  };
  handleCancel = () => {
    ReactDom.unmountComponentAtNode(document.getElementById('geoattr'));
    ReactDom.unmountComponentAtNode(document.getElementById('geosymbol'));
  };
  nameValueChange = e => {
    const value = e.target.value;
    this.setState({
      name: value,
    });
  };
  typeValueChange = e => {
    const value = e.target.value;
    this.setState({
      type: value,
    });
  };
  descriptionValueChange = e => {
    const value = e.target.value;
    this.setState({
      description: value,
    });
  };
  render() {
    return (
      <div className={styles.wrap}>
        <Divider />

        <h4 className={styles.title}>属性设置:</h4>

        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
           名称：
          </div>
          <div className={styles.rightsetting}>
            {' '}
            <Input value={this.state.name} onChange={this.nameValueChange} />
          </div>
        </div>

        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
           类型：
          </div>
          <div className={styles.rightsetting}>
            {' '}
            <Input value={this.state.type} onChange={this.typeValueChange} />
          </div>
        </div>

        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
           简述：
          </div>
          <div className={styles.rightsetting}>
            {' '}
            <Input value={this.state.description} onChange={this.descriptionValueChange} />
          </div>
        </div>

        <div className={styles.settingdiv}>
          <div className={styles.leftsetting} />
          <div className={styles.rightsetting}>
            <Button type="primary" onClick={this.handleOk}>
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
GeometryAttribute.propTypes = {
  geo: PropTypes.object,
};
export default GeometryAttribute;
