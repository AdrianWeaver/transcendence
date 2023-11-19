/* eslint-disable curly */
/* eslint-disable default-case */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

type	GameModModel = {
	mode: string;
	uuid?: string;
};

const getGameMode = (pQuery: object) =>
{
	let		buffer;
	const	gameMode: GameModModel = {
		mode: "classical",
		uuid: undefined
	};
	const	query = pQuery as Location;
	const	search = query.search;
	buffer = search.split("?");
	if (buffer.length === 1)
		return (gameMode);
	buffer = buffer[1];
	const	params = buffer.split("&");
	for (const param of params)
	{
		const	splitParam = param.split("=");
		const	key = splitParam[0];
		const	value = splitParam[1];
		if (key === "mode")
		{
			switch (value)
			{
				case "classical":
				case "upside-down":
				case "friend":
					gameMode.mode = value;
					break ;
				default:
					gameMode.mode = "classical";
					break ;
			}
		}
		else if (key === "uuid")
		{
			if (value && value.length !== 0)
				gameMode.uuid = value;
			else
			{
				gameMode.mode = "classical";
				gameMode.uuid = undefined;
			}
		}
		else
		{
			gameMode.mode = "classical";
			gameMode.uuid = undefined;
		}
	}
	return (gameMode);
};

export default getGameMode;
