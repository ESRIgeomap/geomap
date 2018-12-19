import React from 'react';
import styles from './WidgetButtons.css';

class DirectLineMeasurement3D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vm: {},
      view: {},
      destroy: false,
    };

    this.createMeasurement = this.createMeasurement.bind(this);
  }

  componentDidMount() {
    this.props.view.when(view => {
      this.state.view = view;
    });
  }
  createMeasurement() {
    if (!this.state.destroy) {
      // this.state.vm = new DirectLineMeasurement3DViewModel();
      this.state.vm.view = this.state.view;
      this.state.destroy = true;
    } else {
      this.state.vm.destroy();
      this.state.destroy = false;
    }
  }
}

export default DirectLineMeasurement3D;
