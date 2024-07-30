import type { MockMethod } from "vite-plugin-mock";
import type { CaseTableItem } from "@/api/patient/type"
//@ts-ignore
import mock from "mockjs"

function mockCaseTable(size: number): CaseTableItem[] {
    const items: CaseTableItem[] = [];
    const { Random } = mock;
    for (let i = 0; i < size; i++) {
        const item: CaseTableItem = {
            id: Random.guid(), // 生成一个 GUID 作为病人 ID
            patientName: Random.cname(), // 生成一个随机的中文姓名
            uploader: Random.cname(), // 生成一个随机的中文姓名作为医生姓名
            // uploadTime: new Date(Random.date()), // 生成一个随机日期，并转换为 Date 对象
            uploadTime: Random.date()
        };
        items.push(item);
    }
    return items;
}

export default [
    {
        url: "/api/patient/case/list",
        method: "get",
        response: (config: any) => {
            //有pageSize和pageNo
            const { pageSize, pageNo } = config.query;
            const result: CaseTableItem[] = mockCaseTable(pageSize);
            return {
                code: 200,
                message: "成功",
                data: {
                    total: 20 * 10,//这个我就随便给一个数字把
                    CaseList: result
                }
            }
        }
    }
] as MockMethod[]; // MockMethod[]