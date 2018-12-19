import styles from './Print3DMap.css';

let maskDiv = null,
  popupDiv = null,
  imgDiv = null,
  buttonDownDiv = null,
  buttonBackSceneDiv = null;
function initDom() {
  maskDiv = document.createElement('div');
  maskDiv.style.display = 'none';
  maskDiv.style.position = 'absolute';
  maskDiv.style.background = 'rgba(255, 51, 0, 0.1)';
  document.body.append(maskDiv);

  popupDiv = document.createElement('div');
  popupDiv.style.position = 'absolute';
  popupDiv.style.top = '0';
  popupDiv.style.right = '0';
  popupDiv.style.left = '0';
  popupDiv.style.bottom = '0';
  popupDiv.style.textAlign = 'center';
  popupDiv.style.background = 'rgba(255, 255, 255, 0.5)';
  popupDiv.style.display = 'none';

  imgDiv = document.createElement('img');
  imgDiv.style.marginTop = '10px';
  imgDiv.style.border = '10px solid white';
  imgDiv.style.boxShadow = '2px 2px 5px 0 rgba(0, 0, 0, 0.5)';
  popupDiv.appendChild(imgDiv);

  buttonDownDiv = document.createElement('div');
  buttonDownDiv.innerHTML = '<p>下载图片</p>';
  buttonDownDiv.style.position = 'absolute';
  buttonDownDiv.style.backgroundColor = '#0066ff';
  buttonDownDiv.style.width = '70px';
  buttonDownDiv.style.height = '30px';
  buttonDownDiv.style.lineHeight = '30px';
  buttonDownDiv.style.borderRadius = '5px';
  buttonDownDiv.style.color = '#ffffff';
  buttonDownDiv.style.cursor = 'pointer';
  popupDiv.appendChild(buttonDownDiv);

  buttonBackSceneDiv = document.createElement('div');
  buttonBackSceneDiv.innerHTML = '<p>返回场景</p>';
  buttonBackSceneDiv.style.position = 'absolute';
  buttonBackSceneDiv.style.backgroundColor = '#0066ff';
  buttonBackSceneDiv.style.width = '70px';
  buttonBackSceneDiv.style.height = '30px';
  buttonBackSceneDiv.style.lineHeight = '30px';
  buttonBackSceneDiv.style.borderRadius = '5px';
  buttonBackSceneDiv.style.color = '#ffffff';
  buttonBackSceneDiv.style.cursor = 'pointer';
  popupDiv.appendChild(buttonBackSceneDiv);

  document.body.append(popupDiv);
}

  // set text to the screenshot
function getImageWithText(screenshot, text) {
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
}

function downloadMap(screenShot) {
  const aLink = document.createElement('a');
  aLink.download = 'map.png';
  aLink.href = screenShot.dataUrl;
  aLink.click();
}

function clamp(value, from, to) {
  return value < from ? from : value > to ? to : value;
}

function setMaskPosition(area) {
  if (area) {
    maskDiv.style.display = 'block';
    maskDiv.style.left = area.x + 'px';
    maskDiv.style.top = area.y + 'px';
    maskDiv.style.width = area.width + 'px';
    maskDiv.style.height = area.height + 'px';
    maskDiv.style.border = '2px solid red';
  } else {
    maskDiv.style.display = 'none';
    document.body.removeChild(maskDiv);
  }
}

class Print3DMap {
  static print() {
    initDom();
    let area = null;
    let view = this.sceneView;
    window.view = this.sceneView;
    view.container.classList.add(styles.screenshotCursor);
    const dragHandler = view.on('drag', function(event) {
      event.stopPropagation();
      if (event.action !== 'end') {
        // calculate the extent of the area selected by dragging the cursor
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
        // set the position of the div element that marks the selected area
        setMaskPosition(area);
      }
      // when the user stops dragging
      else {
        // remove the drag event listener from the SceneView
        dragHandler.remove();
        // the screenshot of the selected area is taken
        view.takeScreenshot({ area: area, format: 'png' }).then(function(screenshot) {
          // display a preview of the image

          imgDiv.width = screenshot.data.width;
          imgDiv.height = screenshot.data.height;
          imgDiv.src = screenshot.dataUrl;
          buttonDownDiv.style.top = screenshot.data.height + 20 + 'px';
          buttonDownDiv.style.left = window.innerWidth / 2 - 75 + 'px';

          buttonBackSceneDiv.style.top = screenshot.data.height + 20 + 'px';
          buttonBackSceneDiv.style.right = window.innerWidth / 2 - 75 + 'px';
          popupDiv.style.display = 'block';

          buttonDownDiv.onclick = function() {
            downloadMap(screenshot);
          };
          buttonBackSceneDiv.onclick = function() {
            document.body.removeChild(popupDiv);
          };
          view.container.classList.remove(styles.screenshotCursor);
          setMaskPosition(null);
        });
      }
    });
  }
}

export default Print3DMap;
