/**
 * 修改数据源面板
 * @author  Lee
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styles from './index.less';
import { Button, Radio, Icon } from 'antd';

import { searchItems } from '../../../../services/portal';

import DataItem from './component/dataItem';

const ModifyDataSourcePanle = ({ visible, closeModifyDataSourcePanle }) => {
  const [dataType, setDataType] = useState(''); //数据类型标识
  const [dataSource, setDataSource] = useState([]); //数据源

  useEffect(() => {
    initQueryWebScene();
  }, []);

  async function initQueryWebScene() {
    const q = `type: 'Web Scene'  NOT owner:{esri TO esri_zzzzz}`;
    const  response = await searchItems(q, 0, 100, 'numviews', 'desc');
    const items = response.data.results;
    items.forEach(item => {
      item.thumbnailUrl = window.appcfg.portal +'sharing/rest/content/items/' + item.id + '/info/' + item.thumbnail;
      item.modified = moment(new Date(item.modified)).format('YYYY-MM-DD HH:mm:ss');
    });
    setDataSource(items);
  }
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

   /**
   * 构造item卡图
   * @author Lee
   */
  const renderItemlist = e => {
    return dataSource.map(item => {
      return <DataItem item={item} />;
    });
  };

  return (
    <div className={styles.chooseDataSource} style={{ display: visible ? 'flex' : 'none' }}>
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
      <div className={styles.map}>{renderItemlist()}</div>
      <div className={styles.cancelOkBtn}>
        <Button>确定</Button>
        <Button>取消</Button>
      </div>
    </div>
  );
};

export default ModifyDataSourcePanle;
