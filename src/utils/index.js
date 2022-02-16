import {
  mapValues, isPlainObject, trim, flatten,
} from 'lodash';
import moment from 'moment';

import request from './request';
import modelExtend from './modelExtend';
import base from '../base';
import axios from './axiosInstance';

const baseUrl = '/isv/manage/web';

/**
 * @description 请求地址拼接
 * @param {*} pre
 * @param {*} after
 */
const pathResolve = (pre = '', after = '') => {
  if (after.charAt(0) === '/') {
    return pre + after;
  }
  return `${pre}/${after}`;
};
/**
 * @description 异步请求
 * @param {*} url  请求地址
 * @param {*} method  请求类型  如常用类型get  post
 * @param {bool} defaultFlag axios 拦截器是否只判断接口返回业务码是200的情况
 */
const generateRequest = (url, method, defaultFlag, isUrl = false, headers, params = {}) => async function f(data = {}) {
  return request(
    {
      url,
      method,
      data:
        typeof data === 'string'
          ? data
          : {
            ...params,
            ...data,
          },
      isUrl,
      headers: {
        ...headers,
        // 后端约定所以接口传值还是不传
        params: {
          userId: sessionStorage.getItem('userId'),
          employeeId: sessionStorage.getItem('employeeId'),
        },
      },
    },
    defaultFlag,
  );
};
/**
 * @description 工具函数 转换请求对象为数组
 * @param {*} data  全部接口地址对象
 * @param {*} basePrefix
 * @param {bool} defaultFlag axios 拦截器是否只判断接口返回业务码是200的情况 否则判断[199,300]开区间 不满足条件抛出异常全局判断
 */
const getServices = (data = {}, defaultFlag = true, basePrefix = baseUrl) => mapValues(data, (val) => {
  if (isPlainObject(val)) {
    const {
      url, type = 'get', isUrl, headers, params,
    } = val;
    return generateRequest(
      pathResolve(basePrefix, url),
      type,
      defaultFlag,
      isUrl,
      headers,
      params,
    );
  }
  return generateRequest(pathResolve(basePrefix, val), 'post', defaultFlag);
});
/**
 *
 * @param {*} data 下拉框数组
 * @param {*} param 配置数组参数
 */
const getOption = (data = [], { idStr, nameStr, callback = () => {} } = {}) => {
  let newArr = [];
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    const id = idStr || keys.filter((_) => ['id', 'value', 'key'].includes(_))[0];
    const name = nameStr || keys.filter((_) => ['name', 'label', 'title'].includes(_))[0];
    if (id && name) {
      newArr = data.map((item) => ({
        name: 'Option',
        props: {
          key: item[id],
          value: item[id] && String(item[id]),
          children: item[name],
          disabled: item.disabled,
          ...callback(item),
        },
      }));
    } else {
      throw keys;
    }
  }
  return newArr;
};
/**
 *
 * @param {*} pagination Tableb表格翻页信息参数  包含current和pageSize
 * @returns {object}
 */
const getPagination = (pagination = {}) => ({
  ...pagination,
  showTotal(total) {
    return `共${total}条`;
  },
  showQuickJumper: true,
});
/**
 * @description 基础函数
 * @param {*} param
 */
const getBasicFn = ({ namespace, loading: { effects = {} } = {} }) => {
  /**
   * @description dispatchAciont事件封装
   * @param {*} param0
   */
  const dispatchAction = ({ type, payload }) => base._store.dispatch({
    type: type.includes('/') ? type : `${namespace}/${type}`,
    payload,
  });
  /**
   * 获取loading
   * @param  {...any} arr
   */
  const getLoading = (...arr) => arr.some((iten) => effects[`${namespace}/${iten}`]);
  return {
    dispatchAction,
    getLoading,
  };
};
/**
 * @description 基础函数
 * 调用：
 * countAll.count('+',pirce,num)
 * countAll.count('-',pirce,num)
 * countAll.count('*',pirce,num)
 * countAll.count('/',pirce,num)
 */
// 数组转字符串 splitType为分隔符
const arrToStr = (arr, spiltType) => {
  if (Array.isArray(arr)) {
    let str = '';
    for (const value of arr.values()) {
      str += `${value}${spiltType}`;
    }
    str = str.substr(0, str.length - 1);
    return str;
  }
  return arr;
};
/**
 * @param {*} list 需要遍历的数组
 * @param {*} keys 对应可以字段key
 */
const deep = (
  list = [],
  keys = {
    idStr: 'id',
    nameStr: 'name',
    childrenStr: 'children',
  },
) => list.map((items) => {
  const children = items[keys.childrenStr];
  if (children && children.length) {
    return {
      id: items[keys.idStr],
      value: items[keys.idStr],
      key: items[keys.idStr],
      title: items[keys.nameStr],
      children: deep(children, keys),
    };
  }
  return {
    id: items[keys.idStr],
    value: items[keys.idStr],
    key: items[keys.idStr],
    title: items[keys.nameStr],
  };
});

// 一步加载treeSelect
const genTreeNode = (parentId, childData) => childData.map((item) => ({
  pId: parentId,
  key: `${item.id}`,
  id: `${item.id}`,
  value: item.id,
  title: item.title,
}));

/*
 * 接受一组对象，将返回一个由数组中对象中的url属性组成的数组；
 * 如果对象中嵌套children，就将children中的对象中的url也加入到数组之中
 * @param {*} data 一组对象
 * @returns url组成的数组
 */
const deepFind = (data, parentUrl = '') => flatten(
  data.map((item) => {
    if (item.children && item.children.length) {
      return deepFind(item.children, '');
    }
    return parentUrl + item.url;
  }),
);

// 获取浏览器url参数
const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  let r = window.location.href.split('#')[1].substr(2).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
};

/**
 * 格式化查询条件
 * @param {*} data form提交的对象
 * @returns
 */
const formatSearchData = (data) => {
  const params = {};

  Object.keys(data).forEach((key) => {
    if (key) {
      const value = data[key];
      if (key.includes(',')) {
        // 日期范围
        const [startKey, endKey] = key.split(',');
        const [startValue, endValue] = value || [];
        params[startKey] = startValue ? moment(startValue).format('YYYY-MM-DD') : undefined;
        params[endKey] = endValue ? moment(endValue).format('YYYY-MM-DD') : undefined;
      } else if (Array.isArray(value) && value.length === 0) {
        params[key] = undefined;
      } else if (typeof value === 'string') {
        // 字符串过滤前后空格
        params[key] = trim(value);
      } else {
        params[key] = value;
      }
    }
  });
  return params;
};

/**
 * 重置查询条件
 * @param {*} data
 * @returns
 */
const resetSearchData = (data) => {
  const params = {};
  Object.keys(data).forEach((key) => {
    if (key) {
      const value = data[key];
      if (key.includes(',')) {
        // 日期范围
        const [startKey, endKey] = key.split(',');
        params[startKey] = undefined;
        params[endKey] = undefined;
      } else if (Array.isArray(value) && value.length === 0) {
        params[key] = undefined;
      } else {
        params[key] = undefined;
      }
    }
  });
  return params;
};

/**
 * 判断文本是不是null、undefined、''
 * @param {*} text 检查文本
 * @returns 结果
 */
const isNull = (text) => text === null || text === undefined || text === '';

/**
 * 判断对象中是否存在一个值
 * @param {*} data 检验的对象
 * @returns 返回是否存在
 */
const doesItExist = (data) => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Object.keys(data).some((key) => {
    const item = data[key];
    return !(item === '' || item === undefined || item === null);
  });
};

/**
 * 如果传入的值为null、undefined、''，一律置空
 * 否者就给人家返回原值
 * @param {*} text 传入的值
 * @param {*} empty 置空的值，如'--'
 * @returns 返回值
 */
const isEmpty = (text, empty = undefined) => (isNull(text) ? empty : text);

export {
  axios,
  modelExtend,
  getServices,
  pathResolve,
  getOption,
  getPagination,
  getBasicFn,
  arrToStr,
  deep,
  genTreeNode,
  deepFind,
  getQueryString,
  formatSearchData,
  resetSearchData,
  doesItExist,
  isNull,
  isEmpty,
};
