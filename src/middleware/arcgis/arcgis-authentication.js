import { APP_ID, APP_PORTAL_URL } from '../../constants/app';
import {
  GET_IDENTITY,
  SET_IDENTITY,
  SIGN_IN,
  SIGN_OUT,
  GET_USER_WEBSCENES,
  SET_USER_WEBSCENES,
} from '../../constants/action-types';

import { jsapi } from '../../constants/geomap-utils';

let oauthInfo;
let portal;
let IDManager;
jsapi
  .load([
    'esri/config',
    'esri/identity/OAuthInfo',
    'esri/identity/IdentityManager',
    'esri/portal/Portal',
  ])
  .then(([esriConfig, OAuthInfo, IdentityManager, Portal]) => {
    esriConfig.portalUrl = APP_PORTAL_URL;
    oauthInfo = new OAuthInfo({
      appId: APP_ID,
      popup: false,
      portalUrl: APP_PORTAL_URL,
    });
    portal = new Portal({ authMode: 'immediate' });

    IDManager = IdentityManager;
    IDManager.registerOAuthInfos([oauthInfo]);
  });

/**
 * Middleware function with the signature
 *
 * storeInstance =>
 * functionToCallWithAnActionThatWillSendItToTheNextMiddleware =>
 * actionThatDispatchWasCalledWith =>
 * valueToUseAsTheReturnValueOfTheDispatchCall
 *
 * Typically written as
 *
 * store => next => action => result
 */
function arcgisAuth(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => action => {
    switch (action.type) {
      case GET_IDENTITY:
        next(action);
        return IDManager.checkSignInStatus(`${oauthInfo.portalUrl}/sharing`)
          .then(() => portal.load())
          .then(() => {
            store.dispatch({
              type: SET_IDENTITY,
              username: portal.user.username,
              fullname: portal.user.fullName,
              email: portal.user.email,
              thumbnailurl: portal.user.thumbnailUrl,
            });

            store.dispatch({ type: GET_USER_WEBSCENES });
          });

      case SIGN_IN:
        IDManager.getCredential(`${oauthInfo.portalUrl}/sharing`);
        next(action);
        break;

      case SIGN_OUT:
        IDManager.destroyCredentials();
        window.location.reload();
        next(action);
        break;

      case GET_USER_WEBSCENES:
        next(action);
        return portal
          .queryItems({
            query: `owner:${portal.user.username} AND type: Web Scene`,
            sortField: 'modified',
            sortOrder: 'desc',
            num: 15,
          })
          .then(({ results }) =>
            store.dispatch({
              type: SET_USER_WEBSCENES,
              websceneItems: results,
            })
          );

      default:
        next(action);
        break;
    }

    return Promise.resolve();
  };
}

export { arcgisAuth };
