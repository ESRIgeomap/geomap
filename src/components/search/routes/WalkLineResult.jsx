import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import { DOMParser } from 'xmldom';
import startLocSrc from '../images/icon_起.png';
import endLocSrc from '../images/icon_终.png';

import styles from './BusLineResult.css';

const Panel = Collapse.Panel;

function html2Escape(sHtml) {
  return sHtml.replace(/<[^<>]+?>/g, ''); //删除所有HTML标签
}

function toDecimal(x) {
  var f = parseFloat(x / 1000);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(f * 10) / 10;
  return f;
}

class WalkLineResult extends React.Component {
  constructor(props) {
    super(props);
    this.handleSwitchLine = ::this.handleSwitchLine;
    this.highlightSegment = ::this.highlightSegment;
  }

  handleSwitchLine(key) {
    if (key) {
      const index = key.replace('walkline-', '');
      this.props.dispatch({ type: 'search/drawBusLine', payload: index });
    }
  }

  highlightSegment(index) {
    this.props.dispatch({ type: 'search/highlightSegment', payload: index });
  }


  renderLineDetails(line) {

    const details = [];

    // start
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-start">
        <span className={styles.lineDetailStartIconWrap} />
        <img alt="" src={startLocSrc} className={styles.lineDetailStartIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>起点</div>
        </div>
      </div>
    );

    line.steps.forEach((segment, index) => {
      const { instruction, duration, distance } = segment;
      const zhuan = html2Escape(instruction);
      details.push(
        <div className={styles.lineDetailBusWrap} key={`linedetail-${index}`}>
          <span className={styles.lineDetailBusIconWrap} />
          <div className={styles.lineDetailContentWrap}>
            <div
              className={styles.lineDetailSegment}
              onMouseDown={() => this.highlightSegment(index)}
            >
              <div className={styles.lineDetailBusLine}>{zhuan}</div>
            </div>
            {/*<div className={styles.lineDetailBusLineSolution}>
              <span>{zhuan}</span>
      </div>*/}
          </div>
        </div>
      );
    });
    // end
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-end">
        <span className={styles.lineDetailEndIconWrap} />
        <img alt="" src={endLocSrc} className={styles.lineDetailEndIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>终点</div>
        </div>
      </div>
    );

    return <div>{details}</div>;
  }

  renderLines() {
    if (this.props.search.walkresult) {
      return (
        <Panel
          key="walkline-result"
          header={
            <div className={styles.headerWrap}>
              <div className={styles.lineSubject}>
                规划路径
              </div>
              <div className={styles.lineDesc}>
                <span>
                  约<strong>{Math.round(this.props.search.walkresult.duration / 60)}</strong>
                  分钟
                </span>
                <span className={styles.lineDescSep}>|</span>
                <span>
                  约<strong>{toDecimal(this.props.search.walkresult.distance)}</strong>
                  公里
                </span>
              </div>
            </div>
          }
        >
          {this.renderLineDetails(this.props.search.walkresult)}
        </Panel>
      );
    }

    return [];
  }

  render() {
    return (
      <div className={styles.wrap}>
        {/* <Scrollbars style={{ height: 400 }}> */}
          <Collapse accordion onChange={this.handleSwitchLine} className="busline-result-collapse">
            {this.renderLines()}
          </Collapse>
        {/* </Scrollbars> */}
      </div>
    );
  }
}

export default connect(({ search }) => {
  return {
    search,
  };
})(WalkLineResult);
