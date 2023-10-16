/* eslint-disable max-len */
import	axios from "axios";

export default () =>
{
	return (
		axios.create(
		{
			baseURL: "https://verify.twilio.com/v2/Services/VA96f27d7513b90f3f54774bfde0efd889/Verifications",
			timeout: 1000
		})
	);
};
