/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

type	linkIntraModel = {
	message?: string,
	error?: string,
	code?: string,
	errorDescription?: string,
	redirected?: boolean
};

export const	checkQueryParams = (pQuery : object) =>
{
	let		buffer;
	let		error;
	let		message: linkIntraModel;

	const	query = pQuery as Location;

	message = {};
	message.redirected = true;
	const	search = query.search;
	buffer = search.split("?");
	if (buffer.length === 1)
	{
		console.log("no response - not clicked yet");
		return (
			{
				message:
				"Veuillez cliquer sur la carte ci dessus"
					+ ", vous allez etres redirige"
					+ " sur la page de connexion a l'intra 42"
			});
	}
	buffer = buffer[1];
	const	params = buffer.split("&");
	if (params.length === 2)
	{
		console.log("response error append", params);
		if (params[0].split("=").length !== 2)
			error = {error: "malformed_query"};
		else
			error = {error: params[0].split("=")[1]};
		if (params[1].split("=").length !== 2)
			console.log("malformed");
		else
			error = {
				...error,
				errorDescription: params[1].split("=")[1].split("+").join(" ")
			};
		console.log("Results error", error);
		return (error);
	}
	else if (params.length === 1)
	{
		console.log("Code is provied");
		if (params[0].split("=").length !== 2)
			message = {error: "malformed_query"};
		else
			message = { code: params[0].split("=")[1]};
		console.log("Response parsed ", message);
		return (message);
	}
	else
	{
		console.log("Something went wrong");
		return ({
			error: "malformed_query",
		});
	}
};
