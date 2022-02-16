import React from 'react';
import { connect } from 'dva';
import { Button, Table, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { getBasicFn } from '@utils';
import { Link } from 'dva/router';
import columns from './data';
import Style from './index.module.less';
import SearchForm from './searchForm';

const propTypes = {
  myClient: PropTypes.objectOf(PropTypes.any).isRequired,
  base: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'myClient';

function MyClient(props) {
  const { myClient, loading, base } = props;
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });
  const {
    myClientTable,
    myClientPagination,
    myClientSearchData,
  } = myClient;
  const {
    userAuth,
  } = base;

  // // 表格参数
  const tableProps = {
    rowClassName: 'tableTr',
    rowKey: 'key',
    columns,
    dataSource: myClientTable,
    pagination: false,
    loading: getLoading('getTable'),
  };
  // 分页参数
  const pagaProps = {
    current: myClientPagination.current,
    pageSize: myClientPagination.pageSize,
    total: myClientPagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showTotal(total) {
      return `共${total}条`;
    },
    onChange: (current, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...myClientSearchData,
          ...myClientPagination,
          current,
          pageSize,
        },
      });
      dispatchAction({
        type: 'updateState',
        payload: {
          myClientSelectedRowKeys: [],
        },
      });
    },
    onShowSizeChange: (_, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...myClientSearchData,
          ...myClientPagination,
          current: 1,
          pageSize,
        },
      });
    },
  };
  return (
    <div className={Style.myClient}>
      <div className="searchform">
        <SearchForm />
      </div>
      <div style={{ marginBlock: '16px' }}>
        <Link to="/myClient/myHome/addMyClient">
          <Button type="primary">+ 新增客户</Button>
        </Link>
      </div>
      <div className="tableList">
        <Table {...tableProps} />
      </div>
      <div className="f-tar">
        <Pagination {...pagaProps} />
      </div>
    </div>
  );
}

MyClient.propTypes = propTypes;
export default connect(({ myClient, loading, base }) => ({
  myClient,
  loading,
  base,
}))(MyClient);
