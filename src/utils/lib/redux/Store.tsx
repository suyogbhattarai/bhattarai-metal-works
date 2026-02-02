import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authReducer from './features/auth/authSlice'
import productReducer from './features/products/productSlice'
import managementReducer from './features/management/managementSlice'
import portfolioReducer from './features/portfolio/portfolioSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        management: managementReducer,
        portfolio: portfolioReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
