import fs from 'fs/promises';
import path from 'path';
import { Response } from './types';
import { v4 as uuidv4 } from 'uuid';

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
     * 获取data目录下所有文件名
     * @returns 返回文件名列表
     */
    public async listFiles(): Promise<string[]> {
        const dataPath = path.resolve(__dirname, 'data');
        return await fs.readdir(dataPath);
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

    /**
     * 读取该用户名文件夹下的问题json文件名并返回数组
     * @param userName 用户名
     * @returns 返回读取到的问题文件名列表
     * @example await store.readQuestionFileNames('张三');
     */
    private async readQuestionFileNames(userName: string): Promise<string[]> {
        const questionPath = path.resolve(__dirname, 'data', userName);
        return await fs.readdir(questionPath);
    }

    /**
     * 从用户名文件夹中读取问题名称
     * @param userName 用户名
     * @returns 返回读取到的问题列表
     */
    public async readQuestions(userName: string): Promise<any[]> {
        try {
            const data = await this.readQuestionFileNames(userName);
            //返回问题名称列表
            return data.map((item) => {
                return item.split('_')[0];
            });
        } catch (e: any) {
            if (e.code === 'ENOENT') {
                // 如果文件不存在，则返回空数组
                console.log(`该用户 ${userName} 未创建问题列表`);
                return [];
            }
            throw e;
        }
    }

    /**
     * 根据文件名查询数据
     * @param fileName 文件名
     * @returns 返回查询到的数据
     */
    public async findByFileName(fileName: string): Promise<any> {
        try {
            const data = await fs.readFile(fileName);
            console.log(`从 ${fileName} 文件中读取到数据`);
            return JSON.parse(data.toString());
        } catch (e: any) {
            if (e.code === 'ENOENT') {
                // 如果文件不存在，则返回undefined
                console.log(`文件 ${fileName} 不存在`);
                return undefined;
            }
            throw e;
        }
    }

    /**
     * 查询指定调查问卷的所有数据
     * @param surveyName 调查问卷id
     * @param userName 用户名
     * @returns 返回查询到的数据列表
     */
    public async querySurveyData(surveyName: string, userName: string): Promise<any[]> {
        // 根据调查问卷名称查询该调查问卷的所有数据，由于系统创建的名称为‘水果调查问卷_question.json’，所以需要添加后缀
        const filePath = path.resolve(__dirname, `data/${userName}/${surveyName}/${surveyName}_question.json`);
        // 调用findByFileName方法查询数据
        return await this.findByFileName(filePath);
    }

    /**
     * 保存问题列表到文件中
     * @param questions 问题列表
     * @param surveyName 调查问卷id
     * @param userName 用户名
     * @returns 返回保存成功信息
     * @example await store.saveQuestions(['你喜欢吃苹果吗？', '你喜欢吃香蕉吗？'], 'fruit');
     */
    public async saveQuestions(questions: string[], surveyName: string, userName: string): Promise<Response> {
        // 设置创建时间与id
        const newQuestion = {
            id        : uuidv4(),
            createTime: new Date().toISOString(),
            surveyName,
            questions
        };
        // 根据用户名创建文件夹，文件夹里再创建问题名的文件夹，将问题列表写入文件
        const userDir = path.resolve(__dirname, `data/${userName}`);
        const questionDir = path.resolve(__dirname, `data/${userName}/${surveyName}`);
        await fs.mkdir(userDir, { recursive: true });
        await fs.mkdir(questionDir, { recursive: true });
        // 将问题列表写入文件
        const filePath = path.resolve(__dirname, `data/${userName}/${surveyName}/${surveyName}_question.json`);
        await fs.writeFile(filePath, JSON.stringify(newQuestion, null, 4));
        console.log(`已将提问者 ${userName} 的问题列表${surveyName}_question.json保存至 ${filePath} 文件中`);

        return {
            code   : 0,
            message: '设置成功，问题列表已更新',
            data   : newQuestion
        };
    }

    /**
     * 保存答案到文件中
     * @param questionsForm 表单数据
     * @param surveyName 调查问卷id
     * @param userName 用户名
     */
    async saveAnswers(surveyName: string, userName: string, questionsForm: any): Promise<Response> {
        // 设置创建时间与id
        const newAnswer = {
            id        : uuidv4(),
            createTime: new Date().toISOString(),
            surveyName,
            questionsForm
        };
        // 根据用户名创建文件夹，文件夹里存放该用户创建的调查问卷
        const userDir = path.resolve(__dirname, `data/${userName}`);
        await fs.mkdir(userDir, { recursive: true });
        // 将问题列表写入文件
        const filePath = path.resolve(__dirname, `data/${userName}/${surveyName}_answer.json`);
        await fs.writeFile(filePath, JSON.stringify(newAnswer, null, 4));
        console.log(`已将回答者 ${userName} 的答案列表${surveyName}_answer.json保存至 ${filePath} 文件中`);

        return {
            code   : 0,
            message: '设置成功，答案列表已更新',
            data   : newAnswer
        };
    }
}

export default Store;
