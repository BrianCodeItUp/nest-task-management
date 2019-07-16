import { Repository, EntityRepository } from 'typeorm'
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto
    const user = new User()
    user.username = username
    user.password = password

    try {
      await user.save()
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists')
      }
      throw new InternalServerErrorException()
    }
  }
}