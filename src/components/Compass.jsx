import React from 'react';
import { jsapi } from '../constants/geomap-utils';
import styles from './Compass.css';

function toRotationTransform(orientation) {
  return {
    display: 'inline-block',
    fontSize: '24px',
    transform: `rotateZ(${orientation.z}deg)`,
  };
}

/**
 * 罗盘微件
 */
class Compass extends React.Component {
  constructor(props) {
    super(props);
    this.vm = null;
    this.state = {
      orientation: {
        z: 0,
      },
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    if (this.props.view) {
      this.createWidget(this.props.view);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.view) {
      this.createWidget(nextProps.view);
    }
  }

  createWidget(view) {
    view.when(async view => {
      const [CompassViewModel] = await jsapi.load(['esri/widgets/Compass/CompassViewModel']);
      this.vm = new CompassViewModel();
      this.vm.view = view;
      this.vm.watch('orientation', orientation => {
        this.setState({
          orientation,
        });
      });
    });
  }

  reset() {
    this.vm.reset();
  }

  render() {
    const { orientation } = this.state;

    return (
      <div {...this.props}>
        <a className={styles.compassBtn} onClick={this.reset}>
          <span className="esri-icon-compass" style={toRotationTransform(orientation)} />
        </a>
      </div>
    );
  }
}

export default Compass;
