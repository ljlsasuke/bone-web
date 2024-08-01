<template>
        <header>
            <div class="logo-container">
                <img src="../assets/images/logo-title.png" alt="">
            </div>
            <div class="user">
                <div class="avatar">
                    <img src="./images/avatar.png" alt="">
                </div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        {{ userStore.user || 'sasuke' }}
                        <Icon name="xiala"></Icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item  @click="isDrawerShow = true;">
                                <!-- 这个加class加不上去，我推测是因为一开始菜单隐藏 -->
                                <Icon name="xiugaimima" style="margin-right: 8px;"></Icon>
                                修改密码
                            </el-dropdown-item>
                            <el-dropdown-item  @click="onLogout">
                                <Icon name="tuichudenglu" style="margin-right: 8px;"></Icon>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>
        <el-drawer v-model="isDrawerShow" size="50%" style="border-radius: 6px 0 0 6px;"
        @close="resetForm(formRef)"
        >
            <template #header>
                <h1 style="color: black;font-weight: 800;">修改密码</h1>
            </template>
            <template #default>
                <el-form label-position="left" label-width="auto" :model="input" :rules="rules" ref="formRef">
                    <el-form-item label="旧密码" prop="oldPwd">
                        <el-input placeholder="请输入旧密码" v-model="input.oldPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input placeholder="请输入新密码" v-model="input.newPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPwd">
                        <el-input placeholder="请再次输入新密码" v-model="input.confirmPwd" type="password" show-password></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click="isDrawerShow=false;">取消</el-button>
                <el-button type="primary">提交</el-button>
            </template>
        </el-drawer>
</template>

<script lang="ts" setup >
import { ref,reactive } from "vue";
import type { Ref } from "vue";
import useUserStore from "@/stores/modules/user";
import { useRouter } from "vue-router";
import type {  FormRules,FormInstance } from 'element-plus'
const userStore = useUserStore();
const $router = useRouter();

let isDrawerShow = ref(false);

type RuleForm = {
    oldPwd:string;
    newPwd:string;
    confirmPwd:string
}

let input = reactive({
    oldPwd:"",
    newPwd:"",
    confirmPwd:""
})
const formRef: Ref<FormInstance | undefined> = ref<FormInstance>();
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return alert("没有form示例的情况下进入了resetForm");//我感觉这个情况不可能发生
    formEl.resetFields(); //表单的值和校验结果都会清除掉
}

const validatorConfirmPwd = (rule: any, value: string, callback: any) =>{
    if(value && value === input.newPwd)
        callback();
    else
        callback("两次密码输入不一致")
}

const rules:FormRules<RuleForm> = {
    oldPwd:[
        {required:true,message:"必须输入旧密码！",trigger:"blur"}
    ],
    newPwd:[
         {required:true,message:"必须输入新密码！",trigger:"blur"}
    ],
    confirmPwd:[
    {required:true,trigger:"blur", validator: validatorConfirmPwd},
    ]
};

const onLogout = async () => {
    userStore.userLogout().then(() => {
        $router.push("/login");
    })
}
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: $header-height;
        padding: 0 30px;
        border-bottom: 1px solid #D8DCE6;
        .user {
            display: flex;
            .avatar {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                border-radius: 50%;
                img {
                    width: 100%;
                }
            }
        }
    }
</style>