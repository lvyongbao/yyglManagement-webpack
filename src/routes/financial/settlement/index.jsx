import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';
import { getBasicFn } from '@utils';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import Style from './index.module.less';
import SearchForm from './searchForm';
import columns from './data';

const propTypes = {
  settlement: PropTypes.objectOf(PropTypes.any).isRequired,
  base: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'settlement';
function Settlement(props) {
  const { settlement, loading, base } = props;
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading });
  const { settlementTable, settlementSearchData, settlementPagination } = settlement;
  const { userAuth } = base;

  // 搜索条件
  const searchProps = {
    onSearch: (values) => {
      const data = cloneDeep(values);
      delete data.time;
      if (values.time && values.time.length) {
        data.addStartTime = moment(values.time[0]).format('YYYY-MM-DD');
        data.addEndTime = moment(values.time[1]).format('YYYY-MM-DD');
      }
      if (values.serviceIds) {
        data.serviceIds = values.serviceIds;
      }
      dispatchAction({
        type: 'getTable',
        payload: {
          ...settlementSearchData,
          ...settlementPagination,
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
          settlementSearchData: {},
        },
      });
      dispatchAction({
        type: 'getTable',
        payload: {
          current: 1,
          pageSize: settlementPagination.pageSize,
        },
      });
    },
  };

  // 表格参数
  const tableProps = {
    rowKey: 'guid',
    columns,
    dataSource: settlementTable,
    pagination: false,
    loading: getLoading('getTable'),
  };
  // 分页参数
  const pagaProps = {
    current: settlementPagination.current,
    pageSize: settlementPagination.pageSize,
    total: settlementPagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showTotal(total) {
      return `共${total}条`;
    },
    onChange: (current, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...settlementSearchData,
          ...settlementPagination,
          current,
          pageSize,
        },
      });
    },
    onShowSizeChange: (_, pageSize) => {
      dispatchAction({
        type: 'getTable',
        payload: {
          ...settlementSearchData,
          ...settlementPagination,
          current: 1,
          pageSize,
        },
      });
    },
  };
  return (
    <div className={Style.settlement}>
      <div className="searchform">
        <SearchForm {...searchProps} />
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

Settlement.propTypes = propTypes;
export default connect(({ settlement, loading, base }) => ({
  settlement,
  loading,
  base,
}))(Settlement);
