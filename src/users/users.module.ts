import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  controllers: [],
  providers: [PrismaService, UsersService],
  exports: [PrismaService, UsersService,]
})
export class UsersModule { }