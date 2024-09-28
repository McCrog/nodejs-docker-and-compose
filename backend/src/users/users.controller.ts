import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findCurrentUser(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }

  @Get('me/wishes')
  async findCurrentUserWishes(@Req() req) {
    return await this.usersService.findWishes(req.user.id);
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return await this.usersService.findWishes(id);
  }

  @Delete()
  async remove(@Req() req) {
    return await this.usersService.remove(req.user.id);
  }
}
