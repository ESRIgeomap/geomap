import React from 'react';
import { Tooltip } from 'antd';
import * as jsapi from '../../utils/jsapi';
import styles from './WidgetButtons.css';

class AreaMeasurement3D extends React.Component {
  constructor(props) {
    super(props);
    this.status = {
      vm: null,
      view: {},
      destroy: false,
    };
    this.createMeasurement = this.createMeasurement.bind(this);
  }

  componentDidMount() {
    this.props.view.when(view => {
      this.status.view = view;
    });
  }
  async createMeasurement() {
    if (!this.state.destroy) {
      const [AreaMeasurement3DViewModel] = await jsapi.load([
        'esri/widgets/AreaMeasurement3D/AreaMeasurement3DViewModel',
      ]);
      this.status.vm = new AreaMeasurement3DViewModel();
      this.status.vm.view = this.status.view;
      this.status.destroy = true;
      this.mouseMoveHandle = this.status.view.on('double-click', evt => {
        if (this.state.over) {
          this.status.vm.destroy();
          this.status.destroy = false;
        }
      });
    } else {
      this.status.vm.destroy();
      this.status.destroy = false;
    }
  }
  render() {
    return (
      <div>
        <Tooltip placement="left" title="测量">
          <a className={styles.btn} onClick={this.createMeasurement}>
            <span className="esri-icon-pan" />
          </a>
        </Tooltip>
        <br />
      </div>
    );
  }
}

export default AreaMeasurement3D;
