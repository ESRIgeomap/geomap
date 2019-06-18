import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { message, Divider, Input, Button } from 'antd';
import styles from './GeometryAttribute.less';

const GeometryAttribute = props => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  useEffect(() => {
    if (props.geo) {
      setName(props.geo.attributes && props.geo.attributes.name);
      setDescription(props.geo.attributes && props.geo.attributes.description);
      setType(props.geo.attributes && props.geo.attributes.type);
    } else {
      message.warn('请选择图形');
      return;
    }
  }, []);

  // 确定保存要素属性
  const handleOk = async () => {
    const attributes = {
      name: name,
      type: type,
      description: description,
    };
    props.geo.attributes = attributes;

    ReactDom.unmountComponentAtNode(document.getElementById('geoattr'));
    ReactDom.unmountComponentAtNode(document.getElementById('geosymbol'));
  };
  // 取消保存要素属性
  const handleCancel = () => {
    ReactDom.unmountComponentAtNode(document.getElementById('geoattr'));
    ReactDom.unmountComponentAtNode(document.getElementById('geosymbol'));
  };
  //名称变化回调
  const nameValueChange = e => {
    const value = e.target.value;
    setName(value);
  };
  //类型变化回调
  const typeValueChange = e => {
    const value = e.target.value;
    setType(value);
  };
  //描述变化回调
  const descriptionValueChange = e => {
    const value = e.target.value;
    setDescription(value);
  };

  return (
    <div className={styles.wrap}>
      <Divider />

      <h4 className={styles.title}>属性设置:</h4>

      <div className={styles.settingdiv}>
        <div className={styles.leftsetting}>名称：</div>
        <div className={styles.rightsetting}>
          {' '}
          <Input value={name} onChange={nameValueChange} />
        </div>
      </div>

      <div className={styles.settingdiv}>
        <div className={styles.leftsetting}>类型：</div>
        <div className={styles.rightsetting}>
          {' '}
          <Input value={type} onChange={typeValueChange} />
        </div>
      </div>

      <div className={styles.settingdiv}>
        <div className={styles.leftsetting}>简述：</div>
        <div className={styles.rightsetting}>
          {' '}
          <Input value={description} onChange={descriptionValueChange} />
        </div>
      </div>

      <div className={styles.settingdiv}>
        <div className={styles.leftsetting} />
        <div className={styles.rightsetting}>
          <Button type="primary" onClick={handleOk}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
};

GeometryAttribute.propTypes = {
  geo: PropTypes.object,
};
export default GeometryAttribute;
