/* eslint-disable max-statements */

const	strToPascalCase = (str: string) =>
{
	let	res: string;

	const	array = str.toLowerCase().split(" ");
	res = "";
	for (let id = 0; id < array.length; id++)
	{
		const elem = array[id];

		res += elem[0].toUpperCase() + elem.substring(1);
		if (id !== (array.length - 1))
			res += " ";
	}
	return (res);
};

export default strToPascalCase;
