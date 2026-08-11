import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/reg.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(reg: RegisterDto) {
    try {
      this.logger.log(`Registration attempt: ${reg.email}`);

      const user = await this.userRepository.findOne({
        where: { email: reg.email },
      });

      if (user) {
        this.logger.warn(`User already exists: ${reg.email}`);
        throw new ConflictException('User already registered');
      }

      this.logger.log(`Hashing password for: ${reg.email}`);

      const passHashed = await bcrypt.hash(
        reg.password,
        12,
      );

      const newUser = this.userRepository.create({
        username: reg.username,
        email: reg.email,
        password: passHashed,
      });

      const savedUser = await this.userRepository.save(newUser);

      this.logger.log(
        `User registered successfully: ${savedUser.email}`,
      );

      return {
        userid: savedUser.id,
        username: savedUser.username,
      };
    } catch (error) {
      this.logger.error(
        `Registration failed for ${reg.email}`,
        error instanceof Error ? error.stack : String(error),
      );

      
      if (
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Registration failed',
      );
    }
  }

  async login(log: LoginDto) {
    try {
      this.logger.log(`Login attempt: ${log.email}`);

      const user = await this.userRepository.findOne({
        where: { email: log.email },
      });

      if (!user) {
        this.logger.warn(`User not found: ${log.email}`);

        throw new UnauthorizedException(
          'User not registered',
        );
      }

      this.logger.log(`User found: ${user.email}`);

      const passCompare = await bcrypt.compare(
        log.password,
        user.password,
      );

      this.logger.log(
        `Password comparison result: ${passCompare}`,
      );

      if (!passCompare) {
        this.logger.warn(
          `Wrong password for: ${log.email}`,
        );

        throw new UnauthorizedException(
          'Wrong password',
        );
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      this.logger.log(
        `Generating JWT for: ${user.email}`,
      );

      const token = this.jwtService.sign(payload);

      this.logger.log(
        `Login successful: ${user.email}`,
      );

      return token;
    } catch (error) {
      this.logger.error(
        `Login failed for ${log.email}`,
        error instanceof Error ? error.stack : String(error),
      );

     
      if (
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Login failed',
      );
    }
  }
}