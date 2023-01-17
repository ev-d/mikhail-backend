import Category from 'src/categories/categories.entity';
import User from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public title: string;
 
  @Column()
  public content: string;

  @Column({ nullable: true })
  public category?: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];
}
 
export default Post;