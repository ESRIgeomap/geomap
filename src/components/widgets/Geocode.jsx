/// <reference types="arcgis-js-api" />

import React from 'react';
import { Input, Select, Popover, Icon } from 'antd';

import AdvancedSearch from './AdvancedSearch';
import SearchResultList from '../search/SearchResultList';

import { search } from '../../services/geocode';
import { getDataById } from '../../utils/navitree';
import searchHelper from '../../utils/search-helper';
import { searchUsaGuideByCondition } from '../../services/otherneed';

const MODE_LOCATION = 'mode-location';
const MODE_SEARCH = 'mode-search';

const Option = Select.Option;

class Geocode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      extent: 'global',
      searchResults: null,
      showResult: false,
      showPopup: false,
      mode: MODE_LOCATION,
      quickSearchLayer: null,
      quickSearchField: null,
      condition: {},
      pagination: {
        current: 1,
        pageSize: 9,
        size: 'small',
      },
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleExtentChange = this.handleExtentChange.bind(this);
    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
    this.handleCancelSearch = this.handleCancelSearch.bind(this);
    this.handleClosePop = this.handleClosePop.bind(this);
    this.handleLayerQuickSearch = this.handleLayerQuickSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination };
    const { mode } = this.state;
    pager.current = pagination.current;
    const condition = {
      ...this.state.condition,
      page: pager.current,
    };
    this.setState({
      pagination: pager,
      condition,
    });
    if (mode === MODE_SEARCH &&
      this.state.quickSearchLayer === '36100') {
      searchHelper.clearGraphics();
      this.searchUsaGuide(condition);
    }
  }

  handleSearchFieldChange(value) {
    this.setState({ quickSearchField: value });
  }

  handleCancelSearch() {
    this.setState({
      mode: MODE_LOCATION,
      showResult: false,
      quickSearchLayer: null,
      quickSearchField: null,
    });
    searchHelper.clearGraphics();
  }

  handleClosePop() {
    this.setState({ showPopup: false });
    searchHelper.clearGraphics();
  }

  handleExtentChange(e) {
    const pager = {
      ...this.state.pagination,
      current: 1,
    };
    const condition = {
      ...this.state.condition,
      extent: e.target.value,
    };

    this.setState({
      extent: e.target.value,
      pagination: pager,
      condition,
    });
    this.search(condition);
  }

  search(condition) {
    if (condition.layer === '36100') {
      this.searchUsaGuide(condition);
    } else if (condition.layer === 'ais') {
      this.searchAisInfo(condition);
    } else {
      this.searchAgsLayer(condition);
    }
  }

  handleClick() {
    const pager = {
      ...this.state.pagination,
      current: 1,
    };
    const condition = {
      ...this.state.condition,
      text: this.state.value,
      field: this.state.quickSearchField,
      extent: this.state.extent,
      page: 1,
    };
    this.setState({ pagination: pager, condition });

    if (this.state.mode === MODE_LOCATION) {
      this.searchLocation();
    } else if (this.state.mode === MODE_SEARCH) {
      this.search(condition);
    }
  }

  handleLayerQuickSearch(id) {
    const pager = {
      ...this.state.pagination,
      current: 1,
    };
    let field;
    if (id === 'ais') {
      field = 'AIS_SHIPNAME';
    } else {
      const layerId = parseInt(id, 10);
      const confData = getDataById(layerId);
      field = confData.searchTitle;
    }
    const condition = {
      ...this.state.condition,
      layer: id,
      text: '',
      extent: this.state.extent,
      page: 1,
    };
    this.setState({
      mode: MODE_SEARCH,
      showResult: true,
      value: '',
      condition,
      quickSearchLayer: id,
      quickSearchField: field,
      pagination: pager,
    });
    this.search(condition);
  }

  searchAgsLayer(condition) {
    const promise = searchHelper.searchLayerByCondition(condition);
    if (promise) {
      promise.then((result) => {
        if (result) {
          const pager = {
            ...this.state.pagination,
            total: result.features.length,
          };
          this.setState({
            searchResults: result,
            pagination: pager,
          });
          searchHelper.addGraphics(result, condition.layer);
        }
      });
    }
  }

  searchAisInfo(condition) {
    const promise = searchHelper.searchAisLayerByCondition(condition);
    promise.then(
      (result) => {
        if (result) {
          const pager = {
            ...this.state.pagination,
            total: result.features.length,
          };
          this.setState({
            searchResults: result,
            pagination: pager,
          });
          searchHelper.addAisGraphics(result);
        }
      },
    );
  }

  searchUsaGuide(condition) {
    searchUsaGuideByCondition(condition).then(
      (result) => {
        const { data } = result;

        if (data) {
          const pager = {
            ...this.state.pagination,
            total: data.count,
          };
          const features = searchHelper.buildUsaGuideGraphics(data.list);
          this.setState({
            searchResults: { features },
            pagination: pager,
          });
          searchHelper.addUsaGuideGraphics(features);
        }
      });
  }

  searchLocation() {
    if (!this.state.value) {
      return;
    }

    this.setState({ quickSearchField: 'title' });

    search(this.state.value).then((result) => {
      if (result.err) {
        // 错误处理
      }

      const { data } = result;
      if (data.status === 0) {
        const graphic = searchHelper.buildGeocodeLocationGraphic(data.result, this.state.value);
        const pager = {
          ...this.state.pagination,
          total: 1,
        };
        this.setState({
          showResult: true,
          searchResults: { features: [graphic] },
          pagination: pager,
        });

        searchHelper.zoomToGeocodeLocation(graphic);
      }
    });
  }

  renderPopupContent() {
    if (!this.state.showResult) {
      return (<AdvancedSearch
        onQuickSearch={this.handleLayerQuickSearch}
        onClose={this.handleClosePop}
      />);
    } else {
      return (
        <SearchResultList
          mode={this.state.mode}
          layer={this.state.quickSearchLayer}
          field={this.state.quickSearchField}
          extent={this.state.extent}
          data={this.state.searchResults}
          onCancel={this.handleCancelSearch}
          onClose={this.handleClosePop}
          onExtentChange={this.handleExtentChange}
          pagination={this.state.pagination}
          onTableChange={this.handleTableChange}
        />
      );
    }
  }

  renderFields() {
    const layerId = this.state.quickSearchLayer;
    if (layerId === 'ais') {
      return [
        <Option key="name" value="AIS_SHIPNAME">船舶名称</Option>,
      ];
    } else {
      const fields = searchHelper.getSearchFieldsById(layerId);
      if (fields) {
        return fields.map((f, idx) => (
          <Option key={`${idx}`} value={f.field}>{f.alias}</Option>
        ));
      }
    }

    return null;
  }

  renderSuffix() {
    if (this.state.mode === MODE_LOCATION) {
      return null;
    }

    return (
      <Select
        style={{ width: 80, color: 'yellow' }}
        value={this.state.quickSearchField}
        onChange={v => this.handleSearchFieldChange(v)}
      >
        {this.renderFields()}
      </Select>
    );
  }

  renderFieldsetLegend() {
    if (this.state.mode === MODE_LOCATION) {
      return '地名地址';
    }

    const layerId = this.state.quickSearchLayer;
    if (layerId === 'ais') {
      return 'AIS信息';
    }

    const id = parseInt(layerId, 10);
    const confData = getDataById(id);
    return confData.label;
  }

  render() {
    return (
      <div className="geocode-search">
        <Popover
          title={null}
          content={this.renderPopupContent()}
          placement="bottom"
          autoAdjustOverflow={false}
          visible={this.state.showPopup}
          overlayClassName="geocode-advanced"
        >
          <form>
            <fieldset className="geocode-fieldset">
              <legend>{this.renderFieldsetLegend()}</legend>
              <div className="geocode-search-wrap">
                <Input
                  style={{ flex: 'auto' }}
                  value={this.state.value}
                  addonBefore={this.renderSuffix()}
                  onChange={e => this.setState({ value: e.target.value })}
                  onFocus={() => {
                    // if (!this.state.showPopup) {
                    //   this.setState({ showPopup: true });
                    // }
                  }}
                  size="small"
                />
                <a onClick={this.handleClick}><Icon type="search" /></a>
              </div>
            </fieldset>
          </form>
        </Popover>
      </div>
    );
  }
}

export default Geocode;
