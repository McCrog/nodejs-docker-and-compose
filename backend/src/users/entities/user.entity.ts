import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';
import { Base } from '../../entities/base.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Array<Wish>;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Array<Offer>;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.name)
  wishlists: Array<Wishlist>;
}
