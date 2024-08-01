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