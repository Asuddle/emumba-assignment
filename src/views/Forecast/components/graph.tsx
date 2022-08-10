import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import React from 'react';

function ForecastGraph({ data, currentTime, option = 'temp_c' }) {
	const dateTimes: string[] = [];
	const temperature: number[] = [];
	console.log('data', data);
	data.forEach((item, idx) => {
		if (
			!(idx % 2 === 0) &&
			new Date(currentTime).getTime() < new Date(item.time).getTime()
		) {
			dateTimes.push(item.time);
			temperature.push(item[option]);
		}
	});
	const apexOption: ApexOptions = {
		chart: {
			foreColor: '#ffffff',
			toolbar: {
				show: false,
			},
		},
		dataLabels: {
			enabled: true,
			textAnchor: 'start',
			// formatter: function (val) {
			// 	return val;
			// },
			style: {
				fontSize: '14px',
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontWeight: 'bold',
				colors: ['#fff'],
			},
			background: {
				enabled: false,
				foreColor: '#fff',
				padding: 4,
				borderRadius: 2,
				borderWidth: 1,
				borderColor: '#fff',
				opacity: 0.9,
				dropShadow: {
					enabled: false,
					top: 1,
					left: 1,
					blur: 1,
					color: '#000',
					opacity: 0.45,
				},
			},
			offsetX: 0,
			dropShadow: {
				enabled: true,
			},
		},
		grid: {
			xaxis: {
				// labels: {
				// 	format: 'dd/MM',
				// },
				lines: {
					show: false,
				},
			},
		},
		colors: [
			'#1976d2',
			// ',#FFFF00'
		],
		xaxis: {
			type: 'datetime',
			categories: dateTimes,
		},
		yaxis: {
			show: false,
			labels: {
				show: false,
			},
		},
	};

	const series: ApexAxisChartSeries = [
		{
			name: 'series1',
			data: temperature,
		},
	];

	return (
		<div>
			<Chart options={apexOption} series={series} type='area' height={150} />
		</div>
	);
}

ForecastGraph.propTypes = {};

export default ForecastGraph;
