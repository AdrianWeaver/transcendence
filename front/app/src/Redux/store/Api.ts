import	axios from "axios";

export default (serverLocation: string) =>
{
	return (
		axios.create(
		{
			baseURL: "http://" + serverLocation +":3000",
			timeout: 0
		})
	);
};
