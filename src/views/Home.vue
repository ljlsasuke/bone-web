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
                        <el-button type="primary" @click="isDrawerShow = true">
                            <Icon name="shangchuanxinbingli" style="margin-right: 8px;" />
                             上传新病例
                            </el-button>
                    </div>
                </div>
                <el-table class="table" :data="CaseList"  
               :header-cell-style="{  fontSize: '14px',color:'black',backgroundColor:'#f5f7fa' }"
                >
                    <el-table-column label="序号" type="index" width="80" align="center" />
                    <el-table-column prop="patient" label="病人姓名" />
                    <el-table-column prop="doctor" label="上传人" />
                    <el-table-column prop="created" label="上传日期" />
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
                :page-size="pageSize"
                :total="total"
                v-model:current-page="pageNo"
                />
               
            </el-card>
        </div>
        <el-drawer v-model="isDrawerShow" size="50%" style="border-radius: 6px 0 0 6px;"
        @close="resetForm(formRef)"
        >
            <template #header>
                <h1 style="color: black;font-weight: 800;">上传新病例</h1>
            </template>
            <template #default>
                <div class="form-card">
                    <h1 class="form-card-title">病人基本信息</h1>
                    <el-form label-position="left" label-width="auto" ref="formRef">
                    <el-form-item label="旧密码" prop="oldPwd">
                        <el-input placeholder="请输入旧密码" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input placeholder="请输入新密码"  type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPwd">
                        <el-input placeholder="请再次输入新密码"  type="password" show-password></el-input>
                    </el-form-item>
                </el-form>
                </div>
            </template>
            <template #footer>
                <el-button @click="isDrawerShow=false;">取消</el-button>
                <el-button type="primary">提交</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref,watch,onMounted } from "vue";
import type { Ref } from "vue";
import useUserStore from "@/stores/modules/user";
import {getPatientCaseList} from "@/api/patient/index"
import type {CaseTableItem,CaseListResDataType} from "@/api/patient/type"
import type {  FormRules,FormInstance } from 'element-plus'
const userStore = useUserStore();
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
let searchKeyWord = ref<string>("");
let CaseList = ref<CaseTableItem[]>([]);

function translateTime(time:string) {
    const date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
}

let updatePatientCaseList = async () => {
    let res = await   getPatientCaseList(pageNo.value,pageSize.value,searchKeyWord.value);
    if(res.code === 201){
        let data = res.data as CaseListResDataType;
        total.value = data.count;
        CaseList.value = data.results
        .map(item => {
            return {
                ...item,
                created:translateTime(item.created)
            }
        })
    }
}

const toSearch = async () => {
    alert(`搜索：${searchKeyWord.value}`)
    // searchKeyWord.value = "";
}

let isDrawerShow = ref(false);
const formRef: Ref<FormInstance | undefined> = ref<FormInstance>();
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return alert("没有form示例的情况下进入了resetForm");//我感觉这个情况不可能发生
    formEl.resetFields(); //表单的值和校验结果都会清除掉
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
    .form-card {
        border-radius: 4px;
        border: 1px solid #D8DCE6;
        &-title {
            font-weight: bold;
            font-size: 14px;
            color: #303133;
        }
    }
}
</style>