interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

export interface TSongDetail {
  listen: number;
  _id: string;
  title: string;
  avatar: string;
  description: string;
  singerId: {
    _id: string;
    fullName: string;
    [key: string]: any;
  };
  topicId: Topic;
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
  _id: string;
  title: string;
  singerFullName: string;
  audio: string;
  slug: string;
  isPlaying: boolean;
  currentTime: number;
}
