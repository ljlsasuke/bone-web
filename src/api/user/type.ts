import type { baseResponse } from "../typeIndex"
export type loginReqDataType = {
    username: string;
    password: string;
}

export type loginResDataType = {
    token: string;
    userInfo: {
        username: string;
        [key: string]: string;//考虑到userInfo以后可能扩展
    }
}

export interface loginResType extends baseResponse {
    data?: loginResDataType
}