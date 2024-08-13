<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane  v-for="(item,index) in names" :key="index" :label="item" :name="item">
          <div :ref="(el) =>doms[index] = el" style="width:640px;height: 360px;">
            <div v-if="names.indexOf(activeName) === 4">
               <el-table class="table" :data="tableData"
                    :header-cell-style="{  fontSize: '14px',color:'black',backgroundColor:'#f5f7fa' }">
                    <el-table-column prop="date"  label="时间"  align="center" />
                    <el-table-column prop="neckOfFemur1" label="股骨颈" />
                    <el-table-column prop="neckOfFemur2" label="股骨粗隆" />
                    <el-table-column prop="neckOfFemur3" label="股骨粗隆间" />
                    <el-table-column prop="neckOfFemur4" label="全髋" />
                </el-table> 
            </div>
          </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref,watch } from "vue";
import * as echarts from 'echarts';
import { dayjs } from "element-plus";
import type { TabsPaneContext } from 'element-plus'
const names = ["颈干角","TAD","假体髓腔占比面积","阳（阴）性支撑","骨密度"];
let activeName = ref(names[0]);
const props = defineProps(['chartData']);
let doms:any[] = [];
let options:any[] = [];
const handleClick = (tab: TabsPaneContext, event: Event) => {
  const activeIndex = Number(tab.index);
  if(activeIndex === 4) return;
  let myChart = echarts.init(doms[activeIndex]);//会有重复渲染，但是echarts本身会阻止这个行为
  myChart.setOption(options[activeIndex]);
}
let tableData = ref<any>([]);
watch(() => props.chartData,() =>{
  options = [
  {
    xAxis: {
      type: 'category',
      data: props.chartData.timeList.map((time:any) => dayjs(time).format("YYYY-MM-DD"))
    },
    yAxis: {
      type: 'value'
    },
    grid:{
      left:'30px',
      top:'40px'
    },
    series: [
      {
        data: props.chartData.neckShaftAngleList.map((item:any) => item || 0),
        type: 'line'
      }
    ]
  },
  {
    xAxis: {
      type: 'category',
      data: props.chartData.timeList.map((time:any) => dayjs(time).format("YYYY-MM-DD"))
    },
    yAxis: {
      type: 'value'
    },
    grid:{
      left:'30px',
      top:'40px'
    },
    series: [
      {
        data: props.chartData.TADList.map((item:any) => item || 0),
        type: 'line'
      }
    ]
  },
  {
    xAxis: {
      type: 'category',
      data: props.chartData.timeList.map((time:any) => dayjs(time).format("YYYY-MM-DD"))
    },
    yAxis: {
      type: 'value'
    },
    grid:{
      left:'30px',
      top:'40px'
    },
    series: [
      {
        data: props.chartData.negativeSupportList.map((item:any) => item || 0),
        type: 'line'
      }
    ]
  },
  {
    xAxis: {
      type: 'category',
      data: props.chartData.timeList.map((time:any) => dayjs(time).format("YYYY-MM-DD"))
    },
    yAxis: {
      type: 'value'
    },
    grid:{
      left:'30px',
      top:'40px'
    },
    series: [
      {
        data: props.chartData.neckShaftAngleList.map((item:any) => item || 0),
        type: 'line'
      }
    ]
  },
  ];
  tableData.value = props.chartData.neckOfFemur.map((item:any,index:number) => {
      return {
        ...item,
        date:dayjs(props.chartData.timeList[index]).format("YYYY-MM-DD")
      }
  })
  let myChart = echarts.init(doms[0]);
  myChart.setOption(options[0]);
},{deep:true});

</script>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: var(--el-color-primary);
  font-size: 32px;
  font-weight: 600;
}

// .demo-tabs div {
//   width: 100%;
//   height: 360px;
// }
</style>