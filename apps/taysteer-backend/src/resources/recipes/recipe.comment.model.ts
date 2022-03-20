import { Recipe } from './recipe.model';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('Comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  commentatorId: string;

  @Column('varchar', { length: 500 })
  text: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.raters)
  recipe: Recipe;

  @OneToMany(() => Comment, (comment) => comment.mainComment)
  childComments: Comment;

  @ManyToOne(() => Comment, (comment) => comment.childComments)
  mainComment: Comment;

  @CreateDateColumn()
  @UpdateDateColumn()
  date: Date;

  constructor({
    commentatorId = '',
    text = '',
  } = {}) {
    super();
    this.commentatorId = commentatorId;
    this.text = text;
  }
}
