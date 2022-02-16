import React from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { NavLink } from 'dva/router';
import logo from '@assets/img/logo.jpg';
import Style from './index.module.less';

const { Item, SubMenu } = Menu;

const propTypes = {
  pathname: PropTypes.string.isRequired,
  // openKeys: PropTypes.arrayOf(PropTypes.any).isRequired,
  onOpenChange: PropTypes.func.isRequired,
  base: PropTypes.objectOf(PropTypes.any).isRequired,
};

function Menus({
  pathname,
  openKeys = [],
  onOpenChange,
  handleClick,
  base: { userAuth = {}, menuData = [] },
}) {
  return (
    <div className={Style.sider}>
      <div className={Style.title}>
        <div className={Style.logo}>
          <img src={logo} width="24" height="24" alt="logo" />
          <span
            style={{
              display: 'inline-block',
              fontSize: '16px',
              color: '#FFFFFF',
              verticalAlign: 'middle',
            }}
          >
            藏宝阁
          </span>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        className={Style.menu}
        selectedKeys={[pathname].map((item) => {
          const urls = item.split('/');
          return `/${urls[1]}`;
        })}
        openKeys={
          // 此处是为了保证在页面刷新之后，openKeys为空的情况下，来展开当前URL所在的SubMenu
          // openKeys表示当前展开的 SubMenu 菜单项 key 数组
          // SubMenu使用的key是SubMenu对应的页面的URL的前半部分URL
          openKeys.length
            ? openKeys
            : [pathname].map((item) => {
              const urls = item.split('/');
              return `/${urls[1]}`;
            })
        }
        onOpenChange={onOpenChange}
        inlineIndent={26}
      >
        {menuData.map(({
          resourceKey, icon, url, title, children = [],
        }) => {
          const name = (
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <span dangerouslySetInnerHTML={{ __html: `<i class="icon iconfont">${icon}</i>` }} />
              <span style={{ marginLeft: '8px' }}>{title}</span>
            </div>
          );
          if (
            children
            && children.length
          ) {
            return (
              <SubMenu key={url} title={name}>
                {children.map((items) => {
                  const linkProps = {
                    to: `/${resourceKey}${items.url}`,
                    // to: items.url,
                    className: Style.link,
                    activeClassName: Style.activeLink,
                  };
                  return (
                    <Item key={items.url}>
                      <NavLink {...linkProps}>{items.title}</NavLink>
                    </Item>
                  );
                })}
              </SubMenu>
            );
          }
          const linkProps = {
            to: url,
            className: Style.link,
            activeClassName: Style.activeLink,
          };
          return (
            <Item key={url}>
              <NavLink {...linkProps}>{name}</NavLink>
            </Item>
          );
        })}
      </Menu>
    </div>
  );
}

Menus.propTypes = propTypes;
export default connect(({ base }) => ({ base }))(Menus);
