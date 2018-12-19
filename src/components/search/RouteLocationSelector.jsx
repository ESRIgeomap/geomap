import React from 'react';
import { connect } from 'dva';
import { Icon, Button } from 'antd';
import styles from './RouteLocationSelector.css';

/**
 * 起点与终点二次选择器
 * 根据用户输入的关键词模糊查询的可选项
 */
class RouteLocationSelector extends React.Component {

  renderItems() {
    if (this.props.search.diropts) {
      return this.props.search.diropts.map((opt, index) => {
        return (
          <div className={styles.itemwrap} key={`solr-item-${index}`}>
            <div className={styles.itemicon}>
              <span>{index + 1}</span>
            </div>
            <div className={styles.itemcontent}>
              <span className={styles.itemtitle}>{opt.name}</span>
              <span className={styles.itemsubtitle}>{opt.address}</span>
            </div>
            <div className={styles.itemaction}>
              <Button size="small" onClick={() => this.props.onSelect(opt)}>{`选为${this.props.search.dirlttext}`}</Button>
            </div>
          </div>
        );
      });
    }

    return null;
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.banner}>
          <Icon type="question-circle-o" className={styles.icon} />
          <h4 className={styles.title}>{this.props.title}</h4>
        </div>
        <div className={styles.diroptlist}>{this.renderItems()}</div>
      </div>
    );
  }
}

export default connect(({ search }) => {
  return {
    search,
  };
})(RouteLocationSelector);
