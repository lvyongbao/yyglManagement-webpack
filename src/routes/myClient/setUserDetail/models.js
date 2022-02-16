import { message } from 'antd';
import { modelExtend, getServices } from '../../../utils';

const services = getServices({
  setName: {
    url: 'service/yyptback/user/updateRealname.do',
    type: 'post',
  },
  bindMobile: {
    url: 'service/yyptback/user/updateMobile.do',
    type: 'post',
  },
  getSessionUser: {
    url: 'service/yyptback/user/getSessionUser.do',
    type: 'get',
  },
});

const otherServices = getServices(
  {
    updatePwd: {
      url: 'service/yyptback/user/updatePw.do',
      type: 'post',
    },
  },
  false,
);

const initialState = {
  codeMsg: '发送验证码',
  btnStatus: false,
  user: {},
  count: 60,

  phoneModalVisible: false, // 手机号码弹框
};

export default modelExtend({
  namespace: 'setUser',
  state: initialState,
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/setUserDetail') {
          dispatch({ type: 'updateState', payload: initialState });
          dispatch({
            type: 'getSessionUser',
          });
        }
      });
    },
  },
  effects: {
    // 获取用户信息
    * getSessionUser({ payload }, { call, put }) {
      const { data } = yield call(services.getSessionUser, payload);
      yield put({
        type: 'updateState',
        payload: {
          user: data,
          mobileStatus: data.cPhone ? '重新绑定' : '绑定',
        },
      });
    },
    // 修改真实姓名
    * setName({ payload }, { call }) {
      yield call(services.setName, payload);
      message.success('修改成功');
    },
    // 修改绑定手机号
    * bindMobile({ payload }, { call }) {
      return yield call(services.bindMobile, payload);
    },
    // 修改密码
    * updatePwd({ payload }, { call }) {
      const data = yield call(otherServices.updatePwd, {
        ...payload,
      });
      return data;
    },
  },
  reducers: {},
});
