import React, { Component } from 'react';
import { connect } from 'dva';
import { Slider, DatePicker, Row, Col, Checkbox, Button, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './Lightshadow.css';
import env from '../../utils/env';

class LightshadowListTwo extends Component {
  constructor(props) {
    super(props);
    // this.props.dispatch({
    //   type: 'planningreview/valuetimeState',
    //   payload: moment(new Date(), 'YYYY/MM/DD'),
    // });
    // this.props.dispatch({
    //   type: 'planningreview/sliderValueState',
    //   payload: moment().hour() * 60 + moment().minute(),
    // });
    // this.props.dispatch({
    //   type: 'planningreview/timerOfDatepickerState',
    //   payload: setInterval(null, null),
    // });
    // this.props.dispatch({
    //   type: 'planningreview/timerOfSliderState',
    //   payload: setInterval(null, null),
    // });
    this.props.dispatch({
      type: 'agsmap/rebackInitlightState',
      payload: {
        showShadow: false,
        sliderPlay: false,
        datepickerPlay: false,
        valuetime: moment(new Date(), 'YYYY/MM/DD'),
        sliderValue: moment().hour() * 60 + moment().minute(),
        timerOfSlider: setInterval(null, null),
        timerOfDatepicker: setInterval(null, null),
        iconOfDatePicker: 'caret-right',
        iconOfSlider: 'caret-right',
      },
    });
    this.state = {
      // valuetime: moment(new Date(), 'YYYY/MM/DD'),
      // sliderValue: moment().hour() * 60 + moment().minute(),
      // sliderPlayState: false,
      // datepickerPlayState: false,
      // timerOfSlider: setInterval(null, null),
      // timerOfDatepicker: setInterval(null, null),
      // iconOfDatePicker: 'caret-right',
      // iconOfSlider: 'caret-right',
    };
    this.listvisible = this.listvisible.bind(this);
    this.onDatepickerChange = this.onDatepickerChange.bind(this);
    this.onSliderValueAdd = this.onSliderValueAdd.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onDatepickerValueAdd = this.onDatepickerValueAdd.bind(this);
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
  }

  onDatepickerChange(value) {
    this.props.dispatch({
      type: 'agsmap/valuetimeState',
      payload: value,
    });
    env.getParamAgs().view.environment.lighting.date = Number(
      value.format('x'),
    );
  }

  // 时间播放按钮
  onSliderValueAdd() {
    // 时间播放与暂停
    if (this.props.agsmap.sliderValue < 1440) {
      this.props.dispatch({
        type: 'agsmap/sliderPlayState',
        payload: !this.props.agsmap.sliderPlay,
      });
      if (this.props.agsmap.sliderPlay) {
        clearInterval(this.props.agsmap.timerOfSlider);
        this.props.dispatch({
          type: 'agsmap/iconOfSliderState',
          payload: 'caret-right',
        });
        // this.setState({
        //   iconOfSlider: 'caret-right',
        // });
      } else {
        this.props.dispatch({
          type: 'agsmap/timerOfSliderState',
          payload: setInterval(() => {
            let temp = this.props.agsmap.sliderValue;
            const tempTime1 = this.props.agsmap.valuetime
              .hour(parseInt(temp / 60, 10))
              .minute(temp % 60);
            // console.log(env.getParamAgs().view);
            env.getParamAgs().view.environment.lighting.date = Number(
              tempTime1.format('x'),
            );
            // slidervalue数据同步
            this.props.dispatch({
              type: 'agsmap/sliderValueState',
              payload: (temp += 5),
            });
            this.props.dispatch({
              type: 'agsmap/iconOfSliderState',
              payload: 'pause',
            });
            // this.setState({
            //   iconOfSlider: 'pause',
            // });
            if (temp > 1440) {
              clearInterval(this.state.timerOfSlider);
              this.props.dispatch({
                type: 'agsmap/iconOfSliderState',
                payload: 'caret-right',
              });
              // this.setState({
              //   iconOfSlider: 'caret-right',
              // });
              this.props.dispatch({
                type: 'agsmap/sliderPlayState',
                payload: !this.props.agsmap.sliderPlay,
              });
            }
          }, 10),
        });
      }
    }
  }

  // 日期播放按钮
  onDatepickerValueAdd() {
    this.props.dispatch({
      type: 'agsmap/datepickerPlayState',
      payload: !this.props.agsmap.datepickerPlay,
    });
    if (!this.props.agsmap.datepickerPlay) {
      this.props.dispatch({
        type: 'agsmap/timerOfDatepickerState',
        payload: setInterval(() => {
          const tempNowTime = this.props.agsmap.valuetime.add(
            1,
            'days',
          );
          env.getParamAgs().view.environment.lighting.date = Number(
            tempNowTime.format('x'),
          );
          this.props.dispatch({
            type: 'agsmap/valuetimeState',
            payload: tempNowTime,
          });
          this.props.dispatch({
            type: 'agsmap/iconOfDatePickerState',
            payload: 'pause',
          });
          // this.setState({
          //   iconOfDatePicker: 'pause',
          // });
        }, 100),
      });
    } else {
      clearInterval(this.props.agsmap.timerOfDatepicker);
      // this.props.dispatch({
      //   type: 'planningreview/timerOfDatepickerState',
      //   payload: setInterval(null, null),
      // });
      this.props.dispatch({
        type: 'agsmap/iconOfDatePickerState',
        payload: 'caret-right',
      });
      // this.setState({
      //   iconOfDatePicker: 'caret-right',
      // });
    }
  }

  onSliderChange(value) {
    // 将传入的value转换为小时，分钟
    const tempTime2 = this.props.agsmap.valuetime
      .hour(parseInt(value / 60, 10))
      .minute(value % 60);
    this.props.dispatch({
      type: 'agsmap/valuetimeState',
      payload: tempTime2,
    });
    this.props.dispatch({
      type: 'agsmap/sliderValueState',
      payload: value,
    });
    env.getParamAgs().view.environment.lighting.date = Number(
      tempTime2.format('x'),
    );
  }

  onCheckBoxChange(e) {
    if (e.target.checked) {
      env.getParamAgs().view.environment.lighting.directShadowsEnabled = true;
    } else {
      env.getParamAgs().view.environment.lighting.directShadowsEnabled = false;
    }
    this.props.dispatch({
      type: 'agsmap/shadowInitDataState',
      payload: e.target.checked,
    });
    // console.log('NOTHING:', this.props.planningreview.valuetime);
  }

  listvisible() {
    this.props.dispatch({
      type: 'agsmap/listChangeState',
      payload: {
        prolistflags: false,
        progralistflags: false,
        controllistflags: false,
        lightshadowlistflags: false,
      },
    });
    this.props.dispatch({
      type: 'init_lightshadow',
    });
    // initLightShadow();
    // this.props.dispatch({
    //   type: 'planningreview/rebackInitlightState',
    //   payload: {
    //     showShadow: false,
    //     sliderPlay: false,
    //     datepickerPlay: false,
    //     valuetime: moment(new Date(), 'YYYY/MM/DD'),
    //     sliderValue: moment().hour() * 60 + moment().minute(),
    //     timerOfSlider: setInterval(null, null),
    //     timerOfDatepicker: setInterval(null, null),
    //     iconOfDatePicker: 'caret-right',
    //     iconOfSlider: 'caret-right',
    //   },
    // });
    // clearInterval(this.props.planningreview.timerOfSlider);
    // clearInterval(this.props.planningreview.timerOfDatepicker);
  }

  render() {
    const marks = {
      0: '0点',
      360: '6点',
      720: '12点',
      1080: '18点',
      1440: '24点',
    };
    return (
      <div
        className={styles.modlediv}
        style={{
          display: this.props.agsmap.lightshadowlistflags
            ? 'block'
            : 'none',
        }}
        // style={{
        //   display: 'block',
        // }}
      >
        <div className={styles.listdiv}>
          <p className={styles.ptitle}>
            日照分析
            <span className={styles.spantitle} onClick={this.listvisible}>
              ×
            </span>
          </p>
          <div className={styles.settingInfo}>
            <Row
              style={{
                marginBottom: '8px',
              }}
            >
              <Col offset="1" span="18">
                <Slider
                  marks={marks}
                  max={1440}
                  defaultValue={this.props.agsmap.sliderValue}
                  tipFormatter={null}
                  value={this.props.agsmap.sliderValue}
                  onChange={this.onSliderChange}
                />
              </Col>
              <Col span="2" offset="1" className={styles.settingItem}>
                <Button
                  style={{
                    marginTop: '5px',
                  }}
                  type="primary"
                  shape="circle"
                  onClick={this.onSliderValueAdd}
                >
                  <Icon type={this.props.agsmap.iconOfSlider} />
                </Button>
              </Col>
            </Row>
            <Row
              style={{
                marginBottom: '8px',
              }}
            >
              <Col span="18" offset="1">
                <DatePicker
                  showToday={false}
                  allowClear={false}
                  defaultValue={this.props.agsmap.valuetime}
                  value={this.props.agsmap.valuetime}
                  format="YYYY-MM-DD"
                  onChange={this.onDatepickerChange}
                />
              </Col>
              <Col span="2" offset="1" className={styles.settingItem}>
                <Button
                  style={{
                    marginTop: '5px',
                  }}
                  type="primary"
                  shape="circle"
                  onClick={this.onDatepickerValueAdd}
                >
                  <Icon type={this.props.agsmap.iconOfDatePicker} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span="8" offset="8">
                <Checkbox
                  // defaultChecked={this.state.showShadow}
                  // checked={this.state.showShadow}
                  checked={this.props.agsmap.showShadow}
                  onChange={this.onCheckBoxChange}
                >
                  显示阴影
                </Checkbox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(LightshadowListTwo);
