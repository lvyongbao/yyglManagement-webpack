import React from 'react';
import PropTypes from 'prop-types';
import { Route, routerRedux, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
import Base from './routes/base/index';
import { routes } from './utils/routeData';

const { ConnectedRouter } = routerRedux;

const propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  app: PropTypes.objectOf(PropTypes.any).isRequired,
};

function Routers({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  });
  return (
    <ConnectedRouter history={history}>
      <Base>
        <Switch>
          {routes.map(({ path, ...dynamics }) => (
            <Route exact key={path} path={path} component={dynamic({ app, ...dynamics })} />
          ))}
          <Route component={error} />
        </Switch>
      </Base>
    </ConnectedRouter>
  );
}

Routers.propTypes = propTypes;
export default Routers;
