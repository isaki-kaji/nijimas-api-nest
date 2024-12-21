import { CreateUserDto } from 'users/dto/create-user.dto';
import { User } from 'users/entities/user.entity';

export function mapCreateDtoToEntity(dto: CreateUserDto) {
  const user = new User();
  user.uid = dto.uid;
  user.username = dto.username;

  return user;
}
