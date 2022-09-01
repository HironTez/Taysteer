import { RecipeStringTypes } from './recipe.service.types';
import { Recipe } from './recipe.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.model';
import { CommentToResponseT, CommentToResponseDetailedT } from './recipe.types';
import { objectPromise } from '../../utils/promise.loader';

@Entity('Comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 500 })
  text: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.comments, { onDelete: 'CASCADE' })
  recipe: Recipe;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.mainComment)
  childComments: Array<Comment>;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    onDelete: 'CASCADE',
  })
  mainComment: Comment;

  @CreateDateColumn()
  date: Date;

  @Column('boolean', { nullable: false, default: false })
  updated: boolean;

  constructor({ text = '', updated = false } = {}) {
    super();
    this.text = text;
    this.updated = updated;
  }

  static async toResponse(comment: Comment): Promise<CommentToResponseT> {
    const { id, text, user, date, updated } = comment;
    return objectPromise({
      id,
      text,
      user: User.toResponse(user),
      date,
      updated,
      countOfChildComments: await this.getRepository().count({
        relations: [RecipeStringTypes.MAIN_COMMENT],
        where: { mainComment: comment },
      }),
    });
  }

  static async toResponseDetailed(
    comment: Comment
  ): Promise<CommentToResponseDetailedT> {
    const { id, text, user, date, updated, childComments } = comment;
    return objectPromise({
      id,
      text,
      user: User.toResponse(user),
      date,
      updated,
      countOfChildComments: await this.getRepository().count({
        relations: [RecipeStringTypes.MAIN_COMMENT],
        where: { mainComment: comment },
      }),
      childComments: childComments
        ? await Promise.all(
            childComments.map(
              async (comment) => await Comment.toResponse(comment)
            )
          )
        : null,
    });
  }
}
