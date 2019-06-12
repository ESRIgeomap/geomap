import { jsapi } from '../constants/geomap-utils';
import React from 'react';
import ReactDom from 'react-dom';
import { Icon } from 'antd';

class LegendList {
  // static async show() {
  //   const lengendDiv = document.createElement('div');
  //   lengendDiv.style.position = 'absolute';
  //   lengendDiv.style.top = '119px';
  //   lengendDiv.style.right = '15px';
  //   lengendDiv.style.width = '310px';
  //   lengendDiv.style.height = 'auto';
  //   lengendDiv.style.maxHeight = '785px';
  //   lengendDiv.style.background = 'rgba(255,255,255,0.8)';
  //   lengendDiv.style.color = '#000';
  //   lengendDiv.style.border = '1px solid #1890FF';
  //   const closeDiv = document.createElement('div');
  //   closeDiv.style.float = 'right';
  //   closeDiv.style.width = '25px';
  //   closeDiv.style.height = '25px';
  //   closeDiv.style.cursor = 'pointer';
  //   closeDiv.title = '关闭';
  //   ReactDom.render(<Icon type="close" />, closeDiv);
  //   closeDiv.addEventListener('click', function() {
  //     window.legendlist.destroy();
  //     window.legendlist = undefined;
  //   });
  //   lengendDiv.appendChild(closeDiv);
  //   if (window.legendlist !== undefined) {
  //     window.legendlist.destroy();
  //     window.legendlist = undefined;
  //   } else {
  //     const [Legend] = await jsapi.load(['esri/widgets/Legend']);
  //     const legend = new Legend({
  //       view: LegendList.mapView,
  //       container: lengendDiv,
  //     });
  //     // LegendList.mapView.ui.add(legend);
  //     window.legendlist = legend;
  //     let panelDiv = document.getElementById('legendlistDiv');
  //     panelDiv.appendChild(lengendDiv);
  //   }
  // }

  static async show() {
    // const lengendDiv = document.getElementById('legendlistDiv');
    const lengendDiv = document.createElement('div');
    // lengendDiv.style.maxHeight = '745px';
    lengendDiv.style.backgroundColor = '#fff';
    const [Legend] = await jsapi.load(['esri/widgets/Legend']);
    const legend = new Legend({
      view: LegendList.mapView,
      container: lengendDiv,
    });
    window.legendlist = legend;
    let panelDiv = document.getElementById('legendlistDiv');
    panelDiv.appendChild(lengendDiv);
  }
  static async deactivate() {
    if (window.legendlist !== undefined) {
      window.legendlist.destroy();
      window.legendlist = undefined;
    }
  }
}

export default LegendList;
