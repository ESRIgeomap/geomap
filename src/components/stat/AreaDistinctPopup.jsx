import React from 'react';
import { Tabs } from 'antd';

import styles from './AreaDistinctPopup.css';

const TabPane = Tabs.TabPane;

class AreaDistinctPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: null,
      country: null,
      path: '',
    };
  }

  handleSelect(item) {
    const { children, code, name } = item;
    const path = this.state.path || this.props.path;
    const paths = path.split('->');
    if (code === 'province') {
      // 选中的是省
      this.setState({ city: null, country: null, path: '福建省' });
      this.props.handleSelect({ city: null, country: null, path: '福建省' });
    } else if (children) {
      // 选中的是市
      this.setState({
        city: item,
        country: null,
        path: [paths[0], name].join('->'),
      });
      this.props.handleSelect({
        city: item,
        country: null,
        path: [paths[0], name].join('->'),
      });
    } else {
      // 选中的是县
      this.setState({
        country: item,
        path: [paths[0], paths[1], name].join('->'),
      });
      this.props.handleSelect({
        country: item,
        path: [paths[0], paths[1], name].join('->'),
      });
    }
  }

  renderItems(items) {
    const links = [];

    for (const item of items) {
      links.push(
        <a
          href=""
          className={styles.linkitem}
          onClick={(e) => {
            e.preventDefault();
            this.handleSelect(item);
          }}
          key={item.code}
        >
          {item.name}
        </a>,
      );
    }

    return <div className={styles.itemwrap}>{links}</div>;
  }

  renderTabTitle() {
    const city = this.state.city || this.props.city;
    if (city) {
      return city.name;
    }

    return '请选择';
  }

  renderTabItems() {
    const city = this.state.city || this.props.city;
    if (city) {
      return city.children;
    }

    return [];
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <Tabs defaultActiveKey="city">
            <TabPane key="city" tab="福建省">
              {this.renderItems([
                { name: '福建省', code: 'province' },
                ...this.props.data[0].children,
              ])}
            </TabPane>
            <TabPane key="country" tab={this.renderTabTitle()}>
              {this.renderItems(this.renderTabItems())}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default AreaDistinctPopup;
