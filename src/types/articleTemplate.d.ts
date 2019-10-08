export interface Creator {
  id: number;
  name: string;
  avtar: string | null;
}

export interface Article2 {
  id: number;
  content: string;
  creator: Creator;
  createdAt: string;
}

export interface Photo {
  id: number;
  location: string;
}

export interface LikeNumber {
  count: number;
}
export interface CommentNumber {
  count: number;
}
export interface Comment {
  id: number;
  content: string;
  creatdAt: string;
  creator: string;
  creatorId: number;
}
export interface IsLiked {
  isLiked: boolean;
}
export interface IsBookmarked {
  isBookmarked: boolean;
}

export interface ArticleTemplate extends Article2 {
  photos: Photo[];
  likeNumber: number;
  commentNumber: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
}
