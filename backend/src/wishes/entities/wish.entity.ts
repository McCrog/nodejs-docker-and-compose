import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { Base } from '../../entities/base.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish extends Base {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ scale: 2 })
  price: number;

  @Column({ scale: 2 })
  raised: number;

  @Column()
  copied: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Array<Offer>;
}
