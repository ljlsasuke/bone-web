import type { baseResponse } from "../typeIndex"
export type loginReqDataType = {
    username: string;
    password: string;
}

export type loginResDataType = {
    refresh: string;
    access: string;
    user: string;
    is_superuser: boolean;
}

export interface loginResType extends baseResponse {
    data?: loginResDataType
}