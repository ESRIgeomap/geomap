import React from 'react';
import { connect } from 'dva';
import { List, Avatar, Icon } from 'antd';

import * as SearchConsts from '../../constants/search';
import styles from './SearchResultList.css';

const ListItem = List.Item;

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = ::this.renderItem;
    this.onSelectResult = ::this.onSelectResult;
    this.onPageChange = ::this.onPageChange;
  }

  onSelectResult(item, index) {
    const { restype } = this.props;
    if (restype === SearchConsts.LIST_RESULT_FIND) {
      this.props.dispatch({
        type: 'search/selectPoi',
        payload: { item, index, subMode: SearchConsts.SUBMODE_LOCATION_DETAIL },
      });
    }

    if (restype === SearchConsts.LIST_RESULT_QUERY) {
      this.props.dispatch({
        type: 'search/selectNearbyPoi',
        payload: { item, index },
      });
    }
  }

  onPageChange(page) {
    const { restype } = this.props;

    if (restype === SearchConsts.LIST_RESULT_FIND) {
      this.props.dispatch({ type: 'search/gotoPage', payload: page });
    } else if (restype === SearchConsts.LIST_RESULT_QUERY) {
      this.props.dispatch({ type: 'search/gotoNearbyPage', payload: page });
    }
  }

  renderItem(item, index) {
    const { restype } = this.props;
    if (restype === SearchConsts.LIST_RESULT_FIND) {
      return (
        <ListItem className={styles.itemwrap}>
          <ListItem.Meta
            avatar={
              <Avatar
                size="small"
                shape="circle"
                style={{
                  background: '#D81E06',
                }}
              >
                {index + 1}
              </Avatar>
            }
            title={
              <span
                className={styles.itemtitle}
                onMouseDown={() => this.onSelectResult(item, index)}
              >
                {item.attributes[window.poiCfg[0].displayField]}
              </span>
            }
            description={
              <span className={styles.itemdesc}>
                {item.attributes[window.poiCfg[0].locationField]}
              </span>
            }
          />
        </ListItem>
      );
    }

    if (restype === SearchConsts.LIST_RESULT_QUERY) {
      return (
        <ListItem className={styles.itemwrap}>
          <ListItem.Meta
            avatar={
              <Avatar
                size="small"
                shape="circle"
                style={{
                  background: '#D81E06',
                }}
              >
                {index + 1}
              </Avatar>
            }
            title={
              <span
                className={styles.itemtitle}
                onMouseDown={() => this.onSelectResult(item, index)}
              >
                {item.attributes[window.poiCfg[0].displayField]}
              </span>
            }
            description={
              <span className={styles.itemdesc}>
                {item.attributes[window.poiCfg[0].locationField]}
              </span>
            }
          />
        </ListItem>
      );
    }

    return null;
  }

  renderBar() {
    const { restype, search } = this.props;
    const { poi } = search;
    if (restype === SearchConsts.LIST_RESULT_FIND) {
      return (
        <span className={styles.barText}>
          {`共找到 ${this.props.data && this.props.data.length} 条搜索结果`}
        </span>
      );
    }

    if (restype === SearchConsts.LIST_RESULT_QUERY) {
      return (
        <a className={styles.barText} onClick={this.props.onHandleReturn}>
          <Icon type="double-left" />
          {` 返回"${poi.attributes[window.poiCfg[0].displayField]}"的详情`}
        </a>
      );
    }

    return null;
  }

  render() {
    const { restype, search } = this.props;
    const { poipager, nearbypager } = search;
    const pager = restype === SearchConsts.LIST_RESULT_FIND ? poipager : nearbypager;

    return (
      <div className={styles.wrap}>
        <div className={styles.bar}>{this.renderBar()}</div>
        <div className={styles.content}>
          <List
            itemLayout="horizontal"
            pagination={{
              ...pager,
              onChange: this.onPageChange,
              total: this.props.data && this.props.data.length,
            }}
            dataSource={
              (this.props.data &&
                this.props.data.slice(6 * (pager.current - 1), 6 * pager.current)) ||
              []
            }
            renderItem={this.renderItem}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ search }) => {
  return { search };
})(SearchResultList);
