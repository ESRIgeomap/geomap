/*
 * 统计面板 按时间分类组件
 * @author pensiveant
 */

import React, { useEffect } from 'react';
import echarts from 'echarts';
import styles from './index.less';

const TimeClassifyChart = () => {
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
    myChart = echarts.init(document.getElementById('timeClassifyChartContainer'));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      grid: {
        top: 20,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7'],
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '数量',
          type: 'line',
          data: [200, 50, 270, 200, 300, 150, 200],
          itemStyle: {
            color: '#babed4',
          },
          areaStyle: {},
        },
      ],
    });
  }

  return (
    <div className={styles.timeClassifyChart}>
      <p className={styles.title}>按时间分类</p>
      <div className={styles.chart} id="timeClassifyChartContainer" />
    </div>
  );
};

export default TimeClassifyChart;
