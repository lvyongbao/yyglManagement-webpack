import { message } from 'antd';
import moment from 'moment';
import createLoading from 'dva-loading';
import base from './base';
import routes from './router';

// 全局组件配置
moment.locale('zh-cn');

message.config({
  duration: 3,
  top: 100,
  maxCount: 3,
});

base.use(createLoading({ effects: true }));

// 2. Model
base.model(require('./routes/base/models.js').default);
// 全局变量和公共请求往这放

// 3. Router
base.router(routes);

// 4. Start
base.start('#root');
