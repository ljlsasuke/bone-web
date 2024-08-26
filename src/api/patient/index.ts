import request from "@/utils/request";
import type { CaseListResType, caseType, patientType } from "./type"
export function getPatientCaseList(pageNo: number, pageSize: number, searchKeyWord: string) {
    return request<any, CaseListResType>({
        url: "/case/list",
        method: "get",
        // params: { page:pageNo, pageSize, search: searchKeyWord }
        params: { page: pageNo, search: searchKeyWord }
    })
}

//更新病例的时候先根据id获取到旧的病例数据
export function getPatientCaseById(id: string) {
    return request<any, any>({
        url: "/patient",
        method: "get",
        params: { patient_id: id }
    })
}


export function addPatient(data: patientType) {
    return request({
        url: "/patients/",
        method: "post",
        data: data
    })
}

//传入两张图片（原图和mask图），病人ID，医生姓名，最后得到计算结果
export function calculate(caseData: caseType) {
    return request<any, any>({
        url: "/records/create/",
        method: "post",
        data: caseData
    })
}

export function getMask(formData: any) {//把那个原先的fetch请求移植到这里
    return request({
        url: "/cv/get-mask/",
        method: "post",
        data: formData
    })
}

//点击查看预测的时候根据ID获得到一个病例信息
export function getCalculateResult(patient_id: string) {
    return request<any, any>({
        url: "/records/predict",
        method: "get",
        params: { patient_id }
    })
}