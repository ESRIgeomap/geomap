/*
 * 日照分析组件
 * author:dengd
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Slider, DatePicker, Row, Col, Checkbox, Button, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './index.less';

const LightshadowPanle = ({ visible, closePanle }) => {
  const [sliderValue, setSliderValue] = useState(moment().hour() * 60 + moment().minute()); // 24小时滑块值
  const [dateValue, setDateValue] = useState(moment(new Date(), 'YYYY/MM/DD')); // 日期
  const [sliderTimer, setSliderTimer] = useState(); // 时间滑块的timer
  const [datePickerTimer, setDatePickerTimer] = useState(null); // 日期timer
  const [showShadow, setShowShadow] = useState(false); // 是否显示阴影

  // 当日照分析到达24点时自动停止
  useEffect(() => {
    if (sliderValue > 1440) {
      clearInterval(sliderTimer);
      setSliderTimer(null);
    }
    if (window.agsGlobal.view) {
      const date = moment(dateValue)
        .hour(parseInt(sliderValue / 60, 10))
        .minute(sliderValue % 60);
      window.agsGlobal.view.environment.lighting.date = Number(date.format('x'));
    }
  }, [sliderValue, dateValue]);

  /**
   * 日期控件选择change事件
   * author:dengd
   */
  const onDatepickerChange = value => {
    setDateValue(value);
  };

  /**
   * 时间播放按钮回调
   * author:dengd
   */
  const onSliderValueAdd = () => {
    if (sliderValue < 1440) {
      if (sliderTimer) {
        //暂停
        clearInterval(sliderTimer);
        setSliderTimer(null);
      } else {
        //播放
        setSliderTimer(setInterval(() => {
          // slidervalue数据同步
          setSliderValue(prevSilderValue => Number(prevSilderValue) + 5);
        }, 50));
      }
    }
  };

  /**
   * 日期播放按钮回调
   * author:dengd
   */
  const onDatepickerValueAdd = () => {
    if (!datePickerTimer) {
      // 播放
      setDatePickerTimer(setInterval(() => {
        setDateValue(prevDateValue => {
          const year = prevDateValue.year();
          const month = prevDateValue.month();
          const date = prevDateValue.date();
          return moment().year(year).month(month).date(date + 1);
        });
      }, 100));
    } else {
      // 停止
      clearInterval(datePickerTimer);
      setDatePickerTimer(null);
    }
  };

  /**
   * 时间轴点击回调
   * author:dengd
   */
  const onSliderChange = value => {
    // 将传入的value转换为小时，分钟
    const tempTime2 = dateValue.hour(parseInt(value / 60, 10)).minute(value % 60);
    setDateValue(tempTime2);
    setSliderValue(value);
  };

  /**
   * 显示阴影checkbox check事件回调
   * author:dengd
   */
  const onCheckBoxChange = e => {
    setShowShadow(e.target.checked);

    if (e.target.checked) {
      window.agsGlobal.view.environment.lighting.directShadowsEnabled = true;
    } else {
      window.agsGlobal.view.environment.lighting.directShadowsEnabled = false;
    }
  };

  /**
   * 关闭按钮点击回调
   * author:dengd
   */
  const closeBtnOnClick = () => {
    closePanle();
  };

  const marks = {
    0: '0点',
    360: '6点',
    720: '12点',
    1080: '18点',
    1440: '24点',
  };

  // slider 按钮图标
  let iconOfSlider = null;
  if (sliderTimer) {
    iconOfSlider = <Icon type="pause" />;
  } else {
    iconOfSlider = <Icon type="caret-right" />;
  }

  // datepicker 按钮图标
  let iconOfDatePicker = null;
  if (datePickerTimer) {
    iconOfDatePicker = <Icon type="pause" />;
  } else {
    iconOfDatePicker = <Icon type="caret-right" />;
  }

  return (
    <div
      className={styles.modlediv}
      style={{
        display: visible ? 'block' : 'none',
      }}
    >
      <div className={styles.listdiv}>
        <div className={styles['panle-header']}>
          <p className={styles['panle-title']}>光照阴影</p>
          <Icon type="close" className={styles['close-btn']} onClick={closeBtnOnClick} />
        </div>
        <div className={styles.settingInfo}>
          <Row
            style={{
              marginBottom: '20px',
            }}
          >
            <Col offset={1} span={18}>
              <Slider
                marks={marks}
                max={1440}
                defaultValue={sliderValue}
                tipFormatter={null}
                value={sliderValue}
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
                { iconOfSlider }
              </Button>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: '20px',
            }}
          >
            <Col span={18} offset={1}>
              <DatePicker
                showToday={false}
                allowClear={false}
                defaultValue={dateValue}
                value={dateValue}
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
                { iconOfDatePicker }
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={1}>
              <Checkbox
                defaultChecked={showShadow}
                checked={showShadow}
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
};

export default connect(() => {
  return {

  };
})(LightshadowPanle);
