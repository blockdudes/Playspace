import { configureStore } from '@reduxjs/toolkit';
import integrateWalletReducer from './reducers/integrate_wallet_slice';
import userDataReducer from './reducers/user_data_slice';
import gameDataReducer from './reducers/game_data_slice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            wallet: integrateWalletReducer,
            user: userDataReducer,
            games: gameDataReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        })
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']