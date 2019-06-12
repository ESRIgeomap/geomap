import React from 'react';
import ReactDom from 'react-dom';
import { Icon, Button, Input } from 'antd';
import { jsapi } from '../constants/geomap-utils';

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
    ReactDom.render(<Icon type="close" />, closeDiv);
    closeDiv.addEventListener('click', function() {
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

  // 裁剪
  static async clipMap() {
    let view = Print2DMap.mapView;
    view.container.style.cursor = 'crosshair'; // 改变光标样式

    let clipMapMaskDiv = document.createElement('div');
    clipMapMaskDiv.id = 'clipMapMaskDiv';
    clipMapMaskDiv.style.display = 'none';
    clipMapMaskDiv.style.position = 'absolute';
    clipMapMaskDiv.style.background = 'rgba(255, 51, 0, 0.1)';
    clipMapMaskDiv.style.border = '2px dashed rgb(255, 51, 0)';
    document.body.append(clipMapMaskDiv);

    let area = null;

    let imgTitle = '';

    const dragHandler = view.on('drag', function(event) {
      event.stopPropagation();

      if (event.action !== 'end') {
        // 通过拖动光标计算所选区域的范围
        const xmin = clamp(
          Math.min(event.origin.x, event.x),
          0,
          view.width
        );
        const xmax = clamp(
          Math.max(event.origin.x, event.x),
          0,
          view.width
        );
        const ymin = clamp(
          Math.min(event.origin.y, event.y),
          0,
          view.height
        );
        const ymax = clamp(
          Math.max(event.origin.y, event.y),
          0,
          view.height
        );
        area = {
          x: xmin,
          y: ymin,
          width: xmax - xmin,
          height: ymax - ymin
        };
        // 设置标记所选区域的div元素的位置
        setMaskPosition(area);
      } else { // 当用户停止拖拽
        // remove the drag event listener from the SceneView
        dragHandler.remove();

        Print2DMap.mapView.takeScreenshot({area: area, format: 'png' }).then(function(screenshot) {
          // 显示预览
          showPreview(screenshot);

          // const aLink = document.createElement('a');
          // aLink.download = 'clipmap.png';
          // aLink.href = screenshot.dataUrl;
          // aLink.click();
        });
        // 取消截屏状态
        cancelClipMap();
      }
    });

    setTimeout(function () {
      window.addEventListener('click', clickEvent, false);
    }, 0);

    function setMaskPosition(area) {
      if (area) {
        clipMapMaskDiv.style.display = 'block';
        clipMapMaskDiv.style.left = area.x + 'px';
        clipMapMaskDiv.style.top = area.y + 'px';
        clipMapMaskDiv.style.width = area.width + 'px';
        clipMapMaskDiv.style.height = area.height + 'px';
      } else {
        clipMapMaskDiv.style.display = 'none';
      }
    }

    function clamp(value, from, to) {
      return value < from ? from : value > to ? to : value;
    }

    function clickEvent(e) {
      if (!e.target.parentNode
        || e.target.parentNode.parentNode !== window.ags.container) {
        // 取消截屏状态
        cancelClipMap();
      }
    }

    function cancelClipMap() {
      if (document.getElementById('clipMapMaskDiv')) {
        document.body.removeChild(clipMapMaskDiv);
      }
      view.container.style.cursor = 'default'; // 改变光标样式
      dragHandler.remove();
      window.removeEventListener('click', clickEvent);
    }

    // 显示预览
    function showPreview(screenshot) {
      const screenshotDiv = document.createElement('div');
      screenshotDiv.id = 'screenshotDiv';
      document.body.appendChild(screenshotDiv);

      ReactDom.render(<ScreenshotPreview screenshot={screenshot}/>, screenshotDiv);
    }

    /** API方式 */
    // Print2DMap.mapView.takeScreenshot({format: 'png' }).then(function(screenshot) {
    //   const aLink = document.createElement('a');
    //   aLink.download = 'clipmap.png';
    //   aLink.href = screenshot.dataUrl;
    //   aLink.click();
    // });
    /**html2canvas方式 */
    // html2canvas(document.body, {
    //   useCORS: true,
    //   proxy: window.appcfg.proxy,
    //   width: window.screen.availWidth,
    //   height: window.screen.availHeight,
    //   windowWidth: document.body.scrollWidth,
    //   windowHeight: document.body.scrollHeight,
    //   x: 0,
    //   y: window.pageYOffset,
    // }).then(function(canvas) {
    //   const imgUrl = canvas.toDataURL('image/png', 1);
    //   const aLink = document.createElement('a');
    //   aLink.download = 'clipMap.png';
    //   aLink.href = imgUrl;
    //   aLink.click();
    // });
  }
}

// 截屏预览
class ScreenshotPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgTitle: '',
    };

    this.imgTitleOnChange = this.imgTitleOnChange.bind(this);
    this.downloadBtnOnClick = this.downloadBtnOnClick.bind(this);
    this.backToWebscene = this.backToWebscene.bind(this);
  }

  imgTitleOnChange(e) {
    this.setState({
      imgTitle: e.target.value,
    });
  }

  downloadBtnOnClick() {
    let text = this.state.imgTitle.trim();
    let screenshot = this.props.screenshot;
    if (text) {
      const dataUrl = this.getImageWithText(screenshot, text);
      this.downloadImage(
        text + '.png',
        dataUrl
      );
    }
    // otherwise download only the webscene screenshot
    else {
      this.downloadImage(
        'clipmap.png',
        screenshot.dataUrl
      );
    }
  }

  downloadImage(filename, dataUrl) {
    // the download is handled differently in Microsoft browsers
    // because the download attribute for <a> elements is not supported
    if (!window.navigator.msSaveOrOpenBlob) {
      // in browsers that support the download attribute
      // a link is created and a programmatic click will trigger the download

      let aLink = document.createElement('a');
      let blob = this.base64ToBlob(dataUrl); // new Blob([content]);
      aLink.download = filename;
      aLink.href = URL.createObjectURL(blob);
      aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window})); // 兼容火狐
    } else {
      // for MS browsers convert dataUrl to Blob
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // download file
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
  }

  //base64转blob
  base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
  }

  backToWebscene() {
    const screenshotDiv = document.getElementById('screenshotDiv');
    if (screenshotDiv) {
      document.body.removeChild(screenshotDiv);
    }
  }

  getImageWithText() {
    let screenshot = this.props.screenshot;
    let text = this.state.imgTitle;
    const imageData = screenshot.data;

    // to add the text to the screenshot we create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = imageData.height;
    canvas.width = imageData.width;

    // add the screenshot data to the canvas
    context.putImageData(imageData, 0, 0);
    context.font = '20px Arial';
    context.fillStyle = '#000';
    context.fillRect(
      0,
      imageData.height - 40,
      context.measureText(text).width + 20,
      30
    );

    // add the text from the textInput element
    context.fillStyle = '#fff';
    context.fillText(text, 10, imageData.height - 20);

    return canvas.toDataURL();
  }

  render() {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        overflow: 'auto',
      }}>
        <img src={this.props.screenshot.dataUrl}
          alt=""
          style={{
            margin: '8px',
            border: '10px solid white',
            boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.5)',
            width: this.props.screenshot.data.width,
            height: this.props.screenshot.data.height,
          }}/>

        <div style={{margin: '10px'}}>
          <label>设置标题</label>
          <Input placeholder="图片标题"
            size="large"
            style={{width: '200px', marginLeft: '10px'}}
            onChange={this.imgTitleOnChange}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <Button type="primary"
            icon="download"
            size="large"
            onClick={this.downloadBtnOnClick}>
            下载图片
          </Button>
          <Button
            type="normal"
            icon="rollback"
            size="large" style={{'marginLeft': '10px'}}
            onClick={this.backToWebscene}>
            返回场景
          </Button>
        </div>
      </div>
    );
  }
}

export default Print2DMap;
