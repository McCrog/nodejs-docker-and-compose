import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  private RELATIONS_OWNER_OFFERS = ['owner', 'offers'];

  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...wishlist } = createWishlistDto;
    const wishes = await Promise.all(
      itemsId.map((id) => this.wishesService.findOne(id)),
    );

    return await this.wishlistsRepository.save({
      ...wishlist,
      items: wishes,
      owner: user,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: this.RELATIONS_OWNER_OFFERS,
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: this.RELATIONS_OWNER_OFFERS,
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);

    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException('Not enough rights');
    }

    await this.wishlistsRepository.update(id, updateWishlistDto);
  }

  async remove(user: User, id: number) {
    const wishlist = await this.findOne(id);

    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException('Not enough rights');
    }

    return await this.wishlistsRepository.delete(id);
  }
}
