/* eslint-disable max-statements */
import {
	Injectable,
	Logger,
	OnModuleInit
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import GameServe from "./Objects/GameServe";

@Injectable()
export class	GameService implements OnModuleInit
{
	private readonly	logger = new Logger("instance game service itself");
	private	readonly	instanceId = uuidv4();

	public				users			: number;
	public				totalUsers		: number;
	public				classicUsers	: number;
	public				specialUsers	: number;
	public				socketIdUsers	: Array<string>;
	public				userReady		: number;
	public				socketIdReady	: Array<string>;
	public				gameInstances	: Array<GameServe>;

	public constructor()
	{
		this.logger.error("Service constructed with ID: " + this.instanceId);
		this.users = 0;
		this.totalUsers = 0;

		this.classicUsers = 0;
		this.specialUsers = 0;

		this.socketIdUsers = [];
		this.userReady = 0;
		this.socketIdReady = [];
		this.gameInstances = [];
	}

	onModuleInit()
	{
		// operation  on initialisation of the module.
	}

	public	getInstanceId()
	{
		return (this.instanceId);
	}

	public getGameServiceCopy()
	{
		this.logger.verbose("getting data ");
		const gameInstanceSerialized = this.gameInstances.map((elem) =>
		{
			return (elem.getSeralizable());
		});
		console.log("Serialized data : ", gameInstanceSerialized);
		return ({
			instanceId: this.instanceId,
			users: this.users,
			totalUsers: this.totalUsers,
			classicUsers: this.classicUsers,
			specialUsers: this.specialUsers,
			socketIdUsers: this.socketIdUsers,
			userReady: this.userReady,
			socketIdReady: this.socketIdReady,
			gameInstances: gameInstanceSerialized,
		});
	}

	// getter and setter
	public	setUsers(users: number)
	{
		this.users = users;
	}
	public	getUsers()
	{
		return (this.users);
	}
	public	increaseUsers()
	{
		this.users += 1;
	}
	public	decreaseUsers()
	{
		this.users -= 1;
	}

	public	setTotalUsers(totalUsers: number)
	{
		this.totalUsers = totalUsers;
	}
	public	getTotalUsers()
	{
		return (this.totalUsers);
	}
	public	increaseTotalUsers()
	{
		this.totalUsers += 1;
	}
	public	decreaseTotalUsers()
	{
		this.totalUsers -= 1;
	}

	public	findSocketIdUserByClientId(clientId: string)
	{
		const	searchUser = this.socketIdUsers.find((elem) =>
		{
			return (elem === clientId);
		});
		return (searchUser);
	}
	public	findIndexSocketIdUserByClientId(clientId: string)
	{
		const	searchIndex = this.socketIdUsers.findIndex((elem) =>
		{
			return (elem === clientId);
		});
		return (searchIndex);
	}

	public	pushClientIdIntoSocketIdUsers(clientId: string)
	{
		this.socketIdUsers.push(clientId);
	}
	public	removeOneSocketIdUserWithIndex(indexToRemove: number)
	{
		this.socketIdUsers.splice(indexToRemove, 1);
	}

	public	setUserReadyNumber(value: number)
	{
		this.userReady = value;
	}
	public	getUserReadyNumber()
	{
		return (this.userReady);
	}
	public	increaseUserReadyNumber()
	{
		this.userReady += 1;
	}
	public	decreaseUserReadyNumber()
	{
		this.userReady -= 1;
	}

	public	findSocketIdReadyWithSocketId(clientId: string)
	{
		const elem = this.socketIdReady.find((element) =>
		{
			return (element === clientId);
		});
		return (elem);
	}

	public	findIndexSocketIdReadyWithSocketId(clientId: string)
	{
		const	index = this.socketIdReady.findIndex((element) =>
		{
			return (element === clientId);
		});
		return (index);
	}
	public	removeOneSocketIdReadyWithIndex(index: number)
	{
		this.socketIdReady.splice(index, 1);
	}
	public	pushClientIdIntoSocketIdReady(clientId: string)
	{
		this.socketIdReady.push(clientId);
	}

	public	pushGameServeToGameInstance(roomInstance: GameServe)
	{
		this.gameInstances.push(roomInstance);
	}
	public	getGameInstances()
	{
		return (this.gameInstances);
	}
}
