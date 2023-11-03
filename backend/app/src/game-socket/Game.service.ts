import {
	Injectable,
	Logger,
	OnModuleInit
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class	GameService implements OnModuleInit
{
	private readonly	logegr = new Logger("instance game service itself");
	private	readonly	instanceId = uuidv4();

	public constructor()
	{
		this.logegr.error("Service constructed with ID: " + this.instanceId);
	}

	onModuleInit()
	{
		// operation  on initialisation of the module.
	}

	public	getInstanceId()
	{
		return (this.instanceId);
	}
}
