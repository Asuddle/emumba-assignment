import React from 'react';

function DayForecastCard({ data, degree }) {
	const weekDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const { condition, maxtemp_c, mintemp_c, maxtemp_f, mintemp_f } = data.day;
	return (
		<div className='dayForecastCard'>
			<h3>{weekDays[new Date(data.date).getDay()]}</h3>
			<img src={condition.icon} alt='icon' />
			<p>{condition.text}</p>
			{degree === 'C' ? (
				<h3>
					{maxtemp_c}&deg; - {mintemp_c}&deg;
				</h3>
			) : (
				<h3>
					{maxtemp_f}&deg; - {mintemp_f}&deg;
				</h3>
			)}
		</div>
	);
}

DayForecastCard.propTypes = {};

export default DayForecastCard;
