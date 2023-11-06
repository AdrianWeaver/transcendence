/* eslint-disable max-statements */
import {
	Injectable,
	Logger,
	OnModuleInit
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import GameServe from "./Objects/GameServe";

type	MapSocketIdProfileId = {
	socketId: string
	profileId: string
};

@Injectable()
export class	GameService implements OnModuleInit
{
	private readonly	logger = new Logger("instance game service itself");
	private	readonly	instanceId = uuidv4();

	public				roomCount		: number;
	public				users			: number;
	public				totalUsers		: number;
	public				classicUsers	: number;
	public				specialUsers	: number;
	public				socketIdUsers	: Array<MapSocketIdProfileId>;
	public				userReady		: number;
	public				socketIdReady	: Array<MapSocketIdProfileId>;
	public				gameInstances	: Array<GameServe>;

	public constructor()
	{
		this.logger.error("Service constructed with ID: " + this.instanceId);
		this.roomCount = 0;
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
			roomCount: this.roomCount,
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

	public	increaseRoomCount()
	{
		this.roomCount += 1;
	}
	public	getRoomCount()
	{
		return (this.roomCount);
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
			return (elem.socketId === clientId);
		});
		return (searchUser);
	}
	public	findIndexSocketIdUserByClientId(clientId: string)
	{
		const	searchIndex = this.socketIdUsers.findIndex((elem) =>
		{
			return (elem.socketId === clientId);
		});
		return (searchIndex);
	}
	public findIndexSocketIdUserByProfileId(profileId: string)
	{
		return (
			this.socketIdUsers.findIndex((elem) =>
			{
				return (elem.profileId === profileId);
			})
		);
	}

	public	pushClientIdIntoSocketIdUsers(clientId: string, profileId: string)
	{
		const tmp: MapSocketIdProfileId = {
			socketId: clientId,
			profileId: profileId
		};
		this.socketIdUsers.push(tmp);
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
			return (element.socketId === clientId);
		});
		return (elem);
	}

	public	findIndexSocketIdReadyWithSocketId(clientId: string)
	{
		const	index = this.socketIdReady.findIndex((element) =>
		{
			return (element.socketId === clientId);
		});
		return (index);
	}
	public	removeOneSocketIdReadyWithIndex(index: number)
	{
		this.socketIdReady.splice(index, 1);
	}
	public	pushClientIdIntoSocketIdReady(clientId: string, profileId: string)
	{
		const	tmp: MapSocketIdProfileId = {
			profileId: profileId,
			socketId: clientId,
		};
		this.socketIdReady.push(tmp);
	}

	public	pushGameServeToGameInstance(roomInstance: GameServe)
	{
		this.gameInstances.push(roomInstance);
	}
	public	getGameInstances()
	{
		return (this.gameInstances);
	}
	public	findIndexGameInstanceByRoomName(roomName: string)
	{
		return (
			this.gameInstances.findIndex((elem) =>
			{
				return (elem.roomName === roomName);
			})
		);
	}

	public	setGameActiveToFalse(indexInstance: number)
	{
		if (indexInstance !== -1 || indexInstance !== undefined)
		{
			const instance = this.gameInstances[indexInstance];
			if (instance && instance.loop)
				instance.loop.gameActive = false;
			this.gameInstances[indexInstance] = instance;
		}
	}

	public	findIndexGameInstanceWithClientId(clientId: string)
	{
		const	index = this.gameInstances.findIndex((instance) =>
		{
			return (
				instance.loop
				&& (instance.playerOne.socketId === clientId
				|| instance.playerTwo.socketId === clientId)
			);
		});
		return (index);
	}

	public	findGameInstanceWithClientId(clientId: string)
	{
		return (
			this.gameInstances.find((instance) =>
			{
				return (
					instance.playerOne.socketId === clientId
					|| instance.playerTwo.socketId === clientId
				);
			})
		);
	}

	public	findProfileIdFromSocketId(clientId: string)
	{
		return (
			this.socketIdUsers.find((elem) =>
			{
				return (elem.socketId === clientId);
			})
		);
	}

	public	isProfileIdUserOne(idGameInstance: number, profileId: string)
	{
		if (idGameInstance === -1)
			return (false);
		return (
			this.gameInstances[idGameInstance]
				.playerOne.profileId === profileId
		);
	}

	public	isProfileIdUserTwo(idGameInstance: number, profileId: string)
	{
		if (idGameInstance === -1)
			return (false);
		return (
			this.gameInstances[idGameInstance]
				.playerTwo.profileId === profileId
		);
	}

	// ONLY WITH PLAYER TWO
	public	findIndexGameInstanceAlonePlayer()
	{
		return (
			this.gameInstances.findIndex((instance) =>
			{
				return (instance.playerTwo.profileId === "undefined");
			})
		);
	}
}
