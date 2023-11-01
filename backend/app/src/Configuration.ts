/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */
import	* as dotenv from "dotenv";

class Configuration
{
	private				validConfiguration: boolean;
	private readonly	env: dotenv.DotenvConfigOutput;

	private	readonly	twillioSID: string | undefined;
	private readonly	twillioAuthToken: string | undefined;
	private readonly	twillioVerifySID: string | undefined;
	private	readonly	myNumber: string | undefined;

	// for the call of the api, this is Qparams 
	private	readonly	ftSecret: string | undefined;
	private	readonly	ftUid: string | undefined;

	// for the call of the api
	private	readonly	ftDomain: string | undefined;
	private readonly	ftProtocol: string | undefined;
	private readonly	ftRoute: string | undefined;

	// for the redirecttion // also the front 
	private readonly	redirectProtocol: string | undefined;
	private readonly	redirectDomain: string | undefined;
	private	readonly	redirectPort: string;

	private	readonly	backDomain: string | undefined;
	private readonly	backProtocol: string | undefined;
	private readonly	backPort: string | undefined;

	private readonly	pgUser: string | undefined;
	private readonly	pgPassword: string | undefined;
	private readonly	pgDb: string | undefined;
	private readonly	pgURL: string | undefined;

	constructor()
	{
		this.validConfiguration = false;
		this.env = dotenv.config();

		if (this.env.parsed === undefined)
		{
			console.error("Env is not provided !");
			return ;
		}
		// e is just a shortcut to env.parsed
		const e = this.env.parsed;
		this.twillioSID = e.TWILIO_ACCOUNT_SID;
		this.twillioAuthToken = e.TWILIO_AUTH_TOKEN;
		this.twillioVerifySID = e.TWILIO_VERIFY_SERVICE_SID;
		this.myNumber = e.MY_NUMBER;

		this.ftSecret = e.FT_SECRET;
		this.ftUid = e.FT_UID;

		this.ftDomain = e.FT_DOMAIN;
		this.ftProtocol = e.FT_PROTOCOL;
		this.ftRoute = e.FT_ROUTE;

		this.redirectProtocol = e.REDIRECT_PROTOCOL;
		this.redirectDomain = e.REDIRECT_DOMAIN;

		this.redirectPort = e.REDIRECT_PORT;

		this.backDomain = e.HOST_LOCATION;
		this.backProtocol = e.HOST_PROTOCOL;
		this.backPort = e.HOST_PORT;

		this.pgDb = e.POSTGRES_DB;
		this.pgUser = e.POSTGRES_USER;
		this.pgPassword = e.POSTGRES_PASSWORD;
		this.pgURL = e.DATABASE_URL;
		console.log(this);
	}

	public isValidConfiguration()
	{
		return (this.validConfiguration);
	}
}

export default Configuration;
