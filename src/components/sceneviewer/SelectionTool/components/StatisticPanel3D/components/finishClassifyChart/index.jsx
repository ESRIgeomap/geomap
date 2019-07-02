/*
 * 统计面板 完成情况组件
 * @author pensiveant
 */

import React, { useEffect } from 'react';
import echarts from 'echarts';
import styles from './index.less';

const FinishClassifyChart = () => {
  let myChart = null;

  useEffect(() => {
    init();

    return () => {
      if (myChart) {
        myChart.dispose();
      }
    };
  }, []);

  function init() {
    myChart = echarts.init(document.getElementById('finishClassifyChartContainer'));

    var labelLeft = {
      normal: {
        color: '#44D7B6',
        label: {
          show: true,
          position: 'center',
          formatter: '{b}',
          textStyle: {
            baseline: 'bottom',
          },
        },
        labelLine: {
          show: false,
        },
      },
    };

    var labelMiddle = {
      normal: {
        color: '#FF9E5E',
        label: {
          show: true,
          position: 'center',
          formatter: '{b}',
          textStyle: {
            baseline: 'bottom',
          },
        },
        labelLine: {
          show: false,
        },
      },
    };

    var labelRight = {
      normal: {
        color: '#32C5FF',
        label: {
          show: true,
          position: 'center',
          formatter: '{b}',
          textStyle: {
            baseline: 'bottom',
          },
        },
        labelLine: {
          show: false,
        },
      },
    };

    var labelBottom = {
      normal: {
        color: '#D1D0D0',
        label: {
          show: true,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
      },
      emphasis: {
        color: '#ccc',
      },
    };

    var labelFromatter = {
      normal: {
        label: {
          position: 'center',
          formatter: function(params) {
            if (params.data.name !== 'other') {
              return params.value;
            }
            return '';
          },
          textStyle: {
            color: '#384750',
            fontSize: '30',
          },
          show: true,
        },
        labelLine: {
          show: false,
        },
      },
    };

    var radius = [30, 55];

    const option = {
      legend: {
        show: false,
      },
      title: {},
      toolbox: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          center: ['20%', '60%'],
          radius: radius,
          startAngle: 90,
          clockWise: false,
          y: '55%', // for funnel
          x: '0%', // for funnel
          itemStyle: labelFromatter,
          data: [
            { name: 'other', value: 30, itemStyle: labelBottom },
            { name: '已完', value: 70, itemStyle: labelLeft },
          ],
        },
        {
          type: 'pie',
          center: ['50%', '60%'],
          radius: radius,
          startAngle: 90,
          clockWise: false,
          y: '55%', // for funnel
          x: '20%', // for funnel
          itemStyle: labelFromatter,
          data: [
            { name: 'other', value: 90, itemStyle: labelBottom },
            { name: '进行', value: 10, itemStyle: labelMiddle },
          ],
        },
        {
          type: 'pie',
          center: ['80%', '60%'],
          radius: radius,
          startAngle: 90,
          clockWise: false,
          y: '55%', // for funnel
          x: '40%', // for funnel
          itemStyle: labelFromatter,
          data: [
            { name: 'other', value: 80, itemStyle: labelBottom },
            { name: '待启', value: 20, itemStyle: labelRight },
          ],
        },
      ],
    };

    // 绘制图表
    myChart.setOption(option);
  }

  return (
    <div className={styles.finishClassifyChart}>
      <p className={styles.chartTitle}>
        <span style={{ marginLeft: '70px' }}>已完</span>
        <span style={{ marginLeft: '88px' }}>进行</span>
        <span style={{ marginLeft: '93px' }}>待启</span>
      </p>
      <div className={styles.chart} id="finishClassifyChartContainer" />
    </div>
  );
};

export default FinishClassifyChart;
