import { USER_ROLES, UserDB } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-normal",
    name: "User",
    email: "user@email.com",
    password: "hash-mock-user", // password = "user123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL,
  },
  {
    id: "id-mock-admin",
    name: "Admin",
    email: "admin@email.com",
    password: "hash-mock-admin", // password = "admin000"
    created_at: new Date().toISOString(),
    role: USER_ROLES.ADMIN,
  },
];

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public insertUser = async (newUser: UserDB): Promise<void> => {};

  public findUserByEmail = async (
    email: string
  ): Promise<UserDB | undefined> => {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ email });

    return userDB;
  };
}
