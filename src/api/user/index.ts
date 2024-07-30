import request from '@/utils/request'

import type { loginReqDataType, loginResType } from './type'
export function login(data: loginReqDataType) {
    return request<any, loginResType>({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

export function logout() {

}

export function changePassword(newPwd: string) {

}