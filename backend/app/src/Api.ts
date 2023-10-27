
import	axios from "axios";

export default () =>
{
	return (
		axios.create(
		{
			baseURL: "https://api.intra.42.fr/",
			timeout: 10000
		})
	);
};
