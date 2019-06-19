/**
 * geomap-uilts 三维备用通用库
 * @author  lee  
 */
import * as jsapi from '../../jsapi';
//---------------------------------场景初始化 start----------------------------------------
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