import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreateUserDto } from 'users/dto/create-user.dto';

@Entity('users')
export class User {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;

  @Column()
  selfIntro: string;

  @Column()
  profileImageUrl: string;

  @Column()
  countryCode: string;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;
}
