import { Test, TestingModule } from "@nestjs/testing";
import { AnonymousUserController } from "./anonymous-user.controller";

describe("AnonymousUserController", () =>
{
  let controller: AnonymousUserController;

  beforeEach(async () =>
  {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymousUserController],
    }).compile();

    controller = module.get<AnonymousUserController>(AnonymousUserController);
  });

  it("should be defined", () =>
  {
    expect(controller).toBeDefined();
  });
});
