import { useState } from 'react';
import { connect } from 'dva';
import { Input, Button, Tooltip } from 'antd';

import * as converters from './support/converters';
import * as conditions from './support/conditions';

import { VIEW_MODE_2D } from '../../constants/action-types';
import * as SearchConsts from '../../constants/search';

import styles from './GeoSearch.css';

const SearchComponent = ({ dispatch, search, agsmap }) => {
  const [text, setText] = useState('');
  const [nearbyText, setNearbyText] = useState('');
  const [nearbyCode, setNearbyCode] = useState(null);
  const [hint, setHint] = useState('搜地点、查公交、找路线');

  function renderContent() {
    if (conditions.isSearchingPoi(search.mode)) {
      switch (this.props.search.submode) {
        case SearchConsts.SUBMODE_LOCATION_NEARBY:
        case SearchConsts.SUBMODE_LOCATION_NEARBY_DETAIL:
          return (
            <div className={styles.inputgroup}>
              <span className={styles.inputhint}>
                在
                <a
                  title={this.props.search.poi.attributes[window.poiCfg[0].displayField]}
                >{`${displayText(
                  this.props.search.poi.attributes[window.poiCfg[0].displayField]
                )}`}</a>
                附近搜索
              </span>
              <Input
                className={styles.input}
                value={this.state.nearbytext}
                placeholder={this.state.hint}
                onChange={evt => {
                  this.setState({ nearbytext: evt.target.value });
                }}
                onClick={() => {
                  if (!this.state.nearbytext) {
                    this.handleClassqueryChoose();
                  }
                }}
              />
            </div>
          );
        default:
          return (
            <Input
              className={styles.input}
              value={this.state.text}
              placeholder={this.state.hint}
              onChange={evt => setText(evt.target.value)}
              onClick={() => {
                if (!text && search.submode !== SearchConsts.SUBMODE_LOCATION_DETAIL) {
                  this.handleClassqueryChoose();
                }
              }}
            />
          );
      }
    }

    return (
      <CircuitTypeSelector
        className={styles.dirselector}
        onChange={dirmode => dispatch({ type: 'search/switchDirMode', payload: dirmode })}
      />
    );
  }

  return (
    <div
      className={styles.leftPanel}
      style={{
        display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
        left: this.props.agsmap.menusflags ? '280px' : '70px',
        top: this.props.agsmap.splitflags ? '-280px' : '20px',
      }}
    >
      <div className={styles.wrap}>
        {renderContent()}
        <Tooltip title="搜索">
          <Button
            type="primary"
            icon="search"
            className={styles.searchbtn}
            onClick={this.handleSearch}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default connect(({ search, agsmap }) => {
  return {
    search,
    agsmap,
  };
})(SearchComponent);
