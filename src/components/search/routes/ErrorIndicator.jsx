import { useRef, useState, useEffect } from 'react';
// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import imgSrc from '../images/fail.gif';

import styles from './ErrorIndicator.css';

const ErrorIndicator = props => {
    return (
      <div className={styles.wrap}>
        <img alt="" src={imgSrc} className={styles.icon} />
        <span className={styles.msg}>{this.props.msg}</span>
      </div>
    );
}

ErrorIndicator.propTypes = {
  msg: PropTypes.string,
};

export default connect()(ErrorIndicator);