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
import { CommentToResponseT } from './recipe.types';

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

  @OneToMany(() => Comment, (comment) => comment.mainComment, { cascade: true })
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

  static toResponse(comment: Comment): CommentToResponseT {
    const { id, text, user, date, updated, childComments } =
      comment;
    return {
      id,
      text,
      user: User.toResponse(user),
      date,
      updated,
      childComments: childComments
        ? childComments.map((comment) => Comment.toResponse(comment))
        : null,
    };
  }
}
