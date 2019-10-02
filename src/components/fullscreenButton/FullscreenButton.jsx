import React, { Component } from 'react';

import { Icon } from 'antd';

import styles from './FullscreenButton.css';

class FullscreenButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icontype: 'fullscreen',
    };
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  toggleFullScreen() {
    // const el = e.target; // target兼容Firefox
    // console.log(el.getAttribute('data-icon'));
    // if (el.getAttribute('data-icon') === 'fullscreen') {
    if (this.state.icontype === 'fullscreen') {
      const docElm = document.documentElement;
      // docElm.webkitRequestFullscreen();
      // el.setAttribute('data-icon', 'fullscreen-exit');

      var requestMethod =
        docElm.requestFullScreen || //W3C
        docElm.webkitRequestFullScreen || //Chrome等
        docElm.mozRequestFullScreen || //FireFox
        docElm.msRequestFullScreen; //IE11
      if (requestMethod) {
        requestMethod.call(docElm);
      } else if (typeof window.ActiveXObject !== 'undefined') {
        //for Internet Explorer
        var wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
          wscript.SendKeys('{F11}');
        }
      }

      this.setState({
        icontype: 'fullscreen-exit',
      });
    } else {
      // document.webkitCancelFullScreen();
      // el.setAttribute('data-icon', 'fullscreen');
      var exitMethod =
        document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
      if (exitMethod) {
        exitMethod.call(document);
      } else if (typeof window.ActiveXObject !== 'undefined') {
        //for Internet Explorer
        var wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
          wscript.SendKeys('{F11}');
        }
      }

      this.setState({
        icontype: 'fullscreen',
      });
    }
  }

  render() {
    return (
      <div
        className={styles.fullScreen}
        onClick={this.toggleFullScreen}
        <Icon type={this.state.icontype} theme="outlined" style={{ fontSize: '24px' }} />
      </div>
    );
  }
}

export default FullscreenButton;
