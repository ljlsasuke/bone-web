<template>
  <RouterView />
</template>
<script setup lang="ts">
import {onMounted,onBeforeUnmount} from "vue"
import useUserStore from "@/stores/modules/user";
const userStore = useUserStore();
onMounted(()=>{
  userStore.restoreRefreshTimer();//为了在每次页面刷新的时候都重启定时器
})
onBeforeUnmount(() => {
  userStore.userLogout();//为了在页面关闭的时候清空数据
})
</script>
<style  lang="scss">
:root {
    --el-color-primary: #285AAB;;
}
</style>
