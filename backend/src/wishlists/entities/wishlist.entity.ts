import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { Length, IsUrl, MaxLength } from 'class-validator';
import { Base } from '../../entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends Base {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Array<Wish>;
}
