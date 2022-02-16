// 开发使用的模拟数据
export default {
  mockMenuData: [
    {
      resourceKey: 'myClient',
      icon: '&#xf213;',
      title: '我的首页',
      children: [
        {
          resourceKey: 'myHome',
          title: '我的客户',
          url: '/myHome',
        },
        {
          resourceKey: 'setUser',
          title: '个人中心',
          url: '/setUser',
        },
      ],
    },
    {
      resourceKey: 'financial',
      icon: '&#xf21d;',
      title: '财务管理',
      children: [
        {
          resourceKey: 'settlement',
          title: '代结算数据',
          url: '/settlement',
        },
        {
          resourceKey: 'statements',
          title: '结算单',
          url: '/statements',
        },
      ],
    },
    // {
    //   resourceKey: 'myProfile',
    //   icon: '&#xf21c;',
    //   title: '我的资料',
    //   url: '/myProfile',
    // },
  ],
};
