import { modelExtend } from '@utils';

// const services = getServices({
//   postData: 'service/yyptback/support/getDataByParamPOST.do', // post接口
//   getData: {
//     url: 'service/yyptback/support/getDataByGet.do',
//     type: 'get',
//   },
// });
// // 特殊化需要判断非200的业务逻辑
// const ohterServices = getServices(
//   {
//     postData: 'service/yyptback/support/getDataByParamPOST.do', // post接口
//   },
//   false,
// );
const namespace = 'myClientDetail';

const initState = {
  detailData: {}, // 详情数据
  myClientDetailType: 0, // 0 新增 1 编辑
  imgUrl: '',
  uploadLoading: false,
};

export default modelExtend({
  namespace,
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/myClient/addMyClient') {
          dispatch({ type: 'updateState', payload: initState });
        }
      });
    },
  },
  effects: {
    // 新增
    // * addMyClient({ payload }, { call }) {
    //   const data = yield call(ohterServices.postData, {
    //     ...payload,
    //     supportTag: 'service_addPortalHomepageImage',
    //   });
    //   return data;
    // },
    // // 获取详情
    // * getmyClientDetail({ payload }, { call, put }) {
    //   const { data } = yield call(services.getData, {
    //     ...payload,
    //     supportTag: 'service_getPortalHomepageImageById',
    //   });
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       detailData: data,
    //     },
    //   });
    // },
  },
  reducers: {},
});
