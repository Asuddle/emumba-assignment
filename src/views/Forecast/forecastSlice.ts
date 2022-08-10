import { createSlice } from '@reduxjs/toolkit';

type SliceState = { dialog: boolean; city: string };
type PayloadAction = { payload: string };

const initialState: SliceState = {
	dialog: false,
	city: '',
};

export const forecastSlice = createSlice({
	name: 'forecast',
	initialState,
	reducers: {
		handleForecast: (state, action: PayloadAction) => {
			state.dialog = !state.dialog;
			state.city = action.payload || '';
		},
	},
});
export const { handleForecast } = forecastSlice.actions;

export default forecastSlice.reducer;
