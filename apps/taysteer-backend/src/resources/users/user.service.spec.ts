import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from '../../ormconfig';
import { User } from './user.model';
import { UsersService } from './user.service';
import { UserT } from './user.type';


describe('UsersController', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findByLogin', () => {
    it('should return user by login', async () => {
      expect(await usersService.getUserByLogin('admin')).toEqual(
        expect.objectContaining({ login: 'admin' })
      );
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const expectedResult: UserT = await usersService.getUserByLogin('admin');
      const id: string = (await usersService.getUserByLogin('admin')).id;
      expect(await usersService.getUserById(id)).toStrictEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedResult: Array<UserT> = [await usersService.getUserByLogin('admin')];
      expect(await usersService.getAllUsers()).toEqual(
        expect.arrayContaining(expectedResult)
      );
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const newUser: UserT = new User({
        login: 'testUser',
        password: 'qwerty',
      });
      await usersService.addUser(newUser);
      expect(await usersService.getUserByLogin('testUser')).toBeTruthy();
    });
  });

  describe('editUser', () => {
    it('should edit user', async () => {
      const user = await usersService.getUserByLogin('testUser');
      const newUser = { ...user, ...{ login: 'testUser1' } };
      await usersService.updateUser(user.id, newUser);
      expect(await usersService.getUserById(user.id)).toEqual(
        expect.objectContaining({ login: 'testUser1' })
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const user = await usersService.getUserByLogin('testUser1');
      expect(await usersService.deleteUser(user.id)).toBeTruthy();
    });
  });
});
