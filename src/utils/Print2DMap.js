import React from 'react';
import ReactDom from 'react-dom';
import {Icon} from 'antd';
import * as jsapi from './jsapi';

class Print2DMap {
  static async show() {
    const printDiv = document.createElement('div');
    printDiv.style.position = 'absolute';
    printDiv.style.top = '70px';
    printDiv.style.right = '100px';
    printDiv.style.width = '300px';
    printDiv.style.height = '435px';
    const closeDiv = document.createElement('div');
    closeDiv.style.float = 'right';
    closeDiv.style.width = '25px';
    closeDiv.style.height = '25px';
    closeDiv.style.cursor = 'pointer';
    closeDiv.title = '关闭';
    ReactDom.render(<Icon type="close"/>, closeDiv);
    closeDiv.addEventListener("click",function() {
      window.printmap.destroy();
      window.printmap = undefined;
    });
    printDiv.appendChild(closeDiv);
    if (window.printmap !== undefined) {
      window.printmap.destroy();
      window.printmap = undefined;
    } else {
      const [Print] = await jsapi.load(['esri/widgets/Print']);
      const print = new Print({
        view: Print2DMap.mapView,
        container: printDiv,
        printServiceUrl: window.appcfg.printService,
      });
      Print2DMap.mapView.ui.add(print);
      window.printmap = print;
    }
  }
}

export default Print2DMap;
