import React from 'react';
import { Badge } from 'antd';
import IconTooltip from '@components/iconTooltip';
import { Link } from 'dva/router';
import Style from './index.less';

const columns = ({ userAuth }) => [
  {
    title: '结算单号',
    dataIndex: 'settlementNo',
    key: 'settlementNo',
  },
  {
    title: '结算金额(元)',
    dataIndex: 'payAmount',
    key: 'payAmount',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render(text, record) {
      const { rejectRemark } = record;
      if (text === 0) {
        return (
          <div>
            <Badge status="success" text="待确认" />
          </div>
        );
      }
      if (text === 1) {
        return (
          <div>
            <Badge status="purple" text="待核销" />
          </div>
        );
      }
      if (text === 2) {
        return (
          <div>
            <Badge status="blue" text="已核销" />
          </div>
        );
      }
      if (text === 3 || text === 4) {
        return (
          <div>
            <Badge status="error" text="确认失败" />
            <IconTooltip title={rejectRemark} />
          </div>
        );
      }
    },
  },
  {
    title: '操作',
    render(_, record) {
      const { guid, status } = record;
      return (
        <>
          <Link to={`/financial/statements/lookStatements?guid=${guid}&detailType=0`}>查看</Link>
          <>
            <span
              className={Style.line}
              style={{ width: '1px', height: '14px', background: '#E8E8E8' }}
            />
            <Link to={`/financial/statements/lookStatements?guid=${guid}&detailType=1`}>
              确认
            </Link>
          </>
        </>
      );
    },
  },
];

export default columns;
