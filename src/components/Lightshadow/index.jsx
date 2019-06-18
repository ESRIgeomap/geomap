/*
 * 日照分析组件
 * author:pensiveant
 */

import React, {useEffect } from 'react';
import { connect } from 'dva';
import { Slider, DatePicker, Row, Col, Checkbox, Button, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './Lightshadow.css';


const LightshadowListTwo = ({ Lightshadow, dispatch, }) => {

  useEffect(() => {
    
    //设置日照分析的初始状态
    dispatch({
      type: 'Lightshadow/rebackInitlightState',
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

  }, [dispatch]);


  /**
   * 日期控件选择change事件
   * author:pensiveant
   */
  const onDatepickerChange = (value) => {
    dispatch({
      type: 'Lightshadow/valuetimeState',
      payload: value,
    });
    window.agsGlobal.view.environment.lighting.date = Number(value.format('x'));
  }

  /**
   * 时间播放按钮回调
   * author:pensiveant
   */
  const onSliderValueAdd = () => {
    if (Lightshadow.sliderValue < 1440) {
      dispatch({
        type: 'Lightshadow/sliderPlayState',
        payload: !Lightshadow.sliderPlay,
      });
      
      if (Lightshadow.sliderPlay) { //暂停
        clearInterval(Lightshadow.timerOfSlider);
        dispatch({
          type: 'Lightshadow/iconOfSliderState',
          payload: 'caret-right',
        });
        // this.setState({
        //   iconOfSlider: 'caret-right',
        // });
      } else { //播放

        dispatch({
          type: 'Lightshadow/timerOfSliderState',
          payload: setInterval(() => {
            let temp =Lightshadow.sliderValue;
            const tempTime1 =Lightshadow.valuetime
              .hour(parseInt(temp / 60, 10))
              .minute(temp % 60);
            window.agsGlobal.view.environment.lighting.date = Number(tempTime1.format('x'));
            // slidervalue数据同步
            dispatch({
              type: 'Lightshadow/sliderValueState',
              payload: (temp += 5),
            });
            dispatch({
              type: 'Lightshadow/iconOfSliderState',
              payload: 'pause',
            });
            // this.setState({
            //   iconOfSlider: 'pause',
            // });
            if (temp > 1440) {
              clearInterval(this.state.timerOfSlider);
              dispatch({
                type: 'Lightshadow/iconOfSliderState',
                payload: 'caret-right',
              });
              // this.setState({
              //   iconOfSlider: 'caret-right',
              // });
              dispatch({
                type: 'Lightshadow/sliderPlayState',
                payload: !Lightshadow.sliderPlay,
              });
            }
          }, 10),
        });
      }
    }
  }


  /**
   * 日期播放按钮回调
   * author:pensiveant
   */
  const onDatepickerValueAdd = () => {
    dispatch({
      type: 'Lightshadow/datepickerPlayState',
      payload: !Lightshadow.datepickerPlay,
    });
    if (!Lightshadow.datepickerPlay) {
      dispatch({
        type: 'Lightshadow/timerOfDatepickerState',
        payload: setInterval(() => {
          const tempNowTime =Lightshadow.valuetime.add(1, 'days');
          window.agsGlobal.view.environment.lighting.date = Number(tempNowTime.format('x'));
          dispatch({
            type: 'Lightshadow/valuetimeState',
            payload: tempNowTime,
          });
          dispatch({
            type: 'Lightshadow/iconOfDatePickerState',
            payload: 'pause',
          });
          // this.setState({
          //   iconOfDatePicker: 'pause',
          // });
        }, 100),
      });
    } else {
      clearInterval(Lightshadow.timerOfDatepicker);
      //dispatch({
      //   type: 'planningreview/timerOfDatepickerState',
      //   payload: setInterval(null, null),
      // });
      dispatch({
        type: 'Lightshadow/iconOfDatePickerState',
        payload: 'caret-right',
      });
      // this.setState({
      //   iconOfDatePicker: 'caret-right',
      // });
    }
  }



  /**
   * 时间轴点击回调
   * author:pensiveant
   */
  const onSliderChange = (value) => {
    // 将传入的value转换为小时，分钟
    const tempTime2 =Lightshadow.valuetime.hour(parseInt(value / 60, 10)).minute(value % 60);
    dispatch({
      type: 'Lightshadow/valuetimeState',
      payload: tempTime2,
    });
    dispatch({
      type: 'Lightshadow/sliderValueState',
      payload: value,
    });
    window.agsGlobal.view.environment.lighting.date = Number(tempTime2.format('x'));
  }


  /**
   * 显示阴影checkbox check事件回调
   * author:pensiveant
   */
  const onCheckBoxChange = (e) => {

    dispatch({
      type: 'Lightshadow/shadowInitDataState',
      payload: e.target.checked,
    });

    if (e.target.checked) {
      window.agsGlobal.view.environment.lighting.directShadowsEnabled = true;
    } else {
      window.agsGlobal.view.environment.lighting.directShadowsEnabled = false;
    }
  }

  /**
   * 关闭按钮点击回调
   * author:pensiveant
   */
  const listvisible = () => {
    dispatch({
      type: 'Lightshadow/listChangeState',
      payload: {
        lightshadowlistflags: false,
        prolistflags: false,
        progralistflags: false,
        controllistflags: false,   
      },
    });
    dispatch({
      type: 'init_lightshadow',
    });

    //设置toolbar的状态
    dispatch({
      type: 'toolbar/updateCurrentView',
      payload: null,
    });

  }

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
        display:Lightshadow.lightshadowlistflags ? 'block' : 'none',
      }}
    >
      <div className={styles.listdiv}>
        <p className={styles.ptitle}>
          日照分析
            <span className={styles.spantitle} onClick={listvisible}>
            ×
            </span>
        </p>
        <div className={styles.settingInfo}>
          <Row
            style={{
              marginBottom: '8px',
            }}
          >
            <Col offset={1} span={18}>
              <Slider
                marks={marks}
                max={1440}
                defaultValue={Lightshadow.sliderValue}
                tipFormatter={null}
                value={Lightshadow.sliderValue}
                onChange={onSliderChange}
              />
            </Col>
            <Col span={2} offset={1} className={styles.settingItem}>
              <Button
                style={{
                  marginTop: '5px',
                }}
                type="primary"
                shape="circle"
                onClick={onSliderValueAdd}
              >
                <Icon type={Lightshadow.iconOfSlider} />
              </Button>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: '8px',
            }}
          >
            <Col span={18} offset={1}>
              <DatePicker
                showToday={false}
                allowClear={false}
                defaultValue={Lightshadow.valuetime}
                value={Lightshadow.valuetime}
                format="YYYY-MM-DD"
                onChange={onDatepickerChange}
              />
            </Col>
            <Col span={2} offset={1} className={styles.settingItem}>
              <Button
                style={{
                  marginTop: '5px',
                }}
                type="primary"
                shape="circle"
                onClick={onDatepickerValueAdd}
              >
                <Icon type={Lightshadow.iconOfDatePicker} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Checkbox
                // defaultChecked={this.state.showShadow}
                // checked={this.state.showShadow}
                checked={Lightshadow.showShadow}
                onChange={onCheckBoxChange}
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

export default connect(({ Lightshadow,toolbar }) => {
  return {
    Lightshadow,
    toolbar,
  };
})(LightshadowListTwo);
