import { modelExtend, getServices } from '@utils';

const services = getServices({
  getList: '/settlement/queryByPage.do', // 列表
});

const namespace = 'statements';
const initState = {
  statementsTable: [], // 列表
  statementsSearchData: {},
  statementsPagination: {
    current: 1,
    pageSize: 20,
  }, // 分页
  // 详情展示
  drawerVisible: false,
  detailValue: {},
  detailList: {},
  dateString: '',
};

export default modelExtend({
  namespace,
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/financial/statements') {
          if (history.action !== 'POP') {
            dispatch({
              type: 'updateState',
              payload: initState,
            });
          }
          dispatch({
            type: 'getTable',
            payload: {
              current: 1,
              pageSize: 20,
            },
          });
        }
      });
    },
  },
  effects: {
    // 获取列表
    *getTable({ payload }, { put, call, select }) {
      const { statementsSearchData, statementsPagination } = yield select(
        ({ statements }) => statements,
      );
      const datas = { ...statementsSearchData, ...statementsPagination, ...payload };
      const { data } = yield call(services.getList, {
        ...datas,
      });
      yield put({
        type: 'updateState',
        payload: {
          statementsTable: data.list,
          statementsPagination: {
            current: datas.current,
            pageSize: datas.pageSize,
            total: data.total,
          },
          statementsSearchData: {
            ...datas,
          },
        },
      });
    },
  },
  reducers: {},
});
