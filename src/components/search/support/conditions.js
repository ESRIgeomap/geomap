import * as SearchConsts from '../../../constants/search';

/**
 * 判断当前Search是否为POI查找
 */
export function isSearchingPoi(mode) {
  return mode === SearchConsts.MODE_LOCATION;
}
