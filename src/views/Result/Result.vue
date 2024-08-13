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
                    </div>
                    <div class="detail">
                        <div class="image-swiper">
                            <swiper :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }" :slides-per-view="1"
                                :space-between="10">
                                <swiper-slide v-for="(slide,index) in images" :key="index" class="main-image-container">
                                    <img :src="slide" style="width: 100%;">
                                </swiper-slide>
                            </swiper>
                            <swiper :modules="[Thumbs]" watch-slides-progress @swiper="setThumbsSwiper"
                                :slides-per-view="4" :space-between="10">
                                <swiper-slide v-for="(slide,index) in images" :key="index"
                                    class="thumbs-image-container" :class="{selected:true}">
                                    <img :src="slide" style="width: 100%;" />
                                </swiper-slide>
                            </swiper>

                        </div>
                        <div class="chart">
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
import { Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import NavChart from "./components/NavChart.vue";
import {getCalculateResult} from "@/api/patient"
import {useRoute,useRouter} from "vue-router"
import 'swiper/css';
const $route = useRoute();
const $router = useRouter();
const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper:any) => {
  thumbsSwiper.value = swiper;
};
const images:string[] = [];
let patient_id = ref("");
let patient_name = ref("");
type ChartDateType = {
    neckShaftAngleList:(number | null)[],//颈干角
    TADList:(number | null)[],//TAD
    medullaryCavityList:(number | null)[],//假体髓腔占比面积
    negativeSupportList:(number | null)[],//阳（阴）性支撑
    timeList:string[],
    neckOfFemur:{
        neckOfFemur1:number | null,
        neckOfFemur2:number | null,
        neckOfFemur3:number | null,
        neckOfFemur4:number | null,
    }[]//骨密度
}
let chartData:ChartDateType = reactive({
    neckShaftAngleList:[],//颈干角
    TADList:[],//TAD
    medullaryCavityList:[],//假体髓腔占比面积
    negativeSupportList:[],//阳（阴）性支撑
    timeList:[],
    neckOfFemur:[]
});
let isSuccess = ref(false);//手术是否成功
const init = async () => {
    let id = $route.query.patient_id as string;
    let res = await getCalculateResult(id);
    if(res.code !== 201) return alert("获取预测结果失败！");
    let {data} = res;
    console.log(data,"返回数据样子");
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
    })
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
                        .thumbs-image-container {
                            position: relative;
                            margin-top: 10px;
                            width: 25%;
                            height: 80px;
                            overflow: hidden; 
                            border-radius: 6px;

                            &.selected::after {
                                //目前由于overflow:hidden的原因,边框显示不出来
                                content: "";
                                position: absolute;
                                top: -2px;
                                left: -2px;
                                right: -2px;
                                bottom: -2px;
                                border: 1px solid var(--el-color-primary);
                            }

                        }
                    }
                    .chart {
                        margin-left: 24px;
                        padding-left: 24px;
                        width: 920px;
                        height: 400px;

                        border-left: 1px solid #D8DCE6 ;
                    }
                }
            }

        }
    }
}
</style>