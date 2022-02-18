import { UserT } from './user.type';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('User')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 50 })
    name: string;

    @Column('varchar', { length: 50 })
    login: string;

    @Column('text')
    password: string;

    constructor({
        name = 'USER',
        login = 'user',
        password = 'P@55w0rd'
    } = {}) {
        super();
        this.name = name;
        this.login = login;
        this.password = password;
    };

    static toResponse(user: UserT): { id: string, name: string, login: string } {
        const { id, name, login } = user;
        return { id, name, login } as User;
    };
};