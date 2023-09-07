
import { ApiProperty } from "@nestjs/swagger";

export class AnonymousUserHeaderDto
{
	@ApiProperty()
	readonly authorization: string;
}
