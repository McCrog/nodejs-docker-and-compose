import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (user.id === wish.owner.id)
      throw new BadRequestException('The user offered his own wish');

    const raisedSum = wish.raised + createOfferDto.amount;

    if (raisedSum > wish.price)
      throw new BadRequestException(
        'The amount of the offer exceeds the wish price',
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.wishesService.update(user, createOfferDto.itemId, {
        raised: raisedSum,
      });

      const offer = await this.offersRepository.save({
        ...createOfferDto,
        item: wish,
        user,
      });

      await queryRunner.commitTransaction();

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offersRepository.find();
  }

  async findOne(id: number) {
    return await this.offersRepository.findOneBy({ id });
  }
}
