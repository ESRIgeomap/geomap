/**
 * 统计面板组件
 * @author  pensiveant
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.css';
import { Table, Icon } from 'antd';

const QueryResult3D = ({ visible, closeSearchResultPanle }) => {
  const [totalRecord, setTotalRecord] = useState(50);

  /**
   * 关闭点击回调
   * @author pensiveant
   */
  const queryResultClose = e => {
    closeSearchResultPanle();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      title: '房主',
      dataIndex: 'houseOwner',
    },
    {
      title: '房屋面积',
      dataIndex: 'houseArea',
    },
    {
      title: '占地面积',
      dataIndex: 'occupyArea',
    },
    {
      title: '楼高',
      key: 'action',
      dataIndex: 'buildingHeight',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '拆迁状态',
      dataIndex: 'state',
    },
  ];

  const data = [
    {
      key: '1',
      ID: 1,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '2',
      ID: 2,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '3',
      ID: 3,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '4',
      ID: 4,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '5',
      ID: 5,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '6',
      ID: 6,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '7',
      ID: 7,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '8',
      ID: 8,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '9',
      ID: 9,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
    {
      key: '10',
      ID: 10,
      houseOwner: '张三',
      houseArea: 155,
      occupyArea: 98,
      buildingHeight: 5.5,
      address: '龙潭路5号',
      state: '未拆迁',
    },
  ];

  const paginationConfig = {
    total: totalRecord,
    showSizeChanger: true,
    showQuickJumper: true,
  };

  return (
    <div
      className={styles.queryResult3D}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.queryClose} onClick={queryResultClose}>
        <Icon type="close" />
      </div>
      <div className={styles.tableContainer}>
        <Table columns={columns} dataSource={data} bordered={true} pagination={paginationConfig} />
      </div>
    </div>
  );
};

export default connect(({ queryResult3D }) => {
  return {
    queryResult3D,
  };
})(QueryResult3D);
