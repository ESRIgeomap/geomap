export default {
  getPortal() {
    return window.appcfg.portal;
  },

  getWebMapId() {
    return window.appcfg.webMapId;
  },

  getSplitWebMapId() {
    return window.appcfg.websplitMapId;
  }, // 分屏用底图

  getWebSceneId() {
    return window.appcfg.webSceneId;
  },

  getParamAgs() {
    return window.agsGlobal;
  },

  setParamAgs(paramAgs) {
    window.agsGlobal = paramAgs;
  },

  setParamAgstwo(paramAgs) {
    window.agstwoGlobal = paramAgs;
  },

  getSplitItemIdone() {
    return window.appcfg.splitItemIdone;
  },

  getSplitItemIdtwo() {
    return window.appcfg.splitItemIdtwo;
  },

  getMultidateItemone() {
    return window.appcfg.multidateItemone;
  },
  getMultidateItemtwo() {
    return window.appcfg.multidateItemtwo;
  },
  getMultidateItemthree() {
    return window.appcfg.multidateItemthree;
  },
  getMultidateItemfour() {
    return window.appcfg.multidateItemfour;
  },
  getMultidateItemfive() {
    return window.appcfg.multidateItemfive;
  },

  getProxyUrl() {
    return window.appcfg.proxy;
  },

  getSigninUrl() {
    return window.appcfg.signin;
  },

  getClientId() {
    return window.appcfg.clientId;
  },

  getClientSecret() {
    return window.appcfg.clientSecret;
  },

  getInitialExtent() {
    return window.appcfg.initialExtent;
  },

  getDefaultBasemap2D() {
    return window.appcfg.basemaps.default2d;
  },

  getDefaultBasemap3D() {
    return window.appcfg.basemaps.default3d;
  },

  getDojoConfig() {
    return window.dojoConfig;
  },
};
