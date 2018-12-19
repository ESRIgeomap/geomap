import React from 'react';
import { connect } from 'dva';
import { Button, Popover } from 'antd';

import AreaDistinctPopup from './AreaDistinctPopup';
import distinctLoader from '../../services/distinct';
import { ACTION_VIEW_EXTENT } from '../../constants/action-types';

import styles from './AreaSelector.css';

class StatAreaSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      city: null,
      country: null,
      path: '北京市',
    };
    this.handleMenuClick = ::this.handleMenuClick;
    this.handleVisibleChange = ::this.handleVisibleChange;
    this.handleSelectArea = ::this.handleSelectArea;
  }

  componentDidMount() {
    distinctLoader().then((resp) => {
      const { data } = resp;
      if (data) {
        this.setState({ data });
      }
    });
  }

  handleMenuClick({ key }) {
    const iKey = parseInt(key, 10);
    this.props.dispatch({
      type: 'agsmap/setStatArea',
      payload: isNaN(iKey) ? null : this.props.agsmap.areas[iKey],
    });
  }

  handleVisibleChange(visible) {
    this.setState({ visible });
  }

  handleSelectArea(e) {
    this.setState({
      ...e,
    });
    this.props.dispatch({
      type: ACTION_VIEW_EXTENT,
      payload: {
        city: e.city,
        country: e.country,
      },
    });
  }

  render() {
    const PopupContent = () => (
      <AreaDistinctPopup
        city={this.state.city}
        country={this.state.country}
        path={this.state.path}
        data={this.state.data}
        handleSelect={this.handleSelectArea}
      />
    );

    return (
      <Popover
        content={<PopupContent />}
        overlayClassName={styles.popover}
        title={null}
        trigger="click"
        placement="bottom"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button className={this.props.className}>
          <span className={styles.content}>
            <span style={{ userSelect: 'none', fontSize: '12px' }}>
              {this.state.path}
            </span>
            <a
              href=""
              style={{ color: 'orange', marginLeft: 4, fontSize: '0.75em' }}
            >
              [更改区域]
            </a>
          </span>
        </Button>
      </Popover>
    );
  }
}

export default connect(({ agsmap }) => {
  return { agsmap };
})(StatAreaSelector);
