import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as config from 'config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserRepository } from './user.repository'
import { JwtStrategy } from './jwt.strategy'
import { JwtConfig } from 'config/env.variables';

const jwtConfig: JwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([ UserRepository ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})

export class AuthModule {}
