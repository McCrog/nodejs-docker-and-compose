import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  private RELATIONS_OWNER_OFFERS = ['owner', 'offers'];

  constructor(
    @InjectRepository(Wish)
    private wishsRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    return await this.wishsRepository.save({ ...createWishDto, owner: user });
  }

  async findLast() {
    return await this.wishsRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
      relations: this.RELATIONS_OWNER_OFFERS,
    });
  }

  async findTop() {
    return await this.wishsRepository.find({
      take: 10,
      order: { copied: 'DESC' },
      relations: this.RELATIONS_OWNER_OFFERS,
    });
  }

  async findOne(id: number) {
    const wish = await this.wishsRepository.findOne({
      where: { id },
      relations: this.RELATIONS_OWNER_OFFERS,
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    return wish;
  }

  async update(user: User, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);

    if (user.id !== wish.owner.id) {
      throw new BadRequestException('Not enough rights');
    }

    if (updateWishDto.hasOwnProperty('price') && wish.raised > 0) {
      throw new BadRequestException('Wish already raised');
    }

    await this.wishsRepository.update(id, updateWishDto);
  }

  async remove(user: User, id: number) {
    const wish = await this.findOne(id);

    if (user.id !== wish.owner?.id) {
      throw new BadRequestException('Not enough rights');
    }

    return await this.wishsRepository.delete(id);
  }

  async copy(user: User, id: number) {
    const wish = await this.findOne(id);

    return await this.wishsRepository.save({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      copied: wish.copied + 1,
      owner: user,
    });
  }
}
