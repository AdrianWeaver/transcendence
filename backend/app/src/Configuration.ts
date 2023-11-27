/* eslint-disable max-lines-per-function */
/* eslint-disable curly */
/* eslint-disable max-statements */
import	* as dotenv from "dotenv";

export type TokenModel = {
	key: string;
	value: string;
}

class Configuration
{
	private				validConfiguration: boolean;
	private 			env: dotenv.DotenvConfigOutput | null;

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

	private				ftAuthUrl: string;

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

		// set as default
		this.ftAuthUrl = "";
	}

	public isValidConfiguration()
	{
		if (this.twillioSID === undefined
			|| this.twillioAuthToken === undefined
			|| this.twillioVerifySID === undefined
			|| this.myNumber === undefined
			|| this.ftSecret === undefined
			|| this.ftUid === undefined
			|| this.ftDomain === undefined
			|| this.ftProtocol === undefined
			|| this.ftRoute === undefined
			|| this.redirectProtocol === undefined
			|| this.redirectDomain === undefined
			|| this.redirectPort === undefined
			|| this.backProtocol === undefined
			|| this.backDomain === undefined
			|| this.backPort === undefined
			|| this.pgDb === undefined
			|| this.pgUser === undefined
			|| this.pgPassword === undefined
			|| this.pgURL === undefined)
		{
			this.validConfiguration = false;
			const printObj = {...this};
			printObj.env = null;
			console.error(printObj);
		}
		else
			this.validConfiguration = true;
		// console.info(this);
		return (this.validConfiguration);
	}

	private generateFull()
		: string
	{
		const	paramsArray: Array<TokenModel> = [];
		let		strUrl: string;
		const	params: TokenModel = {
			key: "client_id",
			value: encodeURIComponent(this.ftUid as string)
		};
		paramsArray.push({...params});
		params.key = "redirect_uri";
		params.value = encodeURIComponent(
			this.redirectProtocol + "://"
			+ this.redirectDomain + ":" + this.redirectPort
		);
		paramsArray.push({...params});
		params.key = "response_type";
		params.value = "code";
		paramsArray.push({...params});
		strUrl = this.ftProtocol + "://" + this.ftDomain + this.ftRoute;
		paramsArray.forEach((elem, index) =>
		{
			if (index === 0)
				strUrl += "?";
			else
				strUrl += "&";
			strUrl += elem.key + "=" + elem.value;
		});
		this.ftAuthUrl = strUrl;
		return (strUrl);
	}

	public	getFtAuthURL()
	{
		if (this.ftAuthUrl !== "")
			return (this.ftAuthUrl);
		this.isValidConfiguration();
		if (!this.validConfiguration)
			return ("");
		this.generateFull();
		return (this.ftAuthUrl);
	}

	public	getRedirectURI()
	{
		return (this.redirectProtocol
			+ "://"
			+ this.redirectDomain
			+ ":"
			+ this.redirectPort);
	}
}

export default Configuration;
