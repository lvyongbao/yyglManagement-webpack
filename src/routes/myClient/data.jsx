import React from 'react';
import { Link } from 'dva/router';
import { message } from 'antd';

const columns = [
  {
    title: '客户税号',
    dataIndex: 'taxcode',
    key: 'name',
  },
  {
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '添加时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '开通资质数',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '操作',
    dataIndex: 'address',
    key: 'address',
    render() {
      return (
        <>
          <Link to="/myClient/myHome/lookClient" className="yypt-inline-block">
            客户信息
          </Link>
        </>
      );
    },
  },
];

export default columns;
