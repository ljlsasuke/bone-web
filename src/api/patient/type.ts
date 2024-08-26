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

export interface caseType {
    patient_id: string;
    doctor: string;
    image_origin: string;
    image_binary: string;
}

export interface patientType {
    patient_id: string;
    patient_name: string;
    age: number;
    height: number;
    medical_history: string;
}

export type CaseListResDataType = {
    results: CaseTableItem[],
    // total: number;
    count: number;
}

export interface CaseListResType extends baseResponse {
    data?: CaseListResDataType
}

export interface ChartDateType {
    neckShaftAngleList: (number | null)[],//颈干角
    TADList: (number | null)[],//TAD
    medullaryCavityList: (number | null)[],//假体髓腔占比面积
    negativeSupportList: (number | null)[],//阳（阴）性支撑
    timeList: string[],
    neckOfFemur: {
        neckOfFemur1: number | null,
        neckOfFemur2: number | null,
        neckOfFemur3: number | null,
        neckOfFemur4: number | null,
    }[]//骨密度
}