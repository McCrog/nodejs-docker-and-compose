import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from '../guards/local.guard';

@Controller('')
export class AuthController {
  constructor(
    private readonly authsService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    console.log(`signup, user: ${user}`);

    return this.authsService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req) {
    return this.authsService.auth(req.user);
  }
}
