import { Post } from './post';
import { User } from './user';
import { PostComment } from './post-comment';

export interface PostDetails {
  post: Post;
  user: User;
  comments: PostComment[];
}
