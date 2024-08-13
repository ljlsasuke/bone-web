import request from "@/utils/request";
import type { CaseListResType } from "./type"
export function getPatientCaseList(pageNo: number, pageSize: number, searchKeyWord: string) {
    return request<any, CaseListResType>({
        url: "/case/list",
        method: "get",
        // params: { page:pageNo, pageSize, search: searchKeyWord }
        params: { page: pageNo, search: searchKeyWord }
    })
}

//更新病例的时候先根据id获取到旧的病例数据
export function getPatientCaseById() {

}

//新增或者是更新一条病例，区别应该就是更新的时候要先根据id得到旧的病例数据，在根据id给出新的病例数据
export function updatePatientCaseList() {
    return request({
        url: "",
        method: "post",
        data: {}
    })
}

export function getMask() {//把那个原先的fetch请求移植到这里

}

//点击查看预测的时候根据ID获得到一个病例信息
export function getCalculateResult(patient_id: string) {
    return request<any, any>({
        url: "/records/predict",
        method: "get",
        params: { patient_id }
    })
}