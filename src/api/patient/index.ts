import request from "@/utils/request";
import type { CaseListResType } from "./type"
export function getPatientCaseList(pageNo: number, pageSize: number) {
    return request<any, CaseListResType>({
        url: "/patient/case/list",
        method: "get",
        params: { pageNo, pageSize }
    })
}