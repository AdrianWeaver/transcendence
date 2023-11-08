const getGameMode = (query: any) =>
{
    let mode: string;
    const	search = query.search;
	const	buffer = search.split("?");
	if (buffer.length === 2)
	{
		const	param = buffer[1];
		const	splitParam = param.split("=");
		const	value = splitParam[1];
		if (value === "upside-down")
			mode = value;
		else
			mode = "classical";
	}
	else
		mode = "classical";
    return (mode);
};

export default getGameMode;