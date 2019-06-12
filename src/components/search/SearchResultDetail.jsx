import React from 'react';
import { connect } from 'dva';
import { Icon, Table } from 'antd';
import * as SearchConsts from '../../constants/search';

import styles from './SearchResultDetail.css';

class SearchResultDetail extends React.Component {
  getLocationValue() {
    return this.props.search.poi.attributes[window.poiCfg[0].locationField];
  }

  renderBar() {
    return (
      <div className={styles.itembar}>
        <a onClick={() => this.props.onNearbyClick()}>
          <Icon type="pushpin" /> &nbsp;附近
        </a>
      </div>
    );
  }

  renderTitle() {
    return this.props.search.poi.attributes[window.poiCfg[0].displayField];
  }

  renderDetailContent() {
    let item = this.props.search.poi;
    let dataSource = [];
    const notShowField = ['searchText', 'x', 'y', 'the_geom', 'location'];
    for (const attr in item.attributes) {
      if (item.attributes.hasOwnProperty(attr) && notShowField.indexOf(attr) < 0) {
        dataSource.push({
          key: attr + Math.round(),
          name: attr,
          value: item.attributes[attr],
        });
      }
    }

    const columns = [
      {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '字段值',
        dataIndex: 'value',
        key: 'value',
      },
    ];
    // scroll={{ y: 240,x:false }}
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
        size="small"
        bordered={true}
      />
    );
  }

  render() {
    let poi = this.props.search.poi;
    let title = '';
    if (poi) {
      let nameField;
      window.searchConfig.typeList.some(item => {
        if (poi.attributes.featureType === item.layerId) {
          nameField = item.nameField;
          return true;
        }
      });
      title = this.props.search.poi.attributes[nameField];
    }

    return (
      <div className={styles.wrap}>
        {!!this.props.search.list || !!this.props.search.nearbylist ? (
          <div className={styles.bar}>
            {/* <a onClick={this.props.onReturnClick} title='返回'>
              <Icon type="left" className={styles.returnIcon} />
              &nbsp;返回
            </a> */}
            {title}
            {poi && poi.attributes.featureTypeDesc === '管线' ? (
              <a
                onClick={e => {
                  this.mileageChart(poi.attributes.eventid);
                }}
                className={styles.viewMileageMapIcon}
              >
                <Icon type="line-chart" title="查看里程图" />
                &nbsp;&nbsp;里程图
              </a>
            ) : null}
          </div>
        ) : null}
        <div className={styles.content}>
          {/* <div className={styles.itemtitle}>{this.renderTitle()}</div>
          {this.renderBar()}
          <div className={styles.itemdesc}>
            <section>
              <h2>
                <Icon type="environment" />
              </h2>
              <p>{this.getLocationValue()}</p>
            </section>
          </div> */}

          <div className={styles.itemDetailContent}>{this.renderDetailContent()}</div>
        </div>
      </div>
    );
  }

  mileageChart = async eventid => {
    debugger;
    this.props.dispatch({
      type: 'spacequery/showMileageLoading',
      payload: true,
    });
    await this.props.dispatch({
      type: SearchConsts.SEARCH_MILEAGECHART_DATA,
      payload: '04b24b4a-bd58-4e8f-a0b0-3f4dd6f52cec', //eventid //// stationserieseventid
    });
    this.props.dispatch({
      type: 'spacequery/changeMileageChartShow',
      payload: !this.props.spacequery.mileageChartShowFlag,
    });
  };
}

export default connect(({ search, spacequery }) => {
  return { search, spacequery };
})(SearchResultDetail);
