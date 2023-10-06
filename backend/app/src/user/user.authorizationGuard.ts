/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException
}	from "@nestjs/common";
import { Observable } from "rxjs";
import { UserHeaderDto } from "./user.header.dto";
import { UserService } from "./user.service";

import * as jwt from "jsonwebtoken";
import {
	JWTDecoded,
	UserModel,
	UserAuthorizationGuardSignatureModel
} from "./user.interface";

@Injectable()
export	class UserAuthorizationGuard implements CanActivate
{
	private readonly logger = new Logger("User-Auth-guard");
	constructor(private readonly service: UserService)
	{
		this.logger.log("UserAuthorizationGuard instance created with instance id : " + this.service.getUuidInstance());
	}

	private	isValidTokenSignature(token: string, secret: string)
		: UserAuthorizationGuardSignatureModel
	{
		if (!token)
			return ({validTokenSignature: false});
		const	bearer = token.split("Bearer ");
		let		response: UserAuthorizationGuardSignatureModel;

		// Must be length === 2
		// console.log("Bearer splitting length : ", bearer.length);
		// Put Logger here
		if (bearer.length !== 2)
			return ({validTokenSignature: false});
		try
		{
			const decode = jwt.verify(bearer[1], secret) as JWTDecoded;

			response = {
				validTokenSignature: true,
				id: decode.id,
				email: decode.email,
				iat: decode.iat,
				exp: decode.exp,
				token: token
			};
			// console.log("Valid Signature :", response);
			return (response);
		}
		catch (error)
		{
			if (error instanceof jwt.JsonWebTokenError)
			{
				console.log("User has tried to use a wrong token signature");
				throw new UnauthorizedException();
			}
			console.log("Error on Anonymous isValidTokenSignature : ", error);
			return ({validTokenSignature: false});
		}
	}

	// Nominal case this must not have a return value False
	private	isTokenExtractValid(
		tok: UserAuthorizationGuardSignatureModel)
		: boolean
	{
		if (!tok.validTokenSignature
			|| !tok.id
			|| !tok.email
			|| !tok.iat
			|| !tok.exp
			|| !tok.token)
			return (false);
		return (true);
	}

	private	checkTokenPayloadAuthenticity(
		user: UserModel,
		tok: UserAuthorizationGuardSignatureModel
	)
		: boolean
	{
		if (user.authService.token !== tok.token)
		{
			console.log("token mismatch", user.authService.token, tok.token);
			return (false);
		}
		return (true);
	}

	public	canActivate(context: ExecutionContext)
		: boolean | Promise<boolean> | Observable<boolean>
	{
		const	request = context.switchToHttp().getRequest();
		const	headers: UserHeaderDto = request.headers;

		const	secret = this.service.getSecret();

		const token = this.isValidTokenSignature(headers.authorization, secret);
		if (this.isTokenExtractValid(token) === false)
			return (false);

		const	user = this.service.getUserById(token.id as string);
		if (!user)
			return (false);
		if (user.revokedConnectionRequest === true)
			return (this.service.userIdentifiedRequestEndOfSession(user.id));

		const isValid = this.checkTokenPayloadAuthenticity(user, token);
		request.user = user;
		return (isValid);
	}
}
