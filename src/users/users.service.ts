import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(filterDto?: Partial<GetUsersFilterDto>[]): Promise<User[]> {
    const filters = filterDto && filterDto.length ? { $and: filterDto } : {};

    const result = await this.userModel.find(filters).select('-__v').exec();

    if (!result) {
      throw new NotFoundException('There are no Users, yet');
    }

    return result;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('-__v').exec();
  }

  async getUserByID(id: string): Promise<User> {
    return this.userModel
      .findById(id)
      .select({ __v: 0, password: 0, salt: 0 })
      .exec();
  }

  async creatUser(user: Partial<User>) {
    const newUser = new this.userModel(user);
    const result = await newUser.save();

    if (!result) {
      throw new NotFoundException('User not saved');
    }
    return result;
  }

  async getListOfUsers(filterDto?: Partial<User>[]): Promise<User[]> {
    const filters = filterDto && filterDto.length ? { $and: filterDto } : {};
    const result = await this.userModel
      .find(filters)
      .select({ __v: 0, password: 0, salt: 0 })
      .exec();
    if (result.length === 0 || !result) {
      throw new NotFoundException('Not found.');
    }
    return result;
  }

  async updateUser(_id: string, user: Partial<User>): Promise<User> {
    if (user?.email || user?.phoneNumber) {
      const { conflict, message } = await this.checkIfUserIsUnique({
        email: user?.email,
        phoneNumber: user?.phoneNumber,
      });
      if (conflict) throw new ConflictException(message);
    }

    let result;
    try {
      result = await this.userModel
        .findOneAndUpdate({ _id }, user, {
          returnOriginal: false,
        })
        .select({ __v: 0, password: 0, salt: 0 })
        .exec();
      return result;
    } catch (error: any) {
      throw new NotFoundException(`User with id: ${_id} not exist`);
    }
  }

  async deleteUser(_id: string) {
    try {
      const result = await this.userModel.findOneAndDelete({ _id }).exec();

      if (!result) {
        throw new NotFoundException('User not exist');
      }
      return { status: 200, messege: `User ${_id} deleted` };
    } catch (error: any) {
      throw new NotFoundException('User not exist');
    }
  }

  async checkIfUserIsUnique(
    user: Pick<User, 'email' | 'phoneNumber'>,
  ): Promise<{ conflict: boolean; message: string }> {
    const { email, phoneNumber } = user;

    const foundEmail = await this.userModel
      .findOne({
        email,
      })
      .exec();

    if (foundEmail)
      return {
        conflict: true,
        message: `User with email: ${email} allready exist`,
      };

    const foundPhoneNumber = await this.userModel
      .findOne({
        phoneNumber,
      })
      .exec();

    if (foundPhoneNumber)
      return {
        conflict: true,
        message: `User with phone number: ${phoneNumber} allready exist`,
      };

    return { conflict: false, message: 'User was created' };
  }
}
