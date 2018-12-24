import React from 'react';
import _ from 'lodash';
import styles from './Getpoints.css';

/*
  获取点坐标
*/

class Getpoints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      visible: true,
    };
  }

  componentDidMount() {
    this.getMappoints();
  }

  getMappoints() {
    const that = this;
    this.props.view.when(view => {
      view.on(
        'pointer-move',
        _.throttle(event => {
          // 将屏幕点坐标转化为map点坐标
          // console.log(event);
          const point = view.toMap({ x: event.x, y: event.y });
          const lng = (point.x / 20037508.34) * 180;
          const mmy = (point.y / 20037508.34) * 180;
          const lat =
            (180 / Math.PI) * (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
          that.setState({
            latitude: Math.round(lat * 100) / 100,
            longitude: Math.round(lng * 100) / 100,
          });
        }, 100)
      );
    });
  }
  render() {
    return (
      <div>
        <div
          id="showl"
          className={styles.showl}
          style={{ display: this.state.visible ? 'block' : 'none' }}
        >
          <span className={styles.phang}>
            经度：
            <span id="showspan2">{this.state.longitude}</span>
          </span>
          <span className={styles.phang}>
            纬度：
            <span id="showspan1">{this.state.latitude}</span>
          </span>
        </div>
      </div>
    );
  }
}

export default Getpoints;
