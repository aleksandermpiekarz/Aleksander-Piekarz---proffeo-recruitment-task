import { Post } from './post';
import { User } from './user';

export interface PostDetails {
  post: Post;
  user: User;
  comments: Comment[];
}
