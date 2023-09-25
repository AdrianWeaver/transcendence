import {
	Injectable
}	from "@nestjs/common";

@Injectable()
export	class ChatService
{
	// data here 
	private	test: string;

	constructor()
	{
		this.test = "	Hello World";
	}

	public	getTest(): string
	{
		return (this.test)
	}
}
