<!-- 雷达图 -->
<template>
  <el-card>
    <template #header> 订单状态图 </template>
    <div :id="id" :class="className" :style="{ height, width }"/>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {groupBy, toPairsIn} from 'lodash'
const props = defineProps({
  id: {
    type: String,
    default: 'radarChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  },
  dataSource: {
    type: Array,
    default: () => [],
    required: true
  }
});
const newDataSource = computed(() => {
  return toPairsIn(groupBy(props.dataSource, 'status')).map(item => {
    return {
      name: item[0],
      value: item[1].length
    }
  })
})
const options = {
  title: {
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '订单数量',
      type: 'pie',
      radius: '50%',
      data: newDataSource.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
let myChart: echarts.ECharts;
const setChartOption = (options: any) => {
  myChart.setOption(options);
}
onMounted(() => {
  // 图表初始化
  myChart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  setChartOption(options);

  // 大小自适应
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});

watch(() => props.dataSource, () => {
  console.log('监测到')
  console.log(newDataSource.value)
  options.series[0].data = newDataSource.value
  setChartOption(options);
})
</script>
