import { modelExtend } from '@utils';
import data from '../../utils/menuData';

const demo = {
  "companyList": [
    {
      "children": [
        {
          "children": [],
          "name": "胡总",
          "id": "HZ123456789",
          "title": "胡总科技"
        },
        {
          "children": [
            {
              "children": [
                {
                  "children": [],
                  "name": "飞总1号",
                  "id": "FZ1H123456789",
                  "title": "飞总1号科技"
                }
              ],
              "name": "飞总2号",
              "id": "FZ2H123456789",
              "title": "飞总2号科技"
            }
          ],
          "name": "飞总",
          "id": "FZ123456789",
          "title": "飞总科技"
        },
        {
          "children": [],
          "name": "翔哥",
          "id": "XG123456789",
          "title": "翔哥科技"
        },
        {
          "children": [],
          "name": "达哥",
          "id": "DG123456789",
          "title": "达哥科技"
        },
        {
          "children": [],
          "name": "锁哥",
          "id": "SG123456789",
          "title": "锁哥科技"
        },
        {
          "children": [],
          "name": "起哥",
          "id": "QG123456789",
          "title": "起哥科技"
        },
        {
          "children": [],
          "name": "斌斌",
          "id": "BB123456789",
          "title": "斌总科技"
        }
      ],
      "name": "全部",
      "id": "DB123456789",
      "title": "大宝网络科技有限公司"
    }
  ]
}

const deep = (list = []) =>
  list.map(({ id, name, children = [] }) => {
    if (children && children.length) {
      return {
        title: name,
        value: id,
        key: id,
        children: deep(children),
      };
    }
    return {
      title: name,
      value: id,
      key: id,
    };
  });

const namespace = 'base';
const initState = {
  models: '/myClient/myHome', // 当前models调用
  // 用户登录状态
  isLogin: false,
  openKeys: [],
  // 当前登录用户登录信息
  userInfo: {},
  // 所属企业列表
  enterprise: {
    enterpriseList: [],
    fristId: '',
  },
  // 菜单数据
  menuData: [],
  // 用户权限 操作权限
  userAuth: {},
  // 服务单位
  getAllCompanyList: [],
};
export default modelExtend({
  namespace,
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: 'getMockData',
      });
      dispatch({
        type: 'getServiceUnit',
      });
    },
  },
  effects: {
    // 获取mock地址
    * getMockData(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          menuData: data.mockMenuData,
        },
      });
    },
    // 服务单位
    * getServiceUnit(_, { put }) {
    yield put({
      type: 'updateState',
      payload: {
        getAllCompanyList: deep(demo.companyList),
      },
    });
  },
  },
});
