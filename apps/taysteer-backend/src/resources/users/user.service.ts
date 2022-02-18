import { GetAllT, GetByIdT, AddUserT, UpdateUserT, DeleteUserT } from './user.service.types';
import { UserT } from './user.type';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, genSaltSync } from 'bcryptjs';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<UserT>,
    ) { };

    /**
     * Returns an array of all users
     * @returns {Array<User>} Array of all users
     */
    getAllUsers: GetAllT = async (): Promise<Array<UserT>> => this.usersRepository.find();

    /**
     * Returns the user with the specified ID
     * @param {string} id ID user to search
     * @returns {UserT} User with the specified ID
     */
    getById: GetByIdT = async (id: string): Promise<UserT> => this.usersRepository.findOne(id);

    /**
     * Adds a user to the DataBase
     * @param {UserT} user User to add to the DataBase
     */
    addUser: AddUserT = async (user: UserT): Promise<UserT> => this.usersRepository.save({
        ...user,
        ...{ password: await hash(user.password, genSaltSync(10)) }
    });

    /**
     * Updates the data of the user with the specified ID
     * @param {string} id ID user
     * @param {UserT} newUser Data to update
     * @returns {Promise<boolean>} User updated successfully
     */
    updateUser: UpdateUserT = async (id: string, newUser: UserT): Promise<UserT> => this.usersRepository.save({
        ...(
            await this.getById(id)),
        ...{
            ...newUser,
            ...{
                password: await hash(newUser.password, genSaltSync(10))
            }
        }
    });

    /**
     * Deletes the user with the specified ID
     * @param {string} id ID user to delete
     * @returns {Promise<boolean>} User deleted successfully
     */
    deleteUser: DeleteUserT = (id: string) => this.usersRepository.delete(id);

};