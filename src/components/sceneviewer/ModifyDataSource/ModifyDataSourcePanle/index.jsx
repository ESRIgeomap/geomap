/**
 * 修改数据源面板
 * @author  pensiveant
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Button, Radio, Icon } from 'antd';

import DataItem from './component/dataItem';

const ModifyDataSourcePanle = ({ visible, closeModifyDataSourcePanle }) => {
  const [dataType, setDataType] = useState(''); //数据类型标识
  const [dataSource, setDataSource] = useState([
    {
      title: '南京BIMGIS制作的shapefile文件',
      type: 'WebScene',
      modifyTime: '2019-6-20 08:27:36',
    },
  ]); //数据源

  /**
   * 关闭面板
   * @author pensiveant
   */
  const closePannel = e => {
    closeModifyDataSourcePanle();
  };

  /**
   * 切换不同数据源点击回调
   * @author pensiveant
   */
  const handleDataSourceChange = e => {
    setDataType(e.target.value);
  };

  return (
    <div
      className={styles.chooseDataSource}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <div className={styles.close} onClick={closePannel}>
        <Icon type="close" />
      </div>
      <p className={styles.title}>修改数据源</p>
      <div className={styles.dataType}>
        <Radio.Group value={dataType} onChange={handleDataSourceChange}>
          <Radio.Button
            className={[styles.typeItem, 'webscene' === dataType ? styles.dataChoosed : '']}
            value="webscene"
          >
            选择WebScenen切换场景
          </Radio.Button>
          <Radio.Button
            className={[styles.typeItem, 'feature' === dataType ? styles.dataChoosed : '']}
            value="feature"
          >
            选择要素图层添加到场景
          </Radio.Button>
          <Radio.Button
            className={[styles.typeItem, 'scene' === dataType ? styles.dataChoosed : '']}
            value="scene"
          >
            选择场景图层添加到场景
          </Radio.Button>
          <Radio.Button
            className={[styles.typeItem, 'url' === dataType ? styles.dataChoosed : '']}
            value="url"
          >
            通过图层url添加到场景
          </Radio.Button>
        </Radio.Group>
      </div>
      <p className={styles.totalNum}>总共搜出60个WebScene资源</p>
      <div className={styles.map}>
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
        <DataItem
          title={dataSource[0].title}
          type={dataSource[0].type}
          modifyTime={dataSource[0].modifyTime}
        />
      </div>
      <div className={styles.cancelOkBtn}>
        <Button>确定</Button>
        <Button>取消</Button>
      </div>
    </div>
  );
};

export default ModifyDataSourcePanle;
