/* eslint-disable curly */
/* eslint-disable max-statements */
import * as dotenv from "dotenv";

class	ServerConfig
{
	public readonly		location: string | undefined;
	public readonly		port: string | undefined;
	public readonly		protocol: string | undefined;
	private readonly	env: dotenv.DotenvConfigOutput;
	public serialize: () => string;

	public constructor()
	{
		this.env = dotenv.config();
		this.location = this.env.parsed?.HOST_LOCATION;
		this.port = this.env.parsed?.HOST_PORT;
		this.protocol = this.env.parsed?.HOST_PROTOCOL;
		this.serialize = () =>
		{
			const res = {
				location: this.location,
				port: this.port,
				protocol: this.protocol,
			};
			return (JSON.stringify(res));
		};
	}
}

export default ServerConfig;
