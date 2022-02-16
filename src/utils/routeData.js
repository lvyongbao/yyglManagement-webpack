// facilitator工作台路由
const facilitatorRouteList = [
  {
    path: 'myClient',
    name: '我的首页',
    children: [
      {
        path: 'myHome',
        name: '我的客户',
        models: () => [import('../routes/myClient/models')],
        component: () => import('../routes/myClient/index'),
        children: [
          {
            path: 'addMyClient',
            name: '新增客户',
            back: true,
            models: () => [import('../routes/myClient/detailModels')],
            component: () => import('../routes/myClient/detail'),
          },
          {
            path: 'lookClient',
            name: '客户信息',
            models: () => [import('../routes/myClient/lookClientModels')],
            component: () => import('../routes/myClient/lookClient'),
          },
        ]
      },
      {
        path: 'setUser',
        name: '个人中心',
        models: () => [import('../routes/myClient/setUserDetail/models')],
        component: () => import('../routes/myClient/setUserDetail/index'),
      },
    ],
  },
  {
    path: 'financial',
    name: '财务管理',
    children: [
      {
        path: 'settlement',
        name: '代结算数据',
        models: () => [import('../routes/financial/settlement/models')],
        component: () => import('../routes/financial/settlement/index'),
      },
      {
        path: 'statements',
        name: '结算单',
        models: () => [import('../routes/financial/statements/models')],
        component: () => import('../routes/financial/statements/index'),
        // children: [
        //   {
        //     path: 'lookStatements',
        //     name: '结算单',
        //     models: () => [import('../routes/financial/statements/detail/detailModels')],
        //     component: () => import('../routes/financial/statements/detail'),
        //   },
        // ],
      },
    ],
  },
  // {
  //   path: 'myProfile',
  //   name: '我的资料',
  //   // back: true,
  //   models: () => [import('../routes/myProfile/models')],
  //   component: () => import('../routes/myProfile/index'),
  //   children: [
  //     {
  //       path: 'info',
  //       name: '基本信息',
  //       models: () => [import('../routes/myProfile/models')],
  //       component: () => import('../routes/myProfile/index'),
  //     },
  //     {
  //       path: 'api',
  //       name: '接口权限',
  //       models: () => [import('../routes/myProfile/models')],
  //       component: () => import('../routes/myProfile/index'),
  //     },
  //   ],
  // },
];

const routes = [];

function loopRoutes(list, parentKey = '') {
  for (const item of list) {
    const { path, name, models, component, children } = item;

    const pathProp = `${parentKey}/${path}`;
    if (component) {
      routes.push({
        path: pathProp,
        models,
        component,
        name,
      });
    }
    if (Array.isArray(children) && children.length) {
      loopRoutes(children, pathProp);
    }
  }
}

// 生成路由树
loopRoutes(facilitatorRouteList);

const breadcrumbs = {};

function loopBreadcrumb(list, parentKey = '') {
  for (const item of list) {
    const { path, back, name, children } = item;

    const pathProp = `${parentKey}/${path}`;
    breadcrumbs[pathProp] = {
      name,
      back,
    };

    if (Array.isArray(children) && children.length) {
      loopBreadcrumb(children, pathProp);
    }
  }
}

// 生成面包屑对象
loopBreadcrumb(facilitatorRouteList);

export { routes, breadcrumbs };
