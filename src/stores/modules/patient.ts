import { defineStore } from "pinia"

const usePatientStore = defineStore("patient", {
    state: (): { imgSrc: any, isFeaturePointsDrawerShow: boolean, imageData: any } => ({
        isFeaturePointsDrawerShow: false,
        imageData: null,
        imgSrc: null
    })
})

export default usePatientStore;