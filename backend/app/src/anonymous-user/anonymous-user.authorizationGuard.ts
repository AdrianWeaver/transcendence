/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
}	from "@nestjs/common";
import { Observable } from "rxjs";
import { AnonymousUserHeaderDto } from "./anonymous-user.header.dto";
import { AnonymousUserService } from "./anonymous-user.service";

import * as jwt from "jsonwebtoken";
import {
	AnonymousJWTDecoded,
	AnonymousUserModel,
	AuthorizationGuardSignatureModel
} from "./anonymous-user.interface";

@Injectable()
export	class AuthorizationGuard implements CanActivate
{
	constructor(private readonly service: AnonymousUserService)
	{

	}

	private	isValidTokenSignature(token: string, secret: string)
		: AuthorizationGuardSignatureModel
	{
		if (!token)
			return ({validTokenSignature: false});
		const	bearer = token.split("Bearer ");
		let		response: AuthorizationGuardSignatureModel;

		if (bearer.length !== 2)
			return ({validTokenSignature: false});
		try
		{
			const decode = jwt.verify(bearer[1], secret) as AnonymousJWTDecoded;

			response = {
				validTokenSignature: true,
				uuid: decode.uuid,
				isAnonymous: decode.isAnonymous,
				iat: decode.iat,
				exp: decode.exp,
				token: token
			};
			return (response);
		}
		catch (error)
		{
			if (error instanceof jwt.JsonWebTokenError)
			{
				throw new UnauthorizedException();
			}
			return ({validTokenSignature: false});
		}
	}

	// Nominal case this must not have a return value False
	private	isTokenExtractValid(tok: AuthorizationGuardSignatureModel) : boolean
	{
		if (!tok.validTokenSignature
			|| !tok.uuid
			|| !tok.isAnonymous
			|| !tok.iat
			|| !tok.exp
			|| !tok.token)
			return (false);
		return (true);
	}

	private	checkTokenPayloadAuthenticity(
		user: AnonymousUserModel,
		tok: AuthorizationGuardSignatureModel
	)
		: boolean
	{
		if (user.token !== tok.token)
		{
			return (false);
		}
		return (true);
	}

	public	canActivate(context: ExecutionContext)
		: boolean | Promise<boolean> | Observable<boolean>
	{
		const	request = context.switchToHttp().getRequest();
		const	headers: AnonymousUserHeaderDto = request.headers;

		const	secret = this.service.getSecret();

		const token = this.isValidTokenSignature(headers.authorization, secret);
		if (this.isTokenExtractValid(token) === false)
			return (false);

		const	user = this.service.getUserByUuid(token.uuid as string);
		if (!user)
			return (false);
		if (user.revokeConnectionRequest === true)
			return (this.service.userIdentifiedRequestEndOfSession(user.uuid));

		const isValid = this.checkTokenPayloadAuthenticity(user, token);
		request.user = user;
		return (isValid);
	}
}
