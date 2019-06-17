import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import startLocSrc from '../images/icon_起.png';
import endLocSrc from '../images/icon_终.png';
import busSrc from '../images/icon_bus.png';
import walkSrc from '../images/icon_walk.png';
import metroSrc from '../images/icon_subway.png';

import styles from './BusLineResult.css';

const Panel = Collapse.Panel;

function buildLineHeader(names) {
  const headers = [];

  let index = 0;
  for (const name of names) {
    if (headers.length > 0) {
      headers.push(
        <span className={styles.lineSubjectSep} key={`line-header-${index}`}>
          &gt;
        </span>
      );
      index += 1;
    }

    headers.push(
      <span className={styles.lineSubjectTitle} key={`line-header-${index}`}>
        <span>{name}</span>
      </span>
    );
    index += 1;
  }

  return headers;
}

function buildLineDescription(line, idx) {
  const timeToUse = line.segments.reduce((prev, curr) => {
    const segTime = curr.segmentLine.reduce((pprev, ccurr) => {
      let segTotal = ccurr.segmentTime;

      if (ccurr.segmentTransferTime) {
        segTotal += ccurr.segmentTransferTime;
      }
      return pprev + segTotal;
    }, 0);

    return prev + segTime;
  }, 0);
  const huanchengCount = line.lineName.split('|').filter(n => n.trim() !== '').length;
  const huancheng = huanchengCount > 1 ? `换乘 ${huanchengCount - 1} 次` : '不换乘';

  const distance = line.segments.reduce((prev, curr) => {
    const segDistance = curr.segmentLine.reduce((pprev, ccurr) => {
      return pprev + ccurr.segmentDistance;
    }, 0);

    return prev + segDistance;
  }, 0);

  return [
    <span key={`line-time-${idx}`}>
      约<strong>{timeToUse}</strong>分钟
    </span>,
    <span className={styles.lineDescSep} key={`line-lineDescSep1-${idx}`}>|</span>,
    <span key={`line-distance-${idx}`}>
      约<strong>{`${(distance / 1000).toFixed(2)}`}</strong>公里
    </span>,
    <span className={styles.lineDescSep} key={`line-lineDescSep2-${idx}`}>|</span>,
    <span key={`line-huancheng-${idx}`}>{`${huancheng}`}</span>,
  ];
}

class BusLineResult extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSwitchLine = (key) => {
    if (key) {
      const index = key.replace('busline-', '');
      this.props.dispatch({ type: 'search/drawBusLine', payload: index });
    }
  }

  highlightSegment = (index) => {
    this.props.dispatch({ type: 'search/highlightSegment', payload: index });
  }

  renderWalkSegment(segment, index) {
    const { stationEnd } = segment;
    // const start = stationStart.uuid ? stationStart.name : '起点';
    const end = stationEnd.uuid ? stationEnd.name : '终点';

    return (
      <div className={styles.lineDetailWrap} key={`linedetail-${index}`}>
        <span
          key={`walkSegment-${index}`}
          className={styles.lineDetailContent}
          style={{
            borderTop: '1px solid #ececec',
            borderBottom: '1px solid #ececec',
          }}
        >
          <span className={styles.lineDetailWalkIconWrap} />
          <img alt="" src={walkSrc} className={styles.lineDetailWalkIcon} />
          <div className={styles.lineDetailContentWrap}>
            <span
              className={styles.lineDetailSegment}
              onMouseDown={() => this.highlightSegment(index)}
            >
              {/* <span>步行至</span>
              <span>&nbsp;{`${end}`}&nbsp;</span> */}
              <span>&nbsp;{`${stationEnd.name}`}&nbsp;</span>
            </span>
          </div>
        </span>
      </div>
    );
  }

  renderMetroSegment(segment, index, name) {
    const { stationStart, stationEnd } = segment;

    return (
      <div className={styles.lineDetailBusWrap} key={`linedetail-${index}`}>
        <span className={styles.lineDetailBusIconWrap} key={`linedetail-span-${index}`} />
        <img alt="" src={metroSrc} className={styles.lineDetailBusIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div
            className={styles.lineDetailSegment}
            onMouseDown={() => this.highlightSegment(index)}
          >
            <div className={styles.lineDetailBusLine}>{name}</div>
          </div>
          <div className={styles.lineDetailBusLineSolution}>
            <span>{`${stationStart.name} 上车`}</span>
            <span>{`${stationEnd.name} 下车`}</span>
          </div>
        </div>
      </div>
    );
  }

  renderBusSegment(segment, index, name) {
    const { stationStart, stationEnd } = segment;

    return (
      <div className={styles.lineDetailBusWrap} key={`linedetail-${index}`}>
        <span className={styles.lineDetailBusIconWrap} key={`linedetail-span-${index}`} />
        <img alt="" src={busSrc} className={styles.lineDetailBusIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div
            className={styles.lineDetailSegment}
            onMouseDown={() => this.highlightSegment(index)}
          >
            <div className={styles.lineDetailBusLine}>{name}</div>
          </div>
          <div className={styles.lineDetailBusLineSolution}>
            <span>{`${stationStart.name} 上车`}</span>
            <span>{`${stationEnd.name} 下车`}</span>
          </div>
        </div>
      </div>
    );
  }

  renderLineDetails(line) {
    const { lineName, segments } = line;
    const lineNames = lineName.split('|');
    const details = [];

    // start
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-start">
        <span className={styles.lineDetailStartIconWrap} key="linedetail-start-span" />
        <img alt="" src={startLocSrc} className={styles.lineDetailStartIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>起点</div>
        </div>
      </div>
    );

    let lineNameIndex = 0;
    segments.forEach((segment, index) => {
      const { segmentType } = segment;
      switch (segmentType) {
        //         1：火车
        // 2：飞机
        // 3：公交
        // 4：驾车
        // 5：步行
        // 6：大巴
        // case 1: {
        //   details.push(this.renderWalkSegment(segment, index));
        //   break;
        // }
        // case 2: {
        //   details.push(this.renderBusSegment(segment, index, lineNames[lineNameIndex]));
        //   lineNameIndex += 1;
        //   break;
        // }
        // case 3: {
        //   details.push(this.renderMetroSegment(segment, index, lineNames[lineNameIndex]));
        //   lineNameIndex += 1;
        //   break;
        // }
        case 5: {
          details.push(this.renderWalkSegment(segment, index));
          break;
        }
        case 3: {
          details.push(this.renderBusSegment(segment, index, lineNames[lineNameIndex]));
          lineNameIndex += 1;
          break;
        }
        // case 3: {
        //   details.push(this.renderMetroSegment(segment, index, lineNames[lineNameIndex]));
        //   lineNameIndex += 1;
        //   break;
        // }
        case 4: {
          break;
        }
        default:
          break;
      }
    });

    // end
    details.push(
      <div className={styles.lineDetailWrap} key="linedetail-end">
        <span className={styles.lineDetailEndIconWrap} key="linedetail-end-span" />
        <img alt="" src={endLocSrc} className={styles.lineDetailEndIcon} />
        <div className={styles.lineDetailContentWrap}>
          <div className={styles.lineDetailStartContent}>终点</div>
        </div>
      </div>
    );

    return <div>{details}</div>;
  }

  renderLines() {
    if (this.props.search.lines) {
      return this.props.search.lines.map((l, idx) => {
        const names = l.lineName.split('|').filter(n => n.trim() !== '');

        return (
          <Panel
            key={`busline-${idx}`}
            header={
              <div className={styles.headerWrap}>
                <div className={styles.lineSubject}>{buildLineHeader(names)}</div>
                <div className={styles.lineDesc}>{buildLineDescription(l, idx)}</div>
              </div>
            }
          >
            {this.renderLineDetails(l)}
          </Panel>
        );
      });
    }

    return [];
  }

  render() {
    return (
      <div className={styles.wrap}>

        {/* <Scrollbars style={{ height: 750 }}> */}
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
})(BusLineResult);
