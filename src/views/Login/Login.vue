<template>
    <div class="root-container">
        <div class="left">
            <header>
                <img src="../../assets/images/logo-title.png" alt="">
            </header>
            <div class="image">
                <img src="./images/login-left-image.png" alt="">
            </div>
        </div>
        <div class="right">
            <el-form class="form" :model="formData">
                <h1>欢迎登录</h1>
                <h2>请输入账号及密码登录</h2>
                <el-form-item class="form-item" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item class="form-item" prop="password">
                    <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password
                        @keyup.enter="login" />
                </el-form-item>
                <div v-show="isLoginRejected" class="error-message">
                    <Icon name="cuowu"></Icon>
                    用户名或密码错误
                </div>
                <el-form-item class="form-item">
                    <el-button type="primary" class="button" @click="login">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import useUserStore from "@/stores/modules/user";
const userStore = useUserStore();
const $router = useRouter();
const formData = reactive({
    username: "",
    password: "",
});
let isLoginRejected = ref(false);
const login = () => {
    userStore.userLogin(formData).then(res => {
        console.log("登录成功啦");

        $router.push("/home");
    }).catch(err => {
        if(err.response.status === 401) isLoginRejected.value = true
        console.log("登录失败");
    });


}
</script>

<style lang="scss" scoped>
$header-height: 30px;
$left-width: 900;
$right-width: 540;
$all-width:$left-width + $right-width;
$form-width: 320;

.root-container {
    display: flex;
    flex-direction: row;
    height: 100vh;

    .left {
        display: flex;
        flex-direction: column;
        width: #{$left-width}px;
        flex:1;
        // width:calc(100% * ($left-width / $all-width));
        height: 100%;
        background: #fff;
        $header-margin-top: 20px;

        header {
            margin-top: $header-margin-top;
            height: $header-height;


            img {
                height: 100%;
            }
        }

        .image {
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100% - $header-height - $header-margin-top);
            background: url(./images/login-left-background.png);
            // overflow: hidden;

            img {
                width: 80%;
                // height: 100%;
            }
        }
    }

    .right {
        display: flex;
        justify-content: center;
        align-items: center;
        width: #{$right-width}px;
        flex:1;
        // width:calc(100% * ($right-width / $all-width));
        height: 100%;

        .form {
            position: relative;
            width: ($form-width / $right-width) * 100%; //未来的scss废弃直接 / 

            h1 {
                margin-bottom: 14px;
                color: #303133;
                font-size: 32px;
                font-weight: bold;
            }

            h2 {
                margin-bottom: 20px;
                color: #909399;
            }

            .form-item {
                margin: 25px 3px;
                margin-bottom: 0;

                &:last-child {
                    margin-top: 40px;
                }

                .button {
                    width: 100%;
                    font-size: 16px;
                }
            }

            .error-message {
                position: absolute; //设置绝对定位是为了防止让他出现的时候影响form-item的margin（浮动也能实现但没这个方便）
                left: 2px;
                bottom: 45px;
                font-size: 14px;
                color: #E40000;
            }
        }
    }
}
</style>