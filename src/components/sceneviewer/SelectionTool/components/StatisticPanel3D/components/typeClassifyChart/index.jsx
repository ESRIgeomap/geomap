/*
 * 统计面板，按房屋类别分类 组件
 * @author pensiveant
 */

import React, { useEffect } from 'react';
import echarts from 'echarts';
import styles from './index.less';

const TypeClassifyChart = () => {
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
    myChart = echarts.init(document.getElementById('typeClassifyChartDiv'));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      grid: {
        top: 20,
        bottom: 40,
      },
      xAxis: {
        data: ['1', '2', '3', '4', '5'],
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
          data: [
            {
              value: 120,
              itemStyle: { color: '#ff6f8e' },
            },
            {
              value: 30,
              itemStyle: { color: '#ff9e5e' },
            },
            {
              value: 50,
              itemStyle: { color: '#ffdd60' },
            },
            {
              value: 80,
              itemStyle: { color: '#44d7b6' },
            },
            {
              value: 40,
              itemStyle: { color: '#32c5ff' },
            },
          ],
          itemStyle: {
            color: '#3aa0ff',
          },
        },
      ],
    });
  }

  return (
    <div className={styles.typeClassifyChart}>
      <p className={styles.title}>按房屋类别分类</p>
      <div className={styles.chart} id="typeClassifyChartDiv" />
    </div>
  );
};

export default TypeClassifyChart;
