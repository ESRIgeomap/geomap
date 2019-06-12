import React from 'react';
import { Icon } from 'antd';
import { jsapi } from '../constants/geomap-utils';

import styles from './Zoom.css';

class Zoom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.vm = null;
    this.state = {
      updating: false,
      maxZoomed: false,
      minZoomed: false,
      zoomVal: null,
    };

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
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
      const [ZoomViewModel, watchUtils] = await jsapi.load([
        'esri/widgets/Zoom/ZoomViewModel',
        'esri/core/watchUtils',
      ]);
      this.vm = new ZoomViewModel();
      this.vm.view = view;
      watchUtils.init(view, 'zoom', val => {
        this.setState({
          maxZoomed: val === view.constraints.maxZoom,
          minZoomed: val === view.constraints.minZoom,
        });
      });
      watchUtils.init(view, 'stationary', updating => {
        this.setState({ updating });
      });
    });
    this.watchZoom(view);
  }

  zoomIn() {
    if (!this.state.maxZoomed) {
      this.vm.zoomIn();
    }
  }

  zoomOut() {
    if (!this.state.minZoomed) {
      this.vm.zoomOut();
    }
  }

  watchZoom(view) {
    this.setState({
      zoomVal: view.zoom,
    });
    view.watch('zoom', newValue => {
      this.setState({
        zoomVal: Math.round(newValue),
      });
    });
  }

  render() {
    return (
      <div {...this.props}>
        <a className={styles.zoomBtn} onClick={this.zoomIn} disabled={this.state.maxZoomed}>
          <Icon type="plus" className={styles.iconstyle} />
        </a>
        <br />
        <a className={styles.zoomBtnbottom} onClick={this.zoomOut} disabled={this.state.minZoomed}>
          <Icon type="minus" className={styles.iconstyle} />
        </a>
      </div>
    );
  }
}

export default Zoom;
