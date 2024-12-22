import { CreateUserDto } from 'users/dto/request/create-user.dto';
import { UserResponseDto } from 'users/dto/response/user.response.dto';
import { User } from 'users/entities/user.entity';

export function mapCreateDtoToEntity(dto: CreateUserDto) {
  const user = new User();
  user.uid = dto.uid;
  user.username = dto.username;

  return user;
}

export function mapEntityToResponseDto(entity: User) {
  return new UserResponseDto(entity);
}
