import { modelExtend, getServices } from '@utils';

const services = getServices({
  getList: '/myClientrecord/list.do', // 管理员已读
  getDelete: {
    type: 'post',
    url: '/myClientrecord/delete.do',
    headers: { 'Content-Type': 'multipart/form-data' },
  }, // 列表页批量删除
  getState: {
    type: 'get',
    url: '/myClientrecord/ifState.do',
  }, // 查询该条记录是公海或私海
  // 更进记录详情
  getDetail: {
    type: 'get',
    url: '/myClientrecord/getDetail.do',
  },
  // 全部员工
  getAllEmployee: {
    type: 'get',
    url: 'user/getAllEmployee.do',
  },
});

const dataSource = [
  {
    key: '1',
    name: '浙江诺诺网络科技有限公司',
    time: '2019.06.01  13:05:51',
    address: '1',
    taxcode: '1232424242434',
  },
  {
    key: '2',
    name: '浙江诺诺网络科技有限公司',
    time: '2022.06.01  13:05:00',
    address: '12',
    taxcode: '1232424242411',
  },
];

const namespace = 'myClient';
const initState = {
  myClientTable: dataSource, // 列表
  myClientSearchData: {},
  myClientPagination: {
    current: 1,
    pageSize: 20,
  }, // 分页
};

export default modelExtend({
  namespace,
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/myClient/addMyClient') {
          if (history.action !== 'POP') {
            dispatch({
              type: 'updateState',
              payload: initState,
            });
          }
          // dispatch({
          //   type: 'getTable',
          //   payload: {
          //     current: 1,
          //     pageSize: 20,
          //   },
          // });
        }
      });
    },
  },
  effects: {
    // 获取列表
    * getTable({ payload }, { put, call, select }) {
      const { myClientSearchData, myClientPagination } = yield select(({ myClient }) => myClient);
      const datas = { ...myClientSearchData, ...myClientPagination, ...payload };
      const { data } = yield call(services.getList, {
        ...datas,
      });
      yield put({
        type: 'updateState',
        payload: {
          myClientTable: data.list,
          myClientPagination: {
            current: datas.current,
            pageSize: datas.pageSize,
            total: data.total,
          },
          myClientSearchData: {
            ...datas,
          },
          buttonDisbaled: true,
        },
      });
    },
    * getIfState({ payload }, { call }) {
      return yield call(services.getState, {
        ...payload,
      });
    },
    * getDeleteCrm({ payload }, { call }) {
      return yield call(services.getDelete, {
        ...payload,
      });
    },
    * getDetail({ payload }, { call }) {
      return yield call(services.getDetail, {
        ...payload,
      });
    },
    // 获取全部员工(包括离职)
    * getAllEmployee({ payload }, { put, call }) {
      const { data } = yield call(services.getAllEmployee, {
        ...payload,
      });
      yield put({
        type: 'updateState',
        payload: {
          allEmployeeList: data,
        },
      });
    },
  },
  reducers: {},
});
