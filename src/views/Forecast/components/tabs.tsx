import * as React from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function ForecastTabs({ getTabValue }) {
	const [value, setValue] = React.useState(0);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		getTabValue(newValue);
	};

	return (
		<>
			<Tabs
				value={value}
				onChange={handleChange}
				// textColor='white'
				className='tabsWrapper'
				aria-label='basic tabs example'
			>
				<Tab
					classes={{ root: 'tab' }}
					className='tab'
					label='Temperature'
					{...a11yProps(0)}
				/>
				<Tab className='tab' label='Precipitation' {...a11yProps(1)} />
				<Tab className='tab' label='Wind' {...a11yProps(2)} />
			</Tabs>
			<br />
		</>
	);
}
