import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main()
{
	// cet object est en memoire
	const	user = {
		name: "John Doe",
		email: "johndoe@example.com"
	}

	// Enregistrement d'un nouvel utilisateur dans la base de donnee
	const newUser = await prisma.user.create(
	{
		data:
		{
			name: user.name,
			email: user.email,
		},
	})

	console.log(newUser)
}

main()
	.catch(e =>
	{
		throw e;
	})
	.finally(async () =>
	{
		await prisma.$disconnect();
	});