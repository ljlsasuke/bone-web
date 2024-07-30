<template>
    <span :class="`iconfont icon-${name}`"></span>
</template>

<script lang="ts" setup>
defineProps({
    name: String
})
</script>

<style lang="scss" scoped></style>