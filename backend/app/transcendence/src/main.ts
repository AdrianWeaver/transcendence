import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap()
{
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}

bootstrap();

/**
 * Usefull documentation I've found here 
 * https://www.thisdot.co/blog/introduction-to-restful-apis-with-nestjs/
 */
