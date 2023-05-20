import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { HashManagerMock } from "../../mocks/HashManegerMock";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Signup tests", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Must generate token when registering", async () => {
    const input = SignupSchema.parse({
      name: "User3",
      email: "user3@email.com",
      password: "user321",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      token: "token-mock",
    });
  });

  test("Must throw error if email already exists", async () => {
    expect.assertions(2);

    try {
      const input = SignupSchema.parse({
        name: "User3",
        email: "user2@email.com",
        password: "user321",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("email already exists");
      }
    }
  });
});
