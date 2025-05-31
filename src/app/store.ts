import { configureStore } from '@reduxjs/toolkit';
import { shipmentsApi } from '../api/shipmentsApi';

export const store = configureStore({
    reducer: { [shipmentsApi.reducerPath]: shipmentsApi.reducer },
    middleware: (gDM) => gDM().concat(shipmentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
