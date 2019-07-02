
/**
 * 单个资源Item子组件
 * @author  pensiveant
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Button, Radio, Icon } from 'antd';
import DataImg from './img/data.png';




const DataItem = (props) => {



    return (
        <div className={styles.dataItem}>
            <div className={styles.map}><img src={DataImg} alt='data' style={{width:'100%',height:'100%'}}/></div>
            <p className={styles.title}>{props.title}</p>
            <p className={styles.type}>{props.type}</p>
            <p className={styles.modifyTime}>{props.modifyTime}</p>
        </div>
    );
}

export default DataItem;