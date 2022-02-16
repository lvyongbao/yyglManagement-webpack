import dvaModelExtend from 'dva-model-extend';
import { defaultsDeep, cloneDeep } from 'lodash';

export default (model) => {
  const initialState = cloneDeep(model.state);
  return dvaModelExtend(
    {
      reducers: {
        updateState(state, { payload = {}, partObj = false }) {
          if (partObj) {
            return defaultsDeep(payload, state);
          }
          return {
            ...state,
            ...payload,
          };
        },
        reset() {
          return {
            ...initialState,
          };
        },
      },
    },
    model,
  );
};
