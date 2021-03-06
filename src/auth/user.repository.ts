import { Repository, EntityRepository } from 'typeorm'
import * as  bcrypt from 'bcrypt'
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = new User()
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save()
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists')
      }
      throw new InternalServerErrorException()
    }
  }

  async validatateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto
    const user = await this.findOne({ username })
    if (user && await user.validatePassword(password)) {
      return user.username
    }
    return null
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt)
  }
}
