import esriLoader from 'esri-loader';

function configEsriLoader() {
  esriLoader.utils.Promise = Promise;
}

export default function preload() {
  return esriLoader.loadScript({
    dojoConfig: window.dojoConfig,
    url: window.apiRoot,
  });
}

export function load(modules) {
  configEsriLoader();
  return esriLoader.loadModules(modules, {
    dojoConfig: window.dojoConfig,
    url: window.apiRoot,
  });
}