import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { HashManagerMock } from "../../mocks/HashManegerMock";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";

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

  test("Must return error when email not found", async () => {
    expect.assertions(2);

    try {
      const input = LoginSchema.parse({
        email: "user99@email.com",
        password: "user123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("email or password invalid");
      }
    }
  });

  test("Must return error if password is incorrect",async () => {
    expect.assertions(2)

    try {
      const input = LoginSchema.parse({
        email: "user@email.com",
        password: "incorrect-password",
      });
  
      const output = await userBusiness.login(input);
  
    } catch (error) {
      if(error instanceof BadRequestError){
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe("email or password invalid")
      }
    }
  })
});
