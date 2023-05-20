import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { TokenPayload, User, USER_ROLES } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (userDBExists) {
      throw new ConflictError("email already exists");
    }

    const id = this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      token,
    };

    return output;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (!userDBExists) {
      throw new BadRequestError("email or password invalid");
    }

    const user = new User(
      userDBExists.id,
      userDBExists.name,
      userDBExists.email,
      userDBExists.password,
      userDBExists.role,
      userDBExists.created_at
    );

    const hashedPassword = await this.hashManager.compare(
      password,
      userDBExists.password
    );
    console.log(password,userDBExists.password)
    console.log(hashedPassword)
    if (!hashedPassword) {
      throw new BadRequestError("email or password invalid");
    }

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: LoginOutputDTO = {
      token,
    };

    return output;
  };
}
