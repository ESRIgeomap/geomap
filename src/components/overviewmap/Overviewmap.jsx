import React, { useState, useEffect } from 'react';
// import { connect } from 'dva';
// import Map from 'esri/Map';
// import MapView from 'esri/views/MapView';
// import * as WatchUtils from 'esri/core/watchUtils';
import { jsapi } from '../../constants/geomap-utils';
import styles from './Overviewmap.css';

const Overviewmap = ({view}) => {
  const [extentDivWidth, setExtentDivWidth] = useState('');
  const [extentDivHeight, setExtentDivHeight] = useState('');
  const [extentDivTop, setExtentDivTop] = useState('');
  const [extentDivLeft, setExtentDivLeft] = useState('');
  let viewDiv = null;

  useEffect(() => {
    view.when(async view => {
      const [Map, MapView] = await jsapi.load(['esri/Map', 'esri/views/MapView']);
      const overviewMap = new Map({
        basemap: 'osm',
        zoom: 2,
      });
      // Create the MapView for overview map
      const mapView = new MapView({
        container: viewDiv,
        map: overviewMap,
      });

      // Remove the default widgets
      mapView.ui.components = [];

      view.when(async view => {
        const [WatchUtils] = await jsapi.load(['esri/core/watchUtils']);
        view.watch('extent', () => {
          updateOverviewExtent(view, mapView);
        });
        WatchUtils.when(view, 'stationary', () => {
          updateOverview(view, mapView);
        });
      });
    });
  }, []);

  function updateOverviewExtent(mainView, mapView) {
    const extent = mainView.extent;

    const bottomLeft = mapView.toScreen(extent.xmin, extent.ymin);
    const topRight = mapView.toScreen(extent.xmax, extent.ymax);
    if (bottomLeft !== null && topRight !== null) {
      setExtentDivWidth(topRight.x - bottomLeft.x + 'px');
      setExtentDivHeight(bottomLeft.y - topRight.y + 'px');
      setExtentDivTop(topRight.y + 'px');
      setExtentDivLeft(bottomLeft.x + 'px');
    }
  }

  return (
    <div className={styles.overviewMapDiv}>
      <div
        ref={node => {
          viewDiv = node;
        }}
        className={styles.overviewDiv}
      >
        <div
          style={{
            top: extentDivTop,
            left: extentDivLeft,
            width: extentDivWidth,
            height: extentDivHeight,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            zIndex: 20000,
          }}
        />
      </div>
    </div>
  );
};

function updateOverview(mainView, mapView) {
  mapView.when(() => {
    mapView.goTo({
      center: mainView.center,
      scale:
        mainView.scale *
        2 *
        Math.max(mainView.width / mapView.width, mainView.height / mapView.height),
    });
  });
}

export default Overviewmap;
