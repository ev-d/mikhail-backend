import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { UserDto } from './dto/user.module.dto';
import { User, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';


 
@Injectable()
export class UsersService {
  getByEmail(email: string) {
    throw new Error("Method not implemented.");
  }
  getById(userId: number) {
    throw new Error('Method not implemented.');
  }
  createUser(arg0: { password: string; email: string; name: string; }) {
    throw new Error("Method not implemented.");
  }
  constructor(private prisma: PrismaService,
    private jwtService: JwtService) { }

    async getUsers(): Promise<User[]> {
      return this.prisma.user.findMany();
    }

    async signUp(userDto : Prisma.UserCreateInput) {
      const candidate = await this.getUserByEmail(userDto.email);
      if (candidate) {
        throw new HttpException("Пользователь с таким email уже есть", HttpStatus.BAD_REQUEST)
      } else {
        const hashPassword = await bcrypt.hash(userDto.password, 10)
        const userData = { ...userDto, password: hashPassword };
        const user = await this.prisma.user.create({ data: userData })
        return this.generateToken(user)
      }
    }
  
    async login(userDto: UserDto) {
      const user = await this.validateUser(userDto)
      const token = await this.generateToken(user)
      return ({ token: token, user: user, status: 'ok' })
    }
  
    async getUserById(id: number) {
      const user = await this.prisma.user.findUnique({
        where: {
          id
        }
      })
      return ({ user: user, status: 'ok' })
    }
  
    async getUserByEmail(email: string) {
      const user = await this.prisma.user.findUnique({
        where: {
          email
        }
      });
      return user
    }

    private async generateToken(user: UserDto) {
      const payload = { id: user.id, email: user.email, password: user.password }
      return this.jwtService.sign(payload)
    }
  
    private async validateUser(userDto: UserDto) {
      const user = await this.getUserByEmail(userDto.email,);
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
      throw new UnauthorizedException({ message: 'Некорректный email или пароль' })
    }

    async user(userDto: UserDto) {
      const user = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      });
      return ({ user: user, status: 'ok' })
    }
  }