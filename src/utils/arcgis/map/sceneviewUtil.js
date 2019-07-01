/**
 * geomap-uilts 三维备用通用库
 * @author  lee  
 */
import * as jsapi from '../../jsapi';
//---------------------------------场景初始化 start----------------------------------------
/**
 * 初始化三维场景
 * @author  lee  
 * @param {object} portal  portal地址
 * @param {string} itemid  webscenenId
 * @param {string} container  地图的div
 * @returns {object}  view 场景
 */

async function initSceneView(portal, itemid, container) {
  const [WebScene, Sceneview] = await jsapi.load(['esri/WebScene', 'esri/views/SceneView']);
  const scene = new WebScene({
    portalItem: {
      id: itemid,
      portal: portal,
    },
  });

  const view = new Sceneview({
    container: container,
    map: scene,
    environment: {
      atmosphere: {
        quality: 'high',
      },
      // 修改光照
      lighting: {
        date: new Date(),
        directShadowsEnabled: false,
        cameraTrackingEnabled: false,
      },
    },
    ui: {
      components: [], 
    },
  });
  return view;
}
export { initSceneView };
/**
 * 切换三维的旋转方式：平移或者渲染
 * @author  lee  
 * @param {object} view  三维场景
 * @param {string} tool  pan or rotate
 */
async function changeToggle(view, tool) {
  const [NavigationToggleViewModel] = await jsapi.load([
    'esri/widgets/NavigationToggle/NavigationToggleViewModel',
  ]);
  const vm = new NavigationToggleViewModel();
  vm.view = view;
  if (vm.navigationMode !== tool) {
    vm.toggle();
  }
}
export { changeToggle }

/**
 * 环绕漫游
 * @author  lee  
 * @param {object} view  三维场景
 */
let roamHandle
function surroundRoam(view) {
  if (roamHandle) {
    clearInterval(roamHandle);
    roamHandle = null;
  } else {
    roamHandle = setInterval(() => {
      view.goTo({ heading: view.camera.heading + 0.5 });
    }, 100);
  }

}
export { surroundRoam }