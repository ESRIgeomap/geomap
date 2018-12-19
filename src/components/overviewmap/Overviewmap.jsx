import React, { Component } from 'react';
// import { connect } from 'dva';
// import Map from 'esri/Map';
// import MapView from 'esri/views/MapView';
// import * as WatchUtils from 'esri/core/watchUtils';
import * as jsapi from '../../utils/jsapi';
import styles from './Overviewmap.css';

class Overviewmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extentDivWidth: '',
      extentDivHeight: '',
      extentDivTop: '',
      extentDivLeft: '',
    };
    this.viewDiv = null;
  }
  componentDidMount() {
    this.buildOverview();
  }
  buildOverview() {
    this.props.view.when(async view => {
      const [Map, MapView] = await jsapi.load([
        'esri/Map',
        'esri/views/MapView',
      ]);
      const overviewMap = new Map({
        basemap: 'osm',
        zoom: 2,
      });
      // Create the MapView for overview map
      const mapView = new MapView({
        container: this.viewDiv,
        map: overviewMap,
      });

      // Remove the default widgets
      mapView.ui.components = [];

      this.props.view.when(async view => {
        const [WatchUtils] = await jsapi.load([
          'esri/core/watchUtils',
        ]);
        view.watch('extent', () => {
          this.updateOverviewExtent(view, mapView);
        });
        WatchUtils.when(view, 'stationary', () => {
          updateOverview(view, mapView);
        });
      });
    })
  }
  updateOverviewExtent(mainView, mapView) {
    const extent = mainView.extent;

    const bottomLeft = mapView.toScreen(extent.xmin, extent.ymin);
    const topRight = mapView.toScreen(extent.xmax, extent.ymax);
    if (bottomLeft !== null && topRight !== null) {
      this.setState({
        extentDivTop: topRight.y + 'px',
        extentDivLeft: bottomLeft.x + 'px',
        extentDivHeight: bottomLeft.y - topRight.y + 'px',
        extentDivWidth: topRight.x - bottomLeft.x + 'px',
      });
    }
  }

  render() {
    return (
      <div className={styles.overviewMapDiv}>
        <div
          ref={(node) => {
            this.viewDiv = node;
          }}
          className={styles.overviewDiv}
        >
          <div
            style={{
              top: this.state.extentDivTop,
              left: this.state.extentDivLeft,
              width: this.state.extentDivWidth,
              height: this.state.extentDivHeight,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'absolute',
              zIndex: 20000,
            }}
          />
        </div>
      </div>
    );
  }
}

function updateOverview(mainView, mapView) {
  mapView.when(() => {
    mapView.goTo({
      center: mainView.center,
      scale:
        mainView.scale *
        2 *
        Math.max(
          mainView.width / mapView.width,
          mainView.height / mapView.height,
        ),
    });
  });
}

export default Overviewmap;
