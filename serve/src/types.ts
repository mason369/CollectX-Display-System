/* eslint-disable @typescript-eslint/no-explicit-any */

/**和后端约定好接口返回的数据结构
 * @export Response
 * @template T
 * @interface Response
 * @property {number} code 状态码
 * @property {string} message 提示信息
 * @property {T} data 返回的数据
 */
export interface Response<T = any> {
    code: number;
    message: string;
    data: T;
}
