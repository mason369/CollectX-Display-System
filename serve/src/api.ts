import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Response as Res, survey } from './survey';

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
    const { name, age, gender, surveyResult } = req.body || {};
    const reqData = [name, age, gender, surveyResult];
    // 判断请求参数是否完整
    const isComplete = reqData.every((item) => item);
    if (!isComplete) {
        console.log('请求参数缺失');
        return res.status(400).json({ code: 400, message: '缺少参数', data: null });
    }
    const data = await survey.save({ name, age, gender, surveyResult }); // 保存数据
    console.log(`提交问卷调查数据成功，数据为 ${JSON.stringify(data, null, 4)}`);
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
    console.log(`查询到 ${data.data.length} 条问卷调查数据`);
    res.json(data);
});

/**
 * @api {get} /survey/:id 根据 ID 查询问卷调查数据的接口
 * @apiName GetSurveyById
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.1.0
 */
app.get('/survey/question/:id', async(req: Request, res: Response<Res>) => {
    const data = await survey.findById(req.params.id); // 根据 ID 查询数据
    console.log(`查询问卷调查数据，id 为 ${req.params.id}`);
    res.status(data.code).json(data);
});

/**
 * @api {get} /survey/questions 获取该用户的所有问卷调查问题
 * @apiName GetQuestions
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.2.0
 */
app.get('/survey/questions', async(req: Request, res: Response<Res<string[]>>) => {
    const { userName } = req.query || {};
    const result = await survey.getQuestions(userName as string);
    res.json(result);
});

/**
 * @api {get} /survey/data 获取单个问卷调查数据
 * @apiName QuerySurveyData
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.3.0
 * @example {
 *   "surveyName": "2020年度问卷调查",
 *   "userName": "张三"
 *}
 */
app.get('/survey/data', async(req: Request, res: Response<Res<any[]>>) => {
    const { surveyName, userName } = req.query || {};
    const result = await survey.querySurveyData(surveyName as string, userName as string);
    res.json(result);
});

/**
 * @api {post} /survey/questions 设置调查问卷问题
 * @apiName SetQuestions
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.2.0
 * @example {
 *    "questions": [
 *    "你喜欢吃苹果吗？",
 *    "你喜欢吃香蕉吗？",
 *    "你喜欢吃橘子吗？"
 *    ],
 *    "surveyName": "水果调查问卷",
 *    "userName": "张三"
 * }
 */
app.post('/survey/questions', async(req: Request, res: Response<Res>) => {
    const { questions, surveyName, userName } = req.body || {};
    const result = await survey.setQuestions(questions, surveyName, userName);
    res.json(result);
});

/**
 * @api {post} /survey/answer 提交问卷调查答案
 * @apiName SubmitAnswers
 * @apiGroup Survey 问卷调查
 * @apiVersion 0.2.0
 * @example {
 *    "userName": "张三",
 *    "surveyName": "水果调查问卷",
 *   "questionsForm": [
 *    {
 *    "question": "你喜欢吃苹果吗？",
 *    "answer": "喜欢"
 *    },
 *    {
 *    "question": "你喜欢吃香蕉吗？",
 *    "answer": "喜欢",
 *    }
 *]
 */
app.post('/survey/answer', async(req: Request, res: Response<Res>) => {
    const { userName, surveyName, questionsForm } = req.body || {};
    const result = await survey.submitAnswers(userName, surveyName, questionsForm);
    res.json(result);
});
export default app;
