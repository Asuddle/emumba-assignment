import { CircularProgress, Grid } from '@mui/material';

import ForecastModal from './components/modal';
import Virtualize from './components/autoComplete';
import { handleForecast } from './forecastSlice';
import { useAxios } from '../../hooks/useAxios';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

function Forecast() {
	const dispatch = useDispatch();
	const [zipCode, setZipCode] = useState<string>('');

	const apiZipCodeData = {
		params: { key: '4ce7481ec118414a81b135806222806', q: zipCode },
		url: '/search.json',
	};

	const {
		successResponse,
		loading,
	}: {
		loading: boolean;
		successResponse: any;
		errorResponse: {};
	} = useAxios(apiZipCodeData, zipCode, zipCode !== '');

	const getZipCode = (zip) => {
		setZipCode(zip);
	};
	const selectCity = (city) => {
		dispatch(handleForecast(city));
	};
	return (
		<div>
			<Grid
				container
				justifyContent='center'
				alignItems='center'
				direction='column'
				className='top-grid'
			>
				<Grid item xs={12} sm={10} md={8} lg={8} xl={8}>
					<div className='increase-width-div'></div>
					<div className='forecast-wrapper'>
						<h1>Weather Forecast</h1>
						<br />
						<br />
						<Virtualize getZipCode={getZipCode} />
						<br />
						{zipCode !== '' && loading ? (
							<CircularProgress />
						) : (
							<Grid
								container
								spacing={3}
								justifyContent='center'
								alignItems='center'
							>
								{Object.keys(successResponse).length > 0 &&
									successResponse.map((item) => (
										<Grid item key={item.name}>
											<div
												className='city-card'
												onClick={() => selectCity(item.name)}
											>
												<strong>{item.name}</strong>
												<hr />
												<br />
												<p>Region :{item.region} </p>
												<p>
													Coordinate :{item.lat} {item.lon}
												</p>
											</div>
										</Grid>
									))}
							</Grid>
						)}
					</div>
				</Grid>
			</Grid>
			<ForecastModal />
		</div>
	);
}

Forecast.propTypes = {};

export default Forecast;
