import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const newUser = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(newUser);
  }

  async findUser(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, pass: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user && (await bcrypt.compare(pass, user.password));
  }
}
