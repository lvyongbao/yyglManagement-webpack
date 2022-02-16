import React from 'react';
import { Tooltip } from 'antd';
import Style from './index.module.less';

const columns = [
  {
    width: '300px',
    title: '客户税号',
    dataIndex: 'customerTaxNum',
  },
  {
    width: '300px',
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    width: '144px',
    title: '结算金额(元）',
    dataIndex: 'amount',
  },
  {
    width: '200px',
    title: '开通产品',
    dataIndex: 'productName',
    render: (text) => <div>{text || '-'}</div>,
  },
  {
    width: '400px',
    title: '服务单位',
    dataIndex: 'serviceName',
    render: (text) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (text.length > 26) {
        return (
          <Tooltip title={text} placement="topLeft">
            <div className={Style.spill}>{text}</div>
          </Tooltip>
        );
      }
      return <div>{text}</div>;
    },
  },
  {
    width: '150px',
    title: '项目创建日期',
    dataIndex: 'checkTime',
    render: (text) => {
      if (text) {
        return (
          <div>
            <div>{text}</div>
          </div>
        );
      }
      return <div>-</div>;
    },
  },
  {
    width: '140px',
    title: '项目验收日期',
    dataIndex: 'passTime',
    render: (text) => {
      if (text) {
        return (
          <div>
            <div>{text}</div>
          </div>
        );
      }
      return <div>-</div>;
    },
  },
];

export default columns;
