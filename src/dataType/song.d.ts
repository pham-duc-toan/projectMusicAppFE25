interface Topic {
  id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

export interface TSongDetail {
  listen: number;
  id: string;
  title: string;
  avatar: string;
  description: string;
  singer: {
    id: string;
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
    deleted: boolean;
    updatedAt: string;
    createdAt: string;
  };
  topic: Topic;
  like: number;
  lyrics: string;
  audio: string;
  status: string;
  slug: string;
  isPlaying?: boolean;
  deleted: boolean;
  createdAt: Date;
}
export interface TSongFooter {
  id: string;
  title: string;
  singerFullName: string;
  audio: string;
  slug: string;
  isPlaying: boolean;
  currentTime: number;
}
