import { useRef, useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Spin, Icon, Button, Input } from 'antd';

let widget;
/**
 *地图截屏微件,支持二三维地图调用
 * @author  liugh
 */
const ViewClipMap = ({ view }) => {
  const [showTips, setShowTips] = useState(false);
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (view) {
      setLoading(false);
    }
    return () => {
      if (widget) {
        // 如果widget存在，则删除该widget
        widget.destroy();
      }
    };
  }, []);

  const activeClip = () => {
    setShowTips(true);
    clipMap();
  };
  const clipMap = () => {
    view.container.style.cursor = 'crosshair'; // 改变光标样式

    let clipMapMaskDiv = document.createElement('div');
    clipMapMaskDiv.id = 'clipMapMaskDiv';
    clipMapMaskDiv.style.display = 'none';
    clipMapMaskDiv.style.position = 'absolute';
    clipMapMaskDiv.style.background = 'rgba(255, 51, 0, 0.1)';
    clipMapMaskDiv.style.border = '2px dashed rgb(255, 51, 0)';
    document.body.append(clipMapMaskDiv);
    // 设置截屏拖动的范围对象
    let area = null;

    const dragHandler = view.on('drag', function(event) {
      event.stopPropagation();

      if (event.action !== 'end') {
        // 通过拖动光标计算所选区域的范围
        const xmin = clamp(Math.min(event.origin.x, event.x), 0, view.width);
        const xmax = clamp(Math.max(event.origin.x, event.x), 0, view.width);
        const ymin = clamp(Math.min(event.origin.y, event.y), 0, view.height);
        const ymax = clamp(Math.max(event.origin.y, event.y), 0, view.height);
        area = {
          x: xmin,
          y: ymin,
          width: xmax - xmin,
          height: ymax - ymin,
        };
        // 设置标记所选区域的div元素的位置
        setMaskPosition(area);
      } else {
        // 当用户停止拖拽
        // remove the drag event listener from the SceneView
        dragHandler.remove();
        setShowTips(false);
        view.takeScreenshot({ area: area, format: 'png' }).then(function(screenshot) {
          // 显示预览
          showPreview(screenshot);
        });
        // 取消截屏状态
        cancelClipMap();
      }
    });

    setTimeout(function() {
      window.addEventListener('click', clickEvent, false);
    }, 0);
    // 设置遮罩位置
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
      if (!e.target.parentNode || e.target.parentNode.parentNode !== window.ags.container) {
        // 取消截屏状态
        cancelClipMap();
      }
    }
    // 取消截屏
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

      ReactDom.render(<ScreenshotPreview screenshot={screenshot} />, screenshotDiv);
    }
  };

  return (
    <div>
      <Button block onClick={activeClip}>
        {' '}
        新&nbsp;建&nbsp;截&nbsp;屏
      </Button>
      <div style={{ display: showTips ? 'block' : 'none', textAlign: 'center', marginTop: 10 }}>
        按下鼠标左键拖动开始截图{' '}
      </div>
      <div ref={domRef} />
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '30px 50px',
            margin: '20px 0',
          }}
        >
          <Spin
            size="large"
            spinning={loading}
            indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
          />
        </div>
      )}
    </div>
  );
};

const ScreenshotPreview = props => {
  const [imgTitle, setImgTitle] = useState('');

  const imgTitleOnChange = e => {
    setImgTitle(e.target.value);
  };
  // 下载响应事件
  const downloadBtnOnClick = () => {
    let text = imgTitle.trim();
    let screenshot = props.screenshot;
    if (text) {
      const dataUrl = getImageWithText(screenshot, text);
      downloadImage(text + '.png', dataUrl);
    }
    // otherwise download only the webscene screenshot
    else {
      downloadImage('clipmap.png', screenshot.dataUrl);
    }
  };
  // 图片下载处理
  const downloadImage = (filename, dataUrl) => {
    // the download is handled differently in Microsoft browsers
    // because the download attribute for <a> elements is not supported
    if (!window.navigator.msSaveOrOpenBlob) {
      // in browsers that support the download attribute
      // a link is created and a programmatic click will trigger the download

      let aLink = document.createElement('a');
      let blob = base64ToBlob(dataUrl); // new Blob([content]);
      aLink.download = filename;
      aLink.href = URL.createObjectURL(blob);
      aLink.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
      ); // 兼容火狐
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
  };

  //base64转blob
  const base64ToBlob = code => {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };
  //返回到场景
  const backToWebscene = () => {
    const screenshotDiv = document.getElementById('screenshotDiv');
    if (screenshotDiv) {
      document.body.removeChild(screenshotDiv);
    }
  };
  // 将标题设置到截屏输出的地图中
  const getImageWithText = () => {
    let screenshot = props.screenshot;
    let text = imgTitle;
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
    context.fillRect(0, imageData.height - 40, context.measureText(text).width + 20, 30);

    // add the text from the textInput element
    context.fillStyle = '#fff';
    context.fillText(text, 10, imageData.height - 20);

    return canvas.toDataURL();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        //   textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          top: '10%',
          textAlign: 'center',
        }}
      >
        <img
          src={props.screenshot.dataUrl}
          alt=""
          style={{
            margin: '8px',
            border: '10px solid white',
            boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.5)',
            width: props.screenshot.data.width,
            height: props.screenshot.data.height,
          }}
        />

        <div style={{ margin: '10px' }}>
          <label>设置标题</label>
          <Input
            placeholder="图片标题"
            size="large"
            style={{ width: '200px', marginLeft: '10px', borderRadius: 0 }}
            onChange={imgTitleOnChange}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Button
            type="primary"
            icon="download"
            size="large"
            style={{ borderRadius: 0 }}
            onClick={downloadBtnOnClick}
          >
            下载图片
          </Button>
          <Button
            type="normal"
            icon="rollback"
            size="large"
            style={{ marginLeft: '10px', borderRadius: 0 }}
            onClick={backToWebscene}
          >
            返回场景
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewClipMap;
