import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './ClassificationQuery.css';

class Classquery extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  selectGroup(item) {
    this.props.onItemClick(item);
  }

  renderClassitems() {
    return window.classfg.data.map((d, index) => {
      return (
        <li
          key={`q-class-${index}`}
          className={styles.titleLi}
          onClick={() => {
            this.selectGroup(d);
          }}
        >
          <div className={styles[d.icon]} />
          <span className={styles.groupSpan}>{d.alias}</span>
        </li>
      );
    });
  }

  render() {
    return (
      <div
        className={styles.wrap}
        style={{
          display: this.props.search.classquery ? 'block' : 'none',
        }}
      >
        <ul className={styles.contentUl}>{this.renderClassitems()}</ul>
      </div>
    );
  }
}

export default connect(({ search }) => {
  return {
    search,
  };
})(Classquery);
