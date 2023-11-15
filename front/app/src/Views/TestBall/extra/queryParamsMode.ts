/* eslint-disable curly */
/* eslint-disable default-case */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

type	GameModModel = {
	mode: string;
	friendId?: string;
};

const getGameMode = (pQuery: object) =>
{
	let		buffer;
	const	gameMode: GameModModel = {
		mode: "classical",
		friendId: undefined
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
		else if (key === "friendId")
		{
			if (value && value.length !== 0)
				gameMode.friendId = value;
			else
			{
				gameMode.mode = "classical";
				gameMode.friendId = undefined;
			}
		}
		else
		{
			gameMode.mode = "classical";
			gameMode.friendId = undefined;
		}
	}
	// if (params.split("=").length !== 2)
	// if (buffer.length === 2)
	// {
	// 	const	param = buffer[1];
	// 	const	splitParam = param.split("=");
	// 	const	value = splitParam[1];
	// 	if (value === "upside-down")
	// 		mode = value;
	// 	else if (value === "friend")
	// 		mode = value;
	// 	else
	// 		mode = "classical";
	// }
	// else
	// 	mode = "classical";
	// return (mode);
	return (gameMode);
};

export default getGameMode;
