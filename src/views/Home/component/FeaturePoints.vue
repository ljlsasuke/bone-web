<template>
  <el-drawer
    v-model="patientStore.isFeaturePointsDrawerShow"
    size="95%"
    direction="btt"
    style="border-radius: 10px 10px 0px 0px"
    @opened="onOpen"
  >
    <template #header>
      <h1 style="color: black; font-weight: 800">特征点选择</h1>
    </template>
    <template #default>
      <div class="content">
        <canvas
          :ref="(el:any) => { imageCanvas = el }"
          id="canvas"
          @click="addArea"
          @contextmenu="removeArea"
        ></canvas>
        <div class="operation">
          <h1 style="color: black; font-weight: 800">点击选择特征的区域</h1>
          <ul class="group">
            <li
              :class="{ item: true, isState: index === selectState }"
              v-for="({ iconName, operation }, index) in operationGroup"
              :key="index"
              @click="onTest(index)"
            >
              <Icon :name="iconName" class="icon"></Icon>
              {{ operation }}
            </li>
          </ul>
          <el-button
            type="primary"
            class="submit-button"
            @click="onSuerTest"
            :loading="isLoading"
          >
            <template #loading>
              <div class="custom-loading">
                <svg class="circular" viewBox="-10, -10, 50, 50">
                  <path
                    class="path"
                    d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
                    style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
                  />
                </svg>
              </div>
            </template>
            确定
          </el-button>
          <el-button type="primary" class="submit-button" @click="onSubmit"
            >提交</el-button
          >
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import usePatientStore from "@/stores/modules/patient";
import { dot } from "node:test/reporters";
const patientStore = usePatientStore();
const operationGroup = [
  // {
  //     iconName:"tianjiatezhengdian",
  //     operation:"添加特征点"
  // },
  // {
  //     iconName:"yichuxuanzequyu",
  //     operation:"移除选择区域"
  // },
  {
    iconName: "zhongzhi",
    operation: "重置",
  },
  {
    iconName: "chexiao",
    operation: "撤销",
  },
];
let isLoading = ref(false);
let imageCanvas = ref();
let ctx: CanvasRenderingContext2D;
// 现在的逻辑是 1是确定,0是取消，然后去掉前两个按钮
let selectState = ref<0 | 1>(0);
type dot = {
  x: number;
  y: number;
  label: 0 | 1;
};
const colors = {
  "1": "#40e0d0",
  "0": "#ffc0cb",
};

let dots: dot[] = [];
let ctxStates: ImageData[] = [];
const onTest = (index: number) => {
  // if(index === 0){
  //     selectState.value = 0;
  // }
  // else if(index === 1){
  //     selectState.value = 1;
  // } else if(index ===2) {
  //     //clearAllSelected
  //     clearAllArea();

  // } else {
  //     // clearLastDot
  //     undoLastArea();
  // }
  if (index === 0) clearAllArea();
  else undoLastArea();
};
const onOpen = () => {
  ctx = imageCanvas.value.getContext("2d");
  loadImage();
};

function loadImage() {
  //把图片加载到canvas里面
  const img = new Image();
  img.src = patientStore.imgSrc;
  img.onload = () => {
    //图片加载是一个异步事件
    imageCanvas.value.width = img.width;
    imageCanvas.value.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
}

function drawPoint(point: dot) {
  const { x, y, label } = point;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = colors[label];
  ctx.fill();
  ctx.closePath();
}

function addArea(event: MouseEvent) {
  event.preventDefault();
  const rect = imageCanvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  saveCtxState();
  drawPoint({ x, y, label: 1 });
  dots.push({ x, y, label: 1 });
  console.log(dots);
}

function removeArea(event: MouseEvent) {
  event.preventDefault();
  const rect = imageCanvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  saveCtxState();
  drawPoint({ x, y, label: 0 });
  dots.push({ x, y, label: 0 });
  console.log(dots);
}

function undoLastArea() {
  if (ctxStates.length === 0) return alert("没有选择的特征点");
  dots.pop();
  ctx.putImageData(ctxStates.pop() as ImageData, 0, 0);
}

function saveCtxState() {
  ctxStates.push(
    ctx.getImageData(0, 0, imageCanvas.value.width, imageCanvas.value.height)
  );
}

function clearAllArea() {
  if (dots.length === 0) return alert("没有选择的特征点"); //这里用dots或ctxStates的length都可以
  dots = [];
  ctx.putImageData(ctxStates[0] as ImageData, 0, 0);
  ctxStates = []; //如果重置可以撤销的话可以不写这个并且在改一点逻辑
  // ctx.clearRect(0, 0, imageCanvas.value.width, imageCanvas.value.height);
  // loadImage();
}

const onSuerTest = () => {
  const formData = new FormData();
  const inputPoints = dots.map((dot) => [dot.x, dot.y]);
  const inputLabels = dots.map((dot) => dot.label);
  formData.append("input_point", JSON.stringify(inputPoints));
  formData.append("input_label", JSON.stringify(inputLabels));
  if (patientStore.imageData) {
    formData.append("image", patientStore.imageData);
  }
  isLoading.value = true;
  fetch("http://192.168.200.13:8000/api/cv/get-mask/", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.code !== 200) return alert("图片分割失败");
      const mask = new Image();
      mask.src = `data:image/jpeg;base64,${res.data}`;
      mask.onload = () => {
        //图片加载是一个异步事件
        saveCtxState();
        ctx.drawImage(mask, 0, 0);
        dots.forEach((dot) => {
          drawPoint(dot);
        });
      };
    }).finally(() => isLoading.value = false)
};

const onSubmit = () => {};

onMounted(() => {
  // console.log(imageCanvas,"示例")
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  .operation {
    display: flex;
    flex-direction: column;
    width: 254px;
    height: 330px;
    padding: 20px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(16, 56, 135, 0.19);
    border-radius: 10px;
    .group {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      padding: 10px;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        padding: 10px;
        font-size: 12px;
        color: #606266;
        cursor: pointer;
        &.isState {
          // color: var(--el-color-primary);
          color: #606266;
        }
        &:nth-child(-n + 2) {
          border-bottom: 1px solid #d8dce6;
        }
        .icon {
          font-size: 28px;
          margin-bottom: 20px;
        }
      }
    }
    .submit-button {
      &:last-child {
        margin-left: 0;
        margin-top: 20px;
      }
    }
  }
}

#canvas {
  width: auto;
  height: auto;
  border: 1px solid black;
}
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}
.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
</style>
