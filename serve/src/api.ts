import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import survey from './survey';
import { Response as Res } from './survey';

// 创建 express 应用
const app = express();
// 解析请求体
app.use(bodyParser.json());

/**
 * @api {post} /survey 提交问卷调查数据
 * @apiName PostSurvey
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.1.1
 */
app.post('/survey', async(req: Request, res: Response<Res>) => {
    const { name, age, gender, surveyResult } = req.body;
    if (!name || !age || !gender || !surveyResult) {
        // 如果请求参数不完整，则返回错误信息
        console.log('请求参数缺失');
        return res.status(400).json({ code: 400, message: '缺少参数', data: null });
    }
    const data = await survey.save({ name, age, gender, surveyResult }); // 保存数据
    console.log(`提交问卷调查数据成功，数据为 ${JSON.stringify(data, null, 4)}`); // 控制台输出提示信息
    res.json(data);
});

/**
 * @api {get} /survey 查询所有问卷调查数据的接口
 * @apiName GetSurvey
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.1.0
 */
app.get('/survey', async(_req: Request, res: Response<Res>) => {
    const data = await survey.list(); // 查询数据
    console.log(`查询到 ${data.data.length} 条问卷调查数据`); // 控制台输出提示信息
    res.json(data);
});

/**
 * @api {get} /survey/:id 根据 ID 查询问卷调查数据的接口
 * @apiName GetSurveyById
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.1.0
 */
app.get('/survey/:id', async(req: Request, res: Response<Res>) => {
    const data = await survey.findById(req.params.id); // 根据 ID 查询数据
    console.log(`查询问卷调查数据，id 为 ${req.params.id}`); // 控制台输出提示信息
    res.status(data.code).json(data);
});

export default app;
