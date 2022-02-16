import React from 'react';
import { connect } from 'dva';
import { Table, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { getBasicFn } from '@utils';
import moment from 'dayjs';
import { cloneDeep } from 'lodash';
import Style from './index.less';
import SearchForm from './searchForm';
import columns from './data';

const propTypes = {
  statements: PropTypes.objectOf(PropTypes.any).isRequired,
  base: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'statements';

function Statements(props) {
  const { statements, loading, base } = props;
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });
  const { statementsTable, statementsPagination, statementsSearchData, dateString } = statements;
  const { userAuth } = base;

  // 搜索条件
  const searchProps = {
    onSearch: (values) => {
      const data = cloneDeep(values);
      delete data.time;
      if (values.time && values.time.length) {
        data.startTime = values.time[0] ? moment(values.time[0]).format('YYYY-MM-DD') : undefined;
        data.endTime = values.time[1] ? moment(values.time[1]).format('YYYY-MM-DD') : undefined;
      } else {
        data.startTime = undefined;
        data.endTime = undefined;
      }
      if (values.serviceIds) {
        data.serviceIds = values.serviceIds;
      } else {
        data.serviceIds = undefined;
      }
      dispatchAction({
        type: 'getTable',
        payload: {
          ...statementsSearchData,
          ...statementsPagination,
          ...data,
        },
      });
    },
    onReset: (resetValue) => {
      // 表单重置
      resetValue.resetFields();
      dispatchAction({
        type: 'updateState',
        payload: {
          statementsSearchData: {},
          dateString: '',
        },
      });
      dispatchAction({
        type: 'getTable',
        payload: {
          current: 1,
          pageSize: statementsPagination.pageSize,
        },
      });
    },
    disabledDate: (current) => {
      if (!dateString || dateString.length === 0) {
        return false;
      }
      const tooLate = dateString[0] && current.diff(dateString[0], 'days') > 365;
      const tooEarly = dateString[1] && dateString[1].diff(current, 'days') > 365;
      return tooEarly || tooLate;
    },
    getDates: (val) => {
      dispatchAction({
        type: 'updateState',
        payload: {
          dateString: val,
        },
      });
    },
  };

  // 表格参数
  const tableProps = {
    rowKey: 'guid',
    columns: columns({ userAuth }),
    dataSource: statementsTable,
    pagination: false,
    // loading: getLoading('getTable'),
  };
  // 分页参数
  const pagaProps = {
    current: statementsPagination.current,
    pageSize: statementsPagination.pageSize,
    total: statementsPagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showTotal(total) {
      return `共${total}条`;
    },
    onChange: (current, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...statementsSearchData,
          ...statementsPagination,
          current,
          pageSize,
        },
      });
    },
    onShowSizeChange: (_, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...statementsSearchData,
          ...statementsPagination,
          current: 1,
          pageSize,
        },
      });
    },
  };
  return (
    <div className={Style.statements}>
      <div className="searchform">
        <SearchForm {...searchProps} />
      </div>
      <>
        <div className="tableList">
          <Table {...tableProps} />
        </div>
        <div className="f-tar">
          <Pagination {...pagaProps} />
        </div>
      </>
    </div>
  );
}

Statements.propTypes = propTypes;
export default connect(({ statements, loading, base }) => ({
  statements,
  loading,
  base,
}))(Statements);
