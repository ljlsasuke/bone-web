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
                        <el-button type="primary" @click="()=>{isDrawerShow = true;drawerTitle='上传新病例'}">
                            <Icon name="shangchuanxinbingli" style="margin-right: 8px;" />
                            上传新病例
                        </el-button>
                    </div>
                </div>
                <el-table class="table" :data="CaseList"
                    :header-cell-style="{  fontSize: '14px',color:'black',backgroundColor:'#f5f7fa' }">
                    <el-table-column label="序号" type="index" width="80" align="center" />
                    <el-table-column prop="patient_name" label="病人姓名" />
                    <el-table-column prop="doctor" label="上传人" />
                    <el-table-column prop="created" label="上传日期" />
                    <el-table-column label="操作" align="center">
                        <template #default="{row}:{row:CaseTableItem}">
                            <span class="bt" @click="toCaseCalculateResult(row.patient_id)">查看预测</span>
                            <span class="bt" @click="handleUpdateCase(row.patient_id)">更新病例信息</span>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination class="pagination" background layout="prev, pager, next" :page-size="pageSize"
                    :total="total" v-model:current-page="pageNo" />

            </el-card>
        </div>
        <el-drawer v-model="isDrawerShow" size="50%" style="border-radius: 6px 0 0 6px;"
            @close="resetForm(formRefP,formRefD)">
            <template #header>
                <h1 style="color: black;font-weight: 800;">{{drawerTitle}}</h1>
            </template>
            <template #default>
                <div class="form-card">
                    <h1 class="form-card-title">病人基本信息</h1>
                    <el-form label-position="left" label-width="80" ref="formRefP" class="form" :model="patientData">
                        <el-form-item label="病人姓名" prop="patient_name">
                            <el-input placeholder="请输入病人姓名" v-model="patientData.patient_name"></el-input>
                        </el-form-item>
                        <el-form-item label="患者ID" prop="patient_id">
                            <el-input placeholder="请输入患者ID" v-model="patientData.patient_id"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <!-- <el-input-number v-model="patientData.age" /> -->
                            <el-input placeholder="请输入患者年龄" v-model.number="patientData.age" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="身高(cm)" prop="height">
                            <!-- <el-input-number v-model="patientData.height" /> -->
                            <el-input placeholder="请输入患者身高" v-model.number="patientData.height" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="既往病史" prop="medical_history">
                            <el-input placeholder="请输入患者既往病史" v-model="patientData.medical_history"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="form-card">
                    <h1 class="form-card-title">医生基本信息</h1>
                    <el-form label-position="left" label-width="80" ref="formRefD" class="form" :model="doctorData">
                        <el-form-item label="医生姓名" prop="doctor">
                            <!-- <el-input placeholder="请输入医生姓名" v-model="doctorData.doctor"></el-input> -->
                            <el-input placeholder="请输入医生姓名" :value="'admin'"></el-input>
                        </el-form-item>
                        <el-form-item label="医生ID" prop="newPwd">
                            <!-- 现在数据库中还没有医生ID，所以先把他固定为1 -->
                            <el-input placeholder="请输入医生ID" :value="1"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="form-card">
                    <h1 class="form-card-title">病例辅助材料</h1>
                    <div class="form">
                        <el-upload class="upload-demo"
                            @change="onFileSelected"
                            accept="image/*"
                            :before-upload="() => false"
                            >
                            <el-button type="primary">
                                <template #icon>
                                    <Icon name="shangchuan"></Icon>
                                </template>
                                上传
                            </el-button>
                            <template #tip>
                                <!-- <div class="el-upload__tip">
                                    jpg/png files with a size less than 500kb
                                </div> -->
                            </template>
                        </el-upload>
                        <!-- <input type="file" id="imageInput" accept="image/*"  @change="onFileSelected"><br><br> -->
                        <FeaturePoints></FeaturePoints>
                    </div>
                </div>
            </template>
            <template #footer>
                <el-button @click="isDrawerShow=false;">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref,watch,onMounted, reactive } from "vue";
import type { Ref } from "vue";
import {dayjs, ElMessage} from "element-plus"
import { useRouter } from "vue-router";
import FeaturePoints from "./component/FeaturePoints.vue";
import useUserStore from "@/stores/modules/user";
import {getPatientCaseList,calculate,addPatient,getPatientCaseById} from "@/api/patient/index"
import type {CaseTableItem,CaseListResDataType,patientType,caseType} from "@/api/patient/type"
import type {  FormRules,FormInstance,UploadProps, UploadUserFile  } from 'element-plus'
import usePatientStore from "@/stores/modules/patient";
const patientStore = usePatientStore();
const userStore = useUserStore();
const $router = useRouter();
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
let searchKeyWord = ref<string>("");
let CaseList = ref<CaseTableItem[]>([]);

function translateTime(time:string) {
    return dayjs(time).format("YYYY-MM-DD");
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
    updatePatientCaseList();
}

const toCaseCalculateResult = (patient_id:string) =>{
    $router.push({name:"result",query:{patient_id}});
}

let drawerTitle = ref<"上传新病例" | "更新病例信息">("上传新病例");
let isDrawerShow = ref(false);
const [formRefP,formRefD]: Ref<FormInstance | undefined>[] = [ref<FormInstance>(),ref<FormInstance>()];
const resetForm = (formElP: FormInstance | undefined,formElD:FormInstance | undefined) => {
    // if (!formEl) return alert("没有form示例的情况下进入了resetFormHome");//我感觉这个情况不可能发生
    // formEl.resetFields(); //表单的值和校验结果都会清除掉
    formElP?.resetFields();
    formElD?.resetFields();//这个formElD后续可能被移除
}

function onFileSelected(event:any){
    const file = event.raw || (event.target.files as FileList) [0];
    if(file){
        const reader = new FileReader();
        reader.onload = (e) => {
            patientStore.imageData = file;
            patientStore.imgSrc = (e.target as FileReader).result;
            patientStore.isFeaturePointsDrawerShow = true;
        }
        reader.readAsDataURL(file);
    }
    
}



let patientData = reactive<patientType>({
    patient_id: "",
    patient_name: "",
    age: 0,
    height: 0,
    medical_history: ""
});
let doctorData = reactive<{
    doctor:string,
}>({
    doctor:''
});
const handleUpdateCase = async (patient_id:string) =>{
    drawerTitle.value = "更新病例信息";
    isDrawerShow.value = true;
    let res = await getPatientCaseById(patient_id);
    if(res.code !== 201) return ElMessage({
        type:"error",
        message:"获取病例信息错误！"
    })
    Object.assign(patientData,res.data[0])
}

const onSubmit = async () => {
    let res1 = await addPatient(patientData);
    let res2 = await calculate({
        patient_id: patientData.patient_id,
        doctor: "admin",
        image_origin: patientStore.imgSrc.slice(patientStore.imgSrc.indexOf(",") + 1),
        image_binary: patientStore.mask
    });
    $router.push({name:"result",query:{patient_id:res2.data.patient_id}});
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
        background-color: #f4f8fb;
        .card {
            height: 100%;
            // padding: 20px;
            box-shadow: 0px 0px 10px 0px rgba(16,56,135,0.19);
            border-radius: 10px;
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
        &:nth-child(-n + 2) {
            margin-bottom: 10px;
        }
        &-title {
            padding-left: 16px;
            padding-top: 8px;
            padding-bottom: 12px;
            font-weight: bold;
            font-size: 14px;
            color: #303133;
            background-color: #f5f7fa;
            border-radius: 3px 3px 0px 0px;
        }
        .form {
            padding-left: 16px;
            padding-top: 20px;
            padding-right: 20px;
        }
    }
}
</style>