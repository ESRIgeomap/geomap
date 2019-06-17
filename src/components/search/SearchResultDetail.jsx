import React from 'react';
import { connect } from 'dva';
import { Icon, Table } from 'antd';
import * as SearchConsts from '../../constants/search';

import styles from './SearchResultDetail.css';

class SearchResultDetail extends React.Component {
  getLocationValue() {
    if (this.props.restype === SearchConsts.LIST_RESULT_FIND) {
      return this.props.search.poi.attributes[window.poiCfg[0].locationField];
    }

    if (this.props.restype === SearchConsts.LIST_RESULT_QUERY) {
      return this.props.search.nearbypoi.attributes[window.poiCfg[0].locationField];
    }

    return '';
  }

  renderBar() {
    if (this.props.restype === SearchConsts.LIST_RESULT_FIND) {
      return (
        <div className={styles.itembar}>
          <a onClick={() => this.props.onNearbyClick()}>
            <Icon type="pushpin" /> &nbsp;附近
          </a>
        </div>
      );
    }

    return null;
  }

  renderTitle() {
    if (this.props.restype === SearchConsts.LIST_RESULT_FIND) {
      return this.props.search.poi.attributes[window.poiCfg[0].displayField];
    }
    if (this.props.restype === SearchConsts.LIST_RESULT_QUERY) {
      return this.props.search.nearbypoi.attributes[window.poiCfg[0].displayField];
    }
    return null;
  }

  render() {
    return (
      <div className={styles.wrap}>
        {!!this.props.search.list || !!this.props.search.nearbylist ? (
          <div className={styles.bar}>
            <a onClick={this.props.onReturnClick}>
              <Icon type="double-left" className={styles.returnIcon} />
            </a>
            <span className={styles.barText}>
              返回 &quot;
              {this.props.keyword}
              &quot; 的搜索结果
            </span>
          </div>
        ) : null}
        <div className={styles.content}>
          <div className={styles.itemtitle}>{this.renderTitle()}</div>

          {this.renderBar()}
          <div className={styles.itemdesc}>
            <section>
              <h2>
                <Icon type="environment" />
              </h2>
              <p>{this.getLocationValue()}</p>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ search, spacequery }) => {
  return { search, spacequery };
})(SearchResultDetail);
