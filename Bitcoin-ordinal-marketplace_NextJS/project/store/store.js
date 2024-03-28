import { configureStore } from '@reduxjs/toolkit';
import { walletReducer } from './walletReducer';
import { createWrapper } from 'next-redux-wrapper'

const store = () => configureStore({
  reducer: {
    wallet: walletReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([]),
});

export default createWrapper(store);