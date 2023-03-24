<!-- 饼图 -->
<template>
  <el-card>
    <template #header> {{isSeller ? '最近7天产品销量' : '最近7天购买商品总数'}} </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>


<script setup lang="ts">
import * as echarts from 'echarts';
import {useUserStoreHook} from "@/store/modules/user";
const {isSeller} = useUserStoreHook()

const props = defineProps({
  id: {
    type: String,
    default: 'barChart'
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
const xData = computed(() => {
  return props.dataSource.map((item: any) => (item.date))
})
const yData = computed(() => {
  return props.dataSource.map((item: any) => (item.quantity))
})
const options = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: [`${isSeller ? '收入' : '支出'}`],
    textStyle: {
      color: '#999'
    }
  },
  xAxis: {
    type: 'category',
    data: xData.value,
    axisPointer: {
      type: 'shadow'
    }
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: `${isSeller ? '收入' : '支出'}`,
      type: 'bar',
      data: yData.value,
      itemStyle: {
        color: '#409EFF'
      }
    },
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
  options.xAxis.data = xData.value
  options.series[0].data = yData.value
  setChartOption(options);
})
</script>
