/*
 * 统计面板 每日拆迁数量 组件
 * @author pensiveant
 */

import React, { useEffect } from 'react';
import echarts from 'echarts';
import styles from './index.less';

const RemoveNumberChart = () => {
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
    myChart = echarts.init(document.getElementById('removeNumberChartContanier'));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      grid: {
        top: 20,
        bottom: 40,
      },
      xAxis: {
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      },
      yAxis: {
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
          type: 'bar',
          barMaxWidth: 33,
          data: [5, 20, 36, 10, 10, 20, 12, 18, 23, 17, 33, 19],
          itemStyle: {
            color: '#3aa0ff',
          },
        },
      ],
    });
  }

  return (
    <div className={styles.removeNumberChart}>
      <p className={styles.title}>每日拆迁数量</p>
      <div className={styles.chart} id="removeNumberChartContanier" />
    </div>
  );
};

export default RemoveNumberChart;
