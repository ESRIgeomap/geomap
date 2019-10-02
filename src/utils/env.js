export const AppConfig = window.appcfg;

export const Portal = AppConfig.portal;
export const AppProxy = AppConfig.proxy;
export const WebmapID = AppConfig.webMapId;
export const WebsceneID = AppConfig.webSceneId;

// --- Portal Auth
export const SignInUrl = AppConfig.signin;
export const ClientID = AppConfig.clientId;
export const ClientSecret = AppConfig.clientSecret;
// --- END

export const InitialExtent = AppConfig.initialExtent;

export const SplitWebmap = AppConfig.websplitMapId;
export const SplitItem1 = AppConfig.splitItemIdone;
export const SplitItem2 = AppConfig.splitItemIdtwo;

export const MultiDateItem1 = AppConfig.multidateItemone;
export const MultiDateItem2 = AppConfig.multidateItemtwo;
export const MultiDateItem3 = AppConfig.multidateItemthree;
export const MultiDateItem4 = AppConfig.multidateItemfour;
export const MultiDateItem5 = AppConfig.multidateItemfive;

export default {
    getParamAgs() {
        return window.agsGlobal;
    },
    getDomainName() {
        return window.appcfg.domainName4datasource;
      },
      getWebAdaptorName() {
        return window.appcfg.webAdaptorName4datasource;
      },
      getUsername4searchItems() {
        return window.appcfg.username4searchItems4datasource;
      },
      getPortal4datasource() {
        // http://esrichina3d.arcgisonline.cn/portal/
        const portalUrl = window.appcfg.protocolName4datasource + '://' + window.appcfg.domainName4datasource + '/' + window.appcfg.webAdaptorName4datasource + '/';
        return portalUrl;
      },
}