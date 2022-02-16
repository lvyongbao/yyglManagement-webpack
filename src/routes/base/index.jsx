import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import { getBasicFn } from '@utils';
import Header from './Header';
import Menus from './Menus';
import Breadcrumb from './Breadcrumb';
import '@assets/iconfont/iconfont';
import '@assets/iconfont/iconfont.css';
import '@assets/css/index.less';
import Style from './index.module.less';

const { Sider } = Layout;

const propTypes = {
  base: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.objectOf(PropTypes.any).isRequired,
};
const namespace = 'base';
function Base(props) {
  const {
    children, location, loading, base,
  } = props;
  const { dispatchAction } = getBasicFn({ namespace });
  const {
    openKeys, userInfo, userAuth, enterprise, menuData,
  } = base;
  const { pathname } = location;

  // 权限判断
  // const notFound = !deepFind(menuData).includes(pathname);

  // 侧边菜单
  const menusProps = {
    userAuth,
    pathname,
    openKeys,
    onOpenChange(keys) {
      if (keys && keys.length) {
        sessionStorage.setItem('openKeys', JSON.stringify(keys));
      } else {
        sessionStorage.removeItem('openKeys');
      }
      dispatchAction({
        type: `${namespace}/updateState`,
        payload: {
          openKeys: keys,
        },
      });
    },
  };

  const headerProps = {
    userInfo,
    handleOut(e) {
      if (e === '1') {
        dispatchAction({
          type: `${namespace}/loginOut`,
        });
      } else {
        dispatchAction({
          type: `${namespace}/enterpriseSwitch`,
          payload: {
            enterpriseId: e,
          },
        });
      }
    },
    enterprise,
  };
  return (
    <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false}>
      <Layout className={Style.layout}>
        <Sider width={180} collapsedWidth={60} trigger={null} collapsible>
          <Menus {...menusProps} />
        </Sider>
        <Layout className={Style.content}>
          <div>
            <Header {...headerProps} />
          </div>
          <div className={Style['layout-main']}>
            <div className={Style.main}>
              <div className={Style['main-crumbs']}>
                <Breadcrumb style={{ userSelect: 'none' }} />
              </div>
              <div className="main-content">{children}</div>
            </div>
          </div>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

Base.propTypes = propTypes;
export default withRouter(connect(({ base, loading }) => ({ base, loading }))(Base));
