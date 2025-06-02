import { configureStore } from '@reduxjs/toolkit';
import tableReducer from './tableSlice';
import authorizationReducer from './authorizationSlice';
import editPageReducer from './editPageSlice';

const store = configureStore({
  reducer: {
    table: tableReducer,
    authorization: authorizationReducer,
    editPage: editPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
