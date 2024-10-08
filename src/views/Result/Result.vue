<template>
    <div class="root-container">
        <TopNav></TopNav>
        <div class="content">
            <el-card class="card">
                <div class="header">
                    <div>
                        <h4 @click="$router.back()">
                            <Icon name="fanhui"></Icon>
                            返回
                        </h4>
                        <h1>分析结果</h1>
                    </div>
                    <ul class="patient-message">
                        <li>
                            <Icon name="huanzhexingming" class="icon"></Icon>
                            患者姓名
                            <span class="info">{{ patient_name }}</span>
                        </li>
                        <li>
                            <Icon name="huanzheID" class="icon"></Icon>
                            患者ID
                            <span class="info">{{ patient_id }}</span>
                        </li>
                    </ul>
                </div>
                <div class="result">
                    <div class="true-or-false">
                        <h1>手术预测</h1> 
                         <h2 :class="{success:isSuccess,fail:!isSuccess}">
                            <Icon name="yuce_chenggong" style="font-size: 40px;"></Icon>
                            {{ isSuccess ? '成功' : '失败' }}
                        </h2>
                        <!-- <h1>手术成功率：</h1>
                        <h2 class="success">
                            {{ 94.9}}%
                        </h2> -->
                    </div>
                    <div class="detail">
                        <div class="image-swiper">
                            <swiper :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }" :slides-per-view="1"
                                :space-between="10" @slideChange="handleSlideChange">
                                <swiper-slide v-for="(slide,index) in images" :key="index" class="main-image-container">
                                    <img :src="slide" style="width: 100%;">
                                </swiper-slide>
                            </swiper>
                            <swiper :modules="[Thumbs]" watch-slides-progress @swiper="setThumbsSwiper"
                                :slides-per-view="4" :space-between="10" class="all-thumbs-image-container">
                                <swiper-slide v-for="(slide,index) in images" :key="index"
                                    class="thumbs-image-item-container" :class="{selected:activeIndex === index}">
                                    <div class="fix">
                                        <img :src="slide" style="width: 100%;" />
                                    </div>
                                </swiper-slide>
                            </swiper>

                        </div>
                        <div class="chart">
                            <div class="export-button" @click="handlerExportData">
                                <Icon name="daochushuju"style="color:#8abe2d" />
                                导出数据
                            </div>
                            <div class="now-infer">
                                <span><b>颈干角：</b>{{ nowInferData["颈干角"]?.toFixed(2) }}</span>
                                <span><b>TAD：</b>{{ nowInferData["TAD"]?.toFixed(2) }}</span>
                                <span><b>假体髓腔占比面积：</b>{{ nowInferData["假体髓腔占比面积"]?.toFixed(2) }}</span>
                                <span><b>阴（阳）性支撑：</b>{{ nowInferData["阴（阳）性支撑"]?.toFixed(2) }}</span>
                            </div>
                            <div class="now-infer">
                                <span><b>股骨颈：</b>{{ nowInferData["股骨颈"]?.toFixed(2) }}</span>
                                <span><b>股骨粗隆：</b>{{ nowInferData["股骨粗隆"]?.toFixed(2) }}</span>
                                <span><b>股骨粗隆间：</b>{{ nowInferData["股骨粗隆间"]?.toFixed(2) }}</span>
                                <span><b>全髋：</b>{{ nowInferData["全髋"]?.toFixed(2) }}</span>
                            </div>
                        <NavChart :chartData="chartData"></NavChart>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref,onMounted ,reactive} from "vue";
import * as XLSX from 'xlsx';
import { Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ElMessage,dayjs} from "element-plus"
import NavChart from "./components/NavChart.vue";
import {getCalculateResult} from "@/api/patient"
import type {ChartDateType} from "@/api/patient/type"
import {useRoute,useRouter} from "vue-router"
import 'swiper/css';
const $route = useRoute();
const $router = useRouter();
const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper:any) => {
  thumbsSwiper.value = swiper;
};
const dataToExport:exportDataType[] = [];
let nowInferData = ref<exportDataType>({//当前选中图片这次推测的数据
            "患者姓名": "",
            "患者ID": "",
            "时间": "",
            "股骨颈": 0,
            "股骨粗隆": 0,
            "股骨粗隆间": 0,
            "全髋": 0,
            "颈干角": -1,
            "TAD": null,
            "假体髓腔占比面积": null,
            "阴（阳）性支撑": null,
        });

let activeIndex = ref(0);
const handleSlideChange = (swiper:any) => {
    activeIndex.value = swiper.activeIndex;
    nowInferData.value = dataToExport[swiper.activeIndex];
}
const images:string[] = [];
let patient_id = ref("");
let patient_name = ref("");
let chartData:ChartDateType = reactive({
    neckShaftAngleList:[],//颈干角
    TADList:[],//TAD
    medullaryCavityList:[],//假体髓腔占比面积
    negativeSupportList:[],//阳（阴）性支撑
    timeList:[],
    neckOfFemur:[]
});
let isSuccess = ref(true);//手术是否成功

const init = async () => {
    let id = $route.query.patient_id as string;
    let res = await getCalculateResult(id);
    if(res.code !== 201) return ElMessage({
        type:"error",
        message:"获取预测结果失败！"
    })
    let {data} = res;
    patient_id.value = data[0].patient_id;
    patient_name.value = data[0].patient_name;
    isSuccess.value = Boolean(data.at(-1).data);//这个是1或0
    data.forEach((item:any) => {
        if(item.image) images.push(`${import.meta.env.VITE_APP_SERVE}/${item.image}`);
        chartData.neckShaftAngleList.push(item.neckShaftAngle);
        chartData.TADList.push(item.TAD);
        chartData.medullaryCavityList.push(item.medullaryCavity);
        chartData.negativeSupportList.push(item.negativeSupport);
        chartData.neckOfFemur.push({
            neckOfFemur1:item.neckOfFemur1,
            neckOfFemur2:item.neckOfFemur2,
            neckOfFemur3:item.neckOfFemur3,
            neckOfFemur4:item.neckOfFemur4,
        });  
        chartData.timeList.push(item.created);
        dataToExport.push({
            "患者姓名": item.patient_name,
            "患者ID": item.patient_id,
            "时间": dayjs(item.created).format("YYYY-MM-DD"),
            "股骨颈": item.neckOfFemur1,
            "股骨粗隆": item.neckOfFemur2,
            "股骨粗隆间": item.neckOfFemur3,
            "全髋": item.neckOfFemur4,
            "颈干角": item.neckShaftAngle,
            "TAD": item.TAD,
            "假体髓腔占比面积": item.medullaryCavity,
            "阴（阳）性支撑": item.negativeSupport,
        })
    })
    nowInferData.value = dataToExport[0];
}
interface exportDataType {
    "患者姓名": string,
    "患者ID": string,
    "时间": string,
    "股骨颈": number,
    "股骨粗隆": number,
    "股骨粗隆间": number,
    "全髋": number,
    "颈干角": number | null,
    "TAD": number | null,
    "假体髓腔占比面积": number | null,
    "阴（阳）性支撑": number | null, 
}
const handlerExportData =  () =>{
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 创建 Blob 对象
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // 创建临时链接元素
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exportedData.xlsx';
    link.click();
    // 清除临时链接
    URL.revokeObjectURL(link.href);
}
onMounted(() => {
    init();
})

</script>

<style lang="scss" scoped>
.root-container {
    height: 100vh;

    .content {
        padding: 15px;
        // height: calc(100vh - $header-height);
        background-color: #f4f8fb;

        .card {
            height: 100%;
            box-shadow: 0px 0px 10px 0px rgba(16, 56, 135, 0.19);
            border-radius: 10px;

            .header {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-bottom: 1px solid #D8DCE6;

                div:first-child {
                    display: flex;

                    h4 {
                        margin-right: 8px;
                        line-height: 22px;
                        color: var(--el-color-primary);
                        cursor: pointer;
                    }

                    h1 {
                        font-weight: 800;
                        font-size: 22px;
                    }

                }

                .patient-message {
                    display: flex;

                    li {
                        color: #909399;

                        .icon {
                            color: var(--el-color-primary);
                        }

                        .info {
                            color: black;
                            font-weight: 500;
                        }

                        &:first-child {
                            margin-right: 10px;
                        }
                    }
                }

            }

            .result {
                margin-top: 20px;

                .true-or-false {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 120px;
                    margin-bottom: 10px;
                    background: rgba(40, 90, 171, 0.05);
                    border-radius: 6px;

                    h1 {
                        margin-right: 10px;
                        font-size: 32px;

                    }

                    h2 {
                        font-size: 48px;

                        &.success {
                            color: #1f873a;
                        }

                        &.fail {
                            color: #db2f2f
                        }
                    }

                }

                .detail {
                    display: flex;

                    .image-swiper {
                        width: 520px;
                        .main-image-container{
                            height: 300px;
                            border-radius: 6px;
                            overflow: hidden; 
                        }
                        .all-thumbs-image-container {
                            margin-top: 10px;
                            padding:4px;

                            .thumbs-image-item-container {
                                position: relative;
                                width: 25%;
                                height: 80px;
                                border-radius: 6px;

                                .fix {
                                    height: 100%;
                                    overflow: hidden; 
                                }
                            &.selected::after {
                                content: "";
                                position: absolute;
                                top: -4px;
                                left: -4px;
                                right: -4px;
                                bottom: -4px;
                                border: 2px solid var(--el-color-primary);
                                border-radius: 6px;
                            }

                        }
                        }

                    }
                    .chart {
                        position: relative;
                        margin-left: 24px;
                        padding-left: 24px;
                        width: 920px;
                        height: 400px;
                        border-left: 1px solid #D8DCE6 ;
                        .export-button {
                            position: absolute;
                            z-index: 1;
                            top:54px;
                            right:20px;
                            font-size: 14px;
                            cursor: pointer;
                        }
                        .now-infer {
                            &:nth-child(2) {
                               margin-bottom: 10px;
                            }
                            span {
                                margin-right: 8px;
                                b {
                                    font-weight: 700;
                                }
                            }
                        }
                    }
                }
            }

        }
    }
}
</style>