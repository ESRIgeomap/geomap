import { jsapi } from '../../../constants/geomap-utils';
// let vm = null;
export default {
  // async init(view) {
  //   const [NavigationToggleViewModel] = await jsapi.load([
  //     'esri/widgets/NavigationToggle/NavigationToggleViewModel',
  //   ]);
  //   vm = new NavigationToggleViewModel();
  //   vm.view = view;
  // },
  async toggle(view,tool){
    const [NavigationToggleViewModel] = await jsapi.load([
      'esri/widgets/NavigationToggle/NavigationToggleViewModel',
    ]);
    const vm = new NavigationToggleViewModel();
    vm.view = view;
    if (vm.navigationMode !== tool) {
      vm.toggle();
    }
  },
};