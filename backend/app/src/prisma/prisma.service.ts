import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PrismaService implements OnModuleInit
{
	public	prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
	public	logger: Logger = new Logger("Prisma");
	public	uuid = uuidv4();

	constructor()
	{
		this.prisma = new PrismaClient();
		this.logger.debug("Prisma started with uuid: " + this.uuid);
	}
	async onModuleInit()
	{
	}
}