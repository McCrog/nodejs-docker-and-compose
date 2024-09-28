import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await this.hashService.hash(createUserDto.password);
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });

      return await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(
          'The username or email address already exists',
        );
      }
    }
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
  }

  async findOne(id: number) {
    const user = this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findWishes(id: number) {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });

    return wishes;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updateUserData = { ...updateUserDto };

    if (updateUserDto.password) {
      const hash = await this.hashService.hash(updateUserDto.password);
      updateUserData.password = hash;
    }

    try {
      await this.usersRepository.update({ id }, updateUserData);

      return await this.findOne(id);
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(
          'The username or email address already exists',
        );
      }
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    await this.usersRepository.remove(user);
  }
}
