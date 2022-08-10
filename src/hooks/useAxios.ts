import { useEffect, useState } from 'react';

import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_WEATHER_BASE_URL;

export const useAxios = (params, dependentParams = '', isCallApi = true) => {
	console.log(isCallApi);
	const [response, setResponse] = useState({
		errorResponse: {},
		successResponse: {},
	});
	const [loading, setLoading] = useState(true);

	const { errorResponse, successResponse } = response;

	const handleResponse = (data, error = false) => {
		setResponse({
			...response,
			...(error ? { errorResponse: data } : { successResponse: data }),
		});
	};

	const getData = async (parameters) => {
		try {
			const result = await axios({
				...parameters,
			});
			handleResponse(result.data);
		} catch (err) {
			handleResponse(err, true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isCallApi) {
			getData(params);
		}
	}, [dependentParams]);

	return { successResponse, errorResponse, loading };
};
