import type { MockMethod } from "vite-plugin-mock";
import type { CaseTableItem } from "@/api/patient/type"
//@ts-ignore
import mock from "mockjs"

function mockCaseTable(size: number = 10): CaseTableItem[] {
    const items: CaseTableItem[] = [];
    const { Random } = mock;
    for (let i = 0; i < size; i++) {
        const item: CaseTableItem = {
            patient_id: Random.guid(), // 生成一个 GUID 作为病人 ID
            patient_name: Random.cname(), // 生成一个随机的中文姓名
            doctor: Random.cname(), // 生成一个随机的中文姓名作为医生姓名
            // uploadTime: new Date(Random.date()), // 生成一个随机日期，并转换为 Date 对象
            created: Random.date()
        };
        items.push(item);
    }
    return items;
}

export default [
    {
        url: "/mock/case/list",
        method: "get",
        response: (config: any) => {
            //有pageSize和pageNo
            const { pageSize, pageNo, searchKeyWord } = config.query;
            const result: CaseTableItem[] = mockCaseTable(pageSize);
            return {
                code: 201,
                message: "成功",
                data: {
                    count: 20 * 10,//这个我就随便给一个数字把
                    results: result
                }
            }
        }
    }
] as MockMethod[]; // MockMethod[]