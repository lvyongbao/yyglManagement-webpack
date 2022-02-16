import { modelExtend, getServices } from '@utils';

const services = getServices({
  getList: '/waitingSettlement/getWaitSettleList.do', // 列表
  getProduct: {
    // 开通产品
    type: 'get',
    url: '/product/queryProduct.do',
  },
});

const namespace = 'settlement';
const initState = {
  settlementTable: [], // 列表
  settlementSearchData: {},
  settlementPagination: {
    current: 1,
    pageSize: 20,
  }, // 分页
  allProductList: [],
};

export default modelExtend({
  namespace,
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/financial/settlement') {
          if (history.action !== 'POP') {
            dispatch({
              type: 'updateState',
              payload: initState,
            });
          }
        }
      });
    },
  },
  effects: {
    // 获取列表
    * getTable({ payload }, { put, call, select }) {
      const { settlementSearchData, settlementPagination } = yield select(
        ({ settlement }) => settlement,
      );
      const datas = { ...settlementSearchData, ...settlementPagination, ...payload };
      const { data } = yield call(services.getList, {
        ...datas,
      });
      yield put({
        type: 'updateState',
        payload: {
          settlementTable: data.list,
          settlementPagination: {
            current: datas.current,
            pageSize: datas.pageSize,
            total: data.total,
          },
          settlementSearchData: {
            ...datas,
          },
        },
      });
    },
    // 开通产品
    * getAllProduct({ payload }, { put, call }) {
      const { data } = yield call(services.getProduct, {
        ...payload,
      });
      yield put({
        type: 'updateState',
        payload: {
          allProductList: data,
        },
      });
    },
  },
  reducers: {},
});
