/*
 * @Author: 大宝
 * @Date: 2021-08-11 10:10
 * @LastEditTime: 2021-08-11 10:10
 * @LastEditors: 大宝
 * @Description: 面包屑
 */

import React from 'react';
import { withRouter, NavLink } from 'dva/router';
import { Breadcrumb } from 'antd';
import { last } from 'lodash';
import path2Regexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import { breadcrumbs } from '@utils/routeData';
import Styles from './index.module.less';

const lastPathname = [];

function Bread({ location, history }) {
  let crumbs = [];
  const paths = [];

  const { pathname } = location;

  if (last(lastPathname) !== pathname) {
    lastPathname.push(pathname);
    if (lastPathname.length > 2) {
      lastPathname.shift();
    }
  }
  pathname
    .split('/')
    .filter((x) => x)
    .reduce((memo, path) => {
      const pathProp = `${memo}/${path}`;
      paths.push(pathProp);
      return pathProp;
    }, '');

  for (const [path, value] of Object.entries(breadcrumbs)) {
    const re = path2Regexp(path);

    let match = null;
    for (const regPath of paths) {
      match = re.exec(regPath);
      if (match) {
        break;
      }
    }

    if (match) {
      crumbs.push({ path: match[0], ...value });
    }
  }
  crumbs = crumbs.sort((a, b) => a.path.length - b.path.length);
  const length = crumbs.length - 1;

  return (
    <Breadcrumb separator="/">
      {crumbs.map(({ name, path, back }, index) => {
        if (back && index < length) {
          let handleClick;

          if (lastPathname[0] === path) {
            handleClick = (e) => {
              e.preventDefault();
              history.go(-1);
            };
          }

          const linkProps = {
            activeClassName: Styles.active,
            onClick: handleClick,
            to: path,
            className: Styles.active,
          };

          return (
            <Breadcrumb.Item key={path}>
              <NavLink {...linkProps}>{name}</NavLink>
            </Breadcrumb.Item>
          );
        }
        return <Breadcrumb.Item key={path}>{name}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}

Bread.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default withRouter(Bread);
