import React from 'react';
import _ from 'lodash';

import styles from './ViewInfo.css';

class ViewInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      scale: '',
      lod: '',
      visible: true,
    };
  }

  componentDidMount() {
    if (this.props.view) {
      this.loadViewInfo(this.props.view);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.view) {
      this.loadViewInfo(nextProps.view);
    }
  }

  loadViewInfo(view) {
    const that = this;
    view.when(view => {
      setTimeout(() => {
        that.setState({
          lod: Math.floor(view.zoom),
          scale: Math.floor(view.scale),
        });
      });

      view.watch('zoom', () => {
        that.setState({
          lod: Math.floor(view.zoom),
          scale: Math.floor(view.scale),
        });
      });

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
      <div className={styles.wrap}>
        <div className={styles.left}>
          <span>
            <span>
              经度：
              <span id="showspan2">{this.state.longitude}</span>
            </span>
            <span>
              纬度：
              <span id="showspan1">{this.state.latitude}</span>
            </span>
          </span>
          <span className={styles.leftarrow} />
        </div>
        <div className={styles.right}>
          <span className={styles.rightarrow} />
          <span>
            <span>
              比例尺：
              <span id="showspan2">{this.state.scale}</span>
            </span>
            <span>
              LOD：
              <span id="showspan1">{this.state.lod}</span>
            </span>
          </span>
        </div>
      </div>
    );
  }
}

export default ViewInfo;
