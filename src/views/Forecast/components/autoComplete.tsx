import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

import React from 'react';
import { useAxios } from '../../../hooks/useAxios';

interface ZipCodeInterface {
	zip_code: string;
}

interface SelectedOptionInterface {
	zip_code: string;
}

export default function AutocompleteComponent({ getZipCode }) {
	const [options, setOptions] = React.useState([]);
	const [value, setValue] = React.useState(null);
	const apiData = {
		url: 'https://raw.githubusercontent.com/millbj92/US-Zip-Codes-JSON/master/USCities.json',
	};
	const {
		successResponse,
		loading,
	}: { successResponse: any; loading: boolean; errorResponse: {} } =
		useAxios(apiData);

	function renderRow(props: ListChildComponentProps) {
		const { data, index, style } = props;
		const dataSet = data[index];
		const inlineStyle = {
			...style,
			top: (style.top as number) + 8,
		};
		return (
			<div component='li' {...dataSet[0]} style={inlineStyle}>
				{dataSet[1].zip_code} ({dataSet[1].city})
			</div>
		);
	}

	const OuterElementContext = React.createContext({});

	const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
		const outerProps = React.useContext(OuterElementContext);
		return <div ref={ref} {...props} {...outerProps} />;
	});

	function useResetCache(data: any) {
		const ref = React.useRef<VariableSizeList>(null);
		React.useEffect(() => {
			if (ref.current != null) {
				ref.current.resetAfterIndex(0, true);
			}
		}, [data]);
		return ref;
	}

	// Adapter for react-window
	const ListboxComponent = React.forwardRef<
		HTMLDivElement,
		React.HTMLAttributes<HTMLElement>
	>(function ListboxComponent(props, ref) {
		const { children, ...other } = props;
		const itemData: React.ReactChild[] = [];
		(children as React.ReactChild[]).forEach(
			(item: React.ReactChild & { children?: React.ReactChild[] }) => {
				itemData.push(item);
				itemData.push(...(item.children || []));
			},
		);

		const itemCount = itemData.length;

		const gridRef = useResetCache(itemCount);

		return (
			<div ref={ref} className='virtualize-list'>
				<OuterElementContext.Provider value={other}>
					<VariableSizeList
						itemData={itemData}
						height={250}
						width={300}
						ref={gridRef}
						outerElementType={OuterElementType}
						innerElementType='ul'
						itemSize={(item) => 36}
						overscanCount={5}
						itemCount={itemCount}
					>
						{renderRow}
					</VariableSizeList>
				</OuterElementContext.Provider>
			</div>
		);
	});

	const handleChange = (e) => {
		let input = e.target.value;
		setTimeout(() => {
			if (input === '') {
				setOptions([]);
			} else {
				const selectedOption: SelectedOptionInterface[] =
					successResponse.filter((item: ZipCodeInterface) =>
						(item.zip_code + '').includes(input),
					);
				setOptions([...selectedOption]);
			}
		}, 300);
	};

	const handleAutoCompleteChange = (_event, _newInputValue, reason) => {
		if (reason === 'clear') {
			setOptions([]);
			return;
		}
	};

	const handleSelect = (_event, val) => {
		if (val) {
			let zipCode = val.zip_code + '';
			if (zipCode.length < 5) {
				while (zipCode.length < 5) {
					zipCode = `0${zipCode}`;
				}
			}
			setValue(val);
			getZipCode(zipCode);
		} else {
			setValue(null);
		}
	};

	return (
		<div>
			{loading ? (
				<CircularProgress />
			) : (
				<Autocomplete
					id='virtualize-demo'
					size='small'
					disableListWrap
					value={value}
					getOptionLabel={(option: any) =>
						option ? option.zip_code.toString() : ''
					}
					ListboxComponent={ListboxComponent}
					options={options}
					loading={loading}
					onChange={handleSelect}
					onInputChange={handleAutoCompleteChange}
					renderOption={(props, option) => [props, option] as React.ReactNode}
					renderInput={(params) => (
						<TextField
							{...params}
							fullWidth={false}
							onChange={handleChange}
							style={{ minWidth: '300px' }}
							inputProps={{
								...params.inputProps,
								maxLength: 5,
							}}
							variant='outlined'
							label='Zip Code'
						/>
					)}
				/>
			)}
		</div>
	);
}
