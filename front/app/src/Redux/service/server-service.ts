import Api from "../store/Api";

const	ServerService = {
	async getConnection()
	{
		return (
			Api()
				.get("")
				.then((res) =>
				{
					return (
					{
						...res.data,
						success: true
					});
				})
				.catch((error) =>
				{
					return (
					{
						success: false,
						errorMessage: "Server not available",
						fullError: {...error}
					});
				})
		);
	},
};

export default ServerService;
