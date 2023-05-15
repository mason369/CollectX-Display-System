import http from 'http';
import app from './api';

const server = http.createServer(app);

const port = process.env.PORT || 3000; // 获取端口号，默认为 3000

/**
 * 监听端口
 * @param {number} port 端口号
 * @param {Function} callback 回调函数
 * @returns {void}
 */
server.listen(port, () => {
    console.log(`应用程序启动，监听端口 ${port}`); // 控制台输出提示信息
});
