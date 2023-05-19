import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManegerMock";
import { HashManagerMock } from "../../mocks/HashManegerMock";
import { LoginSchema } from "../../../src/dtos/user/login.dto";

describe("Login tests", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Must generate token upon login", async () => {
    const input = LoginSchema.parse({
      email: "user@email.com",
      password: "user123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-normal",
    });
  });
});