import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, message } from 'antd';
import styles from './Mapcorrect.css';
import { ACTION_ADDMAPCORRECT_2D } from '../../constants/action-types';
import { mapcorrectp } from '../../services/mapcorrectp';

// function getLcorrect() {
//   const storage = window.localStorage;
//   for (let i = 0; i < storage.length; i += 1) {
//     const key = storage.key(i);
//     console.log(key);
//   }
//   console.log(storage);
// }

// function renderBookmarks() {
//   const storage = window.localStorage;
//   return Object.keys(storage).map((key) => {
//     return (
//       <div>
//         <p
//           style={{
//             width: '280px',
//             height: '20px',
//             color: 'red',
//             backgroundColor: 'black',
//           }}
//         >
//           {storage[key]}
//         </p>
//       </div>
//     );
//   });
// }

function loadmapcorrect() {
  mapcorrectp(window.mapcorrectArr).then((data) => {
    // console.log(data);
    if (data.data.code === '200') {
      // alert(data.data.message);
      message.success(data.data.message);
      const mapcorrectlist = document.getElementById('mapcorrectlist');
      mapcorrectlist.innerHTML = '';
      window.mapcorrectArr = { requestMapErrors: [] };
    } else {
      message.error('插入数据失败');
    }
  });
}

class MapcorrectList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.visblechange = this.visblechange.bind(this);
    this.addmapcorrect = this.addmapcorrect.bind(this);
    // this.clearmapcorrect = this.clearmapcorrect.bind(this);
  }

  visblechange() {
    if (this.props.agsmap.correctflags) {
      // prepare();
      this.props.dispatch({
        type: 'agsmap/mapcorrectChangeState',
        payload: false,
      });
    } else {
      this.props.dispatch({
        type: 'agsmap/mapcorrectChangeState',
        payload: true,
      });
    }
  }

  addmapcorrect() {
    this.props.dispatch({
      type: ACTION_ADDMAPCORRECT_2D,
    });
  }

  // 清空用的函数
  // clearmapcorrect() {
  //   console.log(this.props);
  //   const mapcorrectlist = document.getElementById('mapcorrectlist');
  //   mapcorrectlist.innerHTML = '';
  //   // const storage = window.localStorage;
  //   // storage.clear();
  //   console.log(window.mapcorrectPoint);
  //   window.mapcorrectPoint.removeAll();
  //   window.mapcorrectArr = { requestMapErrors: [] };
  // }

  render() {
    return (
      <div
        id="correctList"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
        }}
      >
        <Modal
          title="纠错列表"
          visible={this.props.agsmap.correctflags}
          mask={false}
          style={{
            top: 66,
            right: -594,
            pointerEvents: 'all',
            overflow: 'auto',
            maxHeight: '600px',
            borderRadius: 0,
          }}
          maskClosable={false}
          width="400px"
          footer={null}
          onCancel={this.visblechange}
          wrapClassName={styles.wrapClassName}
          //   onCancel={this.visblechange}
          //   wrapClassName={styles.wrapClassName}
          bodyStyle={{ padding: '10px', textAlign: 'center' }}
        >
          <p style={{ marginBottom: '0' }}>
            <span
              style={{
                display: 'inline-block',
                width: '80px',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              标题
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '100px',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              类型
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '200px',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              内容
            </span>
          </p>
          <div
            id="mapcorrectlist"
            style={{ minHeight: '245px', overflow: 'auto' }}
          />
          <p>
            <Button
              type="primary"
              onClick={this.addmapcorrect}
              style={{
                width: '120px',
                borderRadius: 0,
              }}
            >
              <Icon type="plus-circle" />
              绘制纠错点
            </Button>
            <Button
              onClick={loadmapcorrect}
              style={{
                marginLeft: '24px',
                width: '80px',
                borderRadius: 0,
              }}
            >
              <Icon type="plus-circle" />
              提交
            </Button>
          </p>
        </Modal>
      </div>
    );
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(MapcorrectList);
