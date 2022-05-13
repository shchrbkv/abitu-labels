export const getAbitSample = async function () {
	const request = new Request('/abits', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		},
		mode: 'cors',
	});
	const response = await fetch(request);
	const { data } = await response.json();
	return data;
};

export const updateAbitPriorities = async function (abit) {
	const request = new Request('/abits', {
		method: 'PATCH',
		headers: {
			'Accept': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify(abit),
	});

	const response = await fetch(request);
	return response.json();
};
