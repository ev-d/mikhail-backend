import { Controller, Post, Body} from '@nestjs/common';
import { UserDto } from './dto/user.module.dto';
import { UsersService } from './users.service'


@Controller('/api')
export class UserController {
  constructor(private readonly userService: UsersService) { }

  @Post('/signup')
  async signupUser(@Body() user: UserDto,) {
    const data = await this.userService.signUp(user)
    return data
  }

  @Post('/login')
  async login(@Body() user: UserDto,) {
    const data = await this.userService.login(user)
    console.log(data);
    return data
  }
}