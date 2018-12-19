import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import { DOMParser } from 'xmldom';

import startLocSrc from '../../assets/left/icon_起.png';
import endLocSrc from '../../assets/left/icon_终.png';

import styles from './BusLineResult.css';

const Panel = Collapse.Panel;

function buildLineDescription(xml) {
  const timeToUse = xml.documentElement.getElementsByTagName('duration')[0]
    .textContent;
  const distance = xml.documentElement.getElementsByTagName('distance')[0]
    .textContent;

  return [
    <span>
      约<strong>{Math.floor((+timeToUse / 60) * 100) / 100}</strong>
      分钟
    </span>,
    <span className={styles.lineDescSep}>|</span>,
    <span>
      约<strong>{Math.floor((+distance / 60) * 100) / 100}</strong>
      公里
    </span>,
  ];
}

class BusLineResult extends React.Component {
  constructor(props) {
    super(props);
    this.handleSwitchLine = ::this.handleSwitchLine;
    this.highlightSegment = ::this.highlightSegment;
  }

  handleSwitchLine(key) {
    if (key) {
      const index = key.replace('busline-', '');
      this.props.dispatch({ type: 'search/drawBusLine', payload: index });
    }
  }

  highlightSegment(index) {
    this.props.dispatch({
      type: 'search/highlightDriveSegment',
      payload: index,
    });
  }

  parseXml() {
    if (!this.xmlDoc) {
      const parser = new DOMParser();
      this.xmlDoc = parser.parseFromString(this.props.search.driveresult);
    }
  }

  renderLineDetails() {
    const simple = this.xmlDoc.documentElement.getElementsByTagName(
      'simple',
    )[0];
    const details = [];

    // start
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-start">
        <span className={styles.lineDetailStartIconWrap} />
        <img alt="" src={startLocSrc} className={styles.lineDetailStartIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>起点</div>
        </div>
      </div>,
    );

    for (let i = 0; i < simple.getElementsByTagName('item').length; i += 1) {
      const segment = simple.getElementsByTagName('item')[i];

      const segGuild = segment.getElementsByTagName('strguide')[0].textContent;
      const streetName = segment.getElementsByTagName('streetNames')[0]
        .textContent;

      details.push(
        <div className={styles.lineDetailBusWrap} key={`linedetail-${i}`}>
          <span className={styles.lineDetailBusIconWrap} />
          <div className={styles.lineDetailContentWrap}>
            <div
              className={styles.lineDetailSegment}
              onMouseDown={() => this.highlightSegment(i)}
            >
              <div className={styles.lineDetailBusLine}>{streetName}</div>
            </div>
            <div className={styles.lineDetailBusLineSolution}>
              <span>{segGuild}</span>
            </div>
          </div>
        </div>,
      );
    }

    // end
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-end">
        <span className={styles.lineDetailEndIconWrap} />
        <img alt="" src={endLocSrc} className={styles.lineDetailEndIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>终点</div>
        </div>
      </div>,
    );

    return <div>{details}</div>;
  }

  renderLines() {
    if (this.props.search.driveresult) {
      this.parseXml();

      return (
        <Panel
          key="driveline-result"
          header={
            <div className={styles.headerWrap}>
              <div className={styles.lineSubject}>规划路径</div>
              <div className={styles.lineDesc}>
                {buildLineDescription(this.xmlDoc)}
              </div>
            </div>
          }
        >
          {this.renderLineDetails()}
        </Panel>
      );
    }

    return [];
  }

  render() {
    return (
      <div className={styles.wrap}>
        <Scrollbars style={{ height: 400 }}>
          <Collapse
            accordion
            onChange={this.handleSwitchLine}
            className="busline-result-collapse"
          >
            {this.renderLines()}
          </Collapse>
        </Scrollbars>
      </div>
    );
  }
}

export default connect(({ search }) => {
  return {
    search,
  };
})(BusLineResult);
