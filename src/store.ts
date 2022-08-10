import { configureStore } from '@reduxjs/toolkit';
import forecastSlice from './views/Forecast/forecastSlice';

const store = configureStore({
	reducer: {
		forecast: forecastSlice,
	},
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;

// export type AppThunk<ReturnType = void> = ThunkAction<
// 	ReturnType,
// 	RootState,
// 	unknown,
// 	Action<string>
// >;
