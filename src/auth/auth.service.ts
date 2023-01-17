import { HttpException, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import TokenPayload from "./tokenPayload.interface";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import User from "src/users/user.entity";
import { UserDto } from "src/users/dto/user.module.dto";


export class AuthenticationService {
  jwtService: any;
  configService: any;
  constructor(
    private readonly usersService: UsersService
  ) {}

  public async register(registrationData: UserDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
      const createdUser = this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      User.password = undefined;
      console.log(createdUser);
      return createdUser;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
  }
   
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}