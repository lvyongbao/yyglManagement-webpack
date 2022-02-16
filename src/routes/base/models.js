import { modelExtend } from '@utils';
import data from '../../utils/menuData';

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
  },
});
