import { CircularProgress, Dialog, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ChevronDown } from '../icons/ChevronDown.svg';
import { ReactComponent as ChevronUp } from '../icons/ChevronUp.svg';
import DayForecastCard from './dayForecastCard';
import ForecastGraph from './graph';
import ForecastTabs from './tabs';
import { RootState } from '../../../store';
import { handleForecast } from '../forecastSlice';
import { useAxios } from '../../../hooks/useAxios';

interface DayForecastInterface {
	condition: { icon: string; text: string };
	maxtemp_c: string;
	mintemp_c: string;
	maxtemp_f: string;
	mintemp_f: string;
}
interface ForecastInterface {
	forecastday: [
		{
			hour: '';
			condition: { icon: string; text: string };
			maxtemp_c: string;
			mintemp_c: string;
			maxtemp_f: string;
			mintemp_f: string;
		},
	];
}
interface LocationInterface {
	name: string;
	region: string;
	localtime: string;
}
interface CurrentInterface {
	maxtemp_c: string;
	mintemp_c: string;
	maxtemp_f: string;
	condition: { icon: string; text: string };
	mintemp_f: string;
	humidity: string;
	precip_in: string;
	wind_kph: string;
	temp_f: string;
	temp_c: string;
}

function ForecastModal() {
	const [degree, setDegree] = useState('C');
	const [tabValue, setTabValue] = useState(0);
	const [expanded, setExpanded] = useState(false);
	const { dialog, city } = useSelector((item: RootState) => item.forecast);
	const dispatch = useDispatch();

	const handleForecastClose = () => {
		dispatch(handleForecast(''));
		setDegree('C');
		setTabValue(0);
	};

	const apiZipCodeData = {
		url: '/forecast.json',
		params: { key: '4ce7481ec118414a81b135806222806', days: 10, q: city },
	};

	const {
		successResponse,
	}: {
		successResponse: any;
		loading: boolean;
		errorResponse: {};
	} = useAxios(apiZipCodeData, city, city !== '');

	const current: CurrentInterface = successResponse.current;
	const location: LocationInterface = successResponse.location;
	const forecast: ForecastInterface = successResponse.forecast;

	const handleDegree = (value: string) => {
		setDegree(value);
	};
	const handleTabsValue = (value: number) => {
		setTabValue(value);
	};
	const handleExpanded = () => {
		setExpanded(!expanded);
	};
	const getOptions = () => {
		if (tabValue === 0) {
			if (degree === 'C') {
				return 'temp_c';
			}
			return 'temp_f';
		} else if (tabValue === 1) {
			return 'humidity';
		} else {
			return 'wind_kph';
		}
	};
	return (
		<div>
			{dialog && (
				<Dialog
					fullWidth
					scroll='body'
					maxWidth='lg'
					open={dialog}
					onClose={handleForecastClose}
					aria-labelledby='alert-dialog-title'
					classes={{
						paper: 'forecast-dialog',
					}}
					aria-describedby='alert-dialog-description'
				>
					<div className='internal-wrapper'>
						{Object.keys(successResponse).length > 0 ? (
							<Grid container spacing={3}>
								<Grid
									item
									alignItems='center'
									className='temperatureDegreeWrapper'
								>
									<img src={current.condition.icon} height={110} alt='icon' />
									<p className='temperature'>
										{degree === 'C' && current.temp_c}
										{degree === 'F' && current.temp_f}
									</p>
									<p className='degree'>
										<span
											onClick={() => handleDegree('C')}
											className={degree === 'C' ? 'selectedDegree' : ''}
										>
											&deg;C{' '}
										</span>
										|
										<span
											onClick={() => handleDegree('F')}
											className={degree === 'F' ? 'selectedDegree' : ''}
										>
											&deg;F{' '}
										</span>
									</p>
								</Grid>
								<Grid
									item
									alignItems='center'
									className='weather-vitals-wrapper'
								>
									{expanded && (
										<div className='weather-details'>
											<p>Precipitation : {current.precip_in} </p>
											<p>Humidity : {current.humidity}</p>
											<p>Wind : {current.wind_kph} km/h</p>
										</div>
									)}
								</Grid>
								<Grid
									item
									alignItems='center'
									className='weather-details-wrapper'
								>
									<div className='weather-details'>
										<h3>
											{location.name} ,{location.region}
										</h3>
										<p>{location.localtime}</p>
										<p>{current.condition.text}</p>
									</div>

									{!expanded && (
										<ChevronDown className='chevron' onClick={handleExpanded} />
									)}
									{expanded && (
										<ChevronUp className='chevron' onClick={handleExpanded} />
									)}
								</Grid>
								{expanded && (
									<>
										<div className='lineBreak'></div>
										<Grid item>
											<div className='lineBreak'></div>
											<ForecastTabs getTabValue={handleTabsValue} />
										</Grid>
										<Grid item xs={12} className='graph-wrapper'>
											<ForecastGraph
												data={forecast.forecastday[0].hour}
												currentTime={location.localtime}
												option={getOptions()}
											/>
										</Grid>
										{forecast.forecastday.map((item: DayForecastInterface) => (
											<Grid item xs={12} sm={4} md={4} key={item.maxtemp_c}>
												<DayForecastCard data={item} degree={degree} />
											</Grid>
										))}
									</>
								)}
							</Grid>
						) : (
							<CircularProgress />
						)}
					</div>
				</Dialog>
			)}
		</div>
	);
}

ForecastModal.propTypes = {};

export default ForecastModal;
