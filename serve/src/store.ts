import fs from 'fs/promises';

/**
 * Store 类
 * 用于数据存储
 */
class Store {
    filePath: string;
    /**
     * 构造函数
     * @param filePath 文件路径
     */
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * 保存数据到文件中
     * @param data 要保存的数据
     * @returns 返回保存后的数据
     * @example await store.save({ name: '张三', age: 18 });
     */
    public async save(data: any): Promise<any[]> {
        // 读取文件中已有的数据
        const fileData = await this.readFromFile();
        // 将新数据合并入已有数据，并写入文件
        const newData = [...fileData, data];
        // 格式化数据并写入文件
        await fs.writeFile(this.filePath, JSON.stringify(newData, null, 4));
        console.log(`已将数据保存至 ${this.filePath} 文件中`); // 控制台输出提示信息
        return newData;
    }

    /**
     * 从文件中读取数据
     * @returns 返回读取到的数据
     * @example await store.read();
     */
    public async read(): Promise<any[]> {
        const fileData = await this.readFromFile();
        console.log(`从 ${this.filePath} 文件中读取到数据`); // 控制台输出提示信息
        return fileData;
    }

    /**
     * 从文件中读取数据（内部方法）
     * @private
     * @returns 返回读取到的数据
     * @example await store.readFromFile();
     */
    private async readFromFile(): Promise<any[]> {
        try {
            const data = await fs.readFile(this.filePath);
            return JSON.parse(data.toString());
        } catch (e: any) {
            if (e.code === 'ENOENT') {
                // 如果文件不存在，则返回空数组
                console.log(`文件 ${this.filePath} 不存在`);
                return [];
            }
            throw e;
        }
    }
}

export default Store;
