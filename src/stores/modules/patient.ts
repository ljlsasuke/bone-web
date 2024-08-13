import { defineStore } from "pinia"

interface StateType {
    imgSrc: any,
    isFeaturePointsDrawerShow: boolean,
    imageData: any,
    mask: any
}

const usePatientStore = defineStore("patient", {
    state: (): StateType => ({
        isFeaturePointsDrawerShow: false,
        imageData: null,//这个是原图的File
        imgSrc: null,//这个是原图通过FileReader转成DataUrl(base64)
        mask: null,//这个后端返回给我的是一个base64，还不知道是否需要变成文件
    })
})

export default usePatientStore;