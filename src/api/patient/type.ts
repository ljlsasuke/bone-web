import type { baseResponse } from "../typeIndex"
export interface CaseTableItem {//并不是完整的病例，只是那个表格的一行
    // id: string;//病人id
    // patientName: string;//病人名字
    // uploader: string;//上传者的姓名（医生姓名）
    // uploadTime: string;//上传日期（时间戳）
    patient_id: string;
    created: string;//上传日期
    doctor: string;//医生姓名
    patient_name: string;//病人姓名
}

export type CaseListResDataType = {
    results: CaseTableItem[],
    // total: number;
    count: number;
}

export interface CaseListResType extends baseResponse {
    data?: CaseListResDataType
}