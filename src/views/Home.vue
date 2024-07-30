<template>
    <div class="root-container">
        <TopNav></TopNav>
        <div class="content">
            <el-card class="card">
                <div class="header">
                    <h1>已上传病例</h1>
                    <div class="operation">
                        <el-input placeholder="输入关键字查询" style="margin-right: 20px;" v-model="searchKeyWord"
                        @keyup.enter="toSearch">
                            <template #suffix>
                                <Icon name="sousuoxiao" style="cursor:pointer" @click="toSearch"></Icon>
                            </template>
                        </el-input>
                        <el-button type="primary" >
                            <Icon name="shangchuanxinbingli" style="margin-right: 8px;" />
                             上传新病例
                            </el-button>
                    </div>
                </div>
                <el-table class="table" :data="CaseList"  
               :header-cell-style="{  fontSize: '14px',color:'black',backgroundColor:'#f5f7fa' }"
                >
                    <el-table-column label="序号" type="index" width="80" align="center" />
                    <el-table-column prop="patientName" label="病人姓名" />
                    <el-table-column prop="uploader" label="上传人" />
                    <el-table-column prop="uploadTime" label="上传日期" />
                    <el-table-column label="操作" align="center">
                        <template #default>
                            <span class="bt">查看预测</span>
                            <span class="bt">更新病例信息</span>
                        </template>
                    </ el-table-column>
                </el-table>
                
                    <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="total"
                :pager-count="6"
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                />
               
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref,watch,onMounted } from "vue";
import useUserStore from "@/stores/modules/user";
import {getPatientCaseList} from "@/api/patient/index"
import type {CaseTableItem,CaseListResDataType} from "@/api/patient/type"
const userStore = useUserStore();
let pageNo = ref<number>(1);
let pageSize = ref<number>(8);
let total = ref<number>(0);
let searchKeyWord = ref<string>("");
let CaseList = ref<CaseTableItem[]>([]);

// function translateTime(time:string) {
//     const date = new Date(time);
//     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
// }

let updatePatientCaseList = async () => {
    let res = await   getPatientCaseList(pageNo.value,pageSize.value);
    if(res.code === 200){
        let data = res.data as CaseListResDataType;
        total.value = data.total;
        CaseList.value = data.CaseList
        // .map(item => {
        //     return {
        //         ...item,
        //         uploadTime:translateTime(item.uploadTime)
        //     }
        // })
    }
}

const toSearch = async () => {
    alert(`搜索：${searchKeyWord.value}`)
    searchKeyWord.value = "";
}

watch([pageNo,pageSize],updatePatientCaseList);//还不确定要不要让pageSize变化
onMounted(updatePatientCaseList);
</script>

<style lang="scss" scoped>


.root-container {
    height: 100vh;

    .content {
        padding: 15px;
        // height: calc(100vh - $header-height);

        .card {
            height: 100%;
            // padding: 20px;
            .header {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-bottom: 1px solid #D8DCE6;
                h1 {
                    font-weight: 800;
                    font-size: 22px;
                }
                .operation {
                    display: flex;
                }
            }
            
            .table {
                margin-top: 20px;
                .bt {
                    color: var(--el-color-primary);
                    cursor:pointer;
                    &:first-child {
                        margin-right: 10px;
                    }
                }
            }
            .pagination {
                margin: 20px auto;
                max-width: 435px;
            }
            
        }
    }
}
</style>