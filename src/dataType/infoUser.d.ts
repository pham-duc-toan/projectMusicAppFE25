interface TPermission {
  id: string;
  name: string;
  pathName: string;
  method: string;
}
interface IUserInfo {
  id: string;
  fullName: string;
  username: string;
  userId: string;
  avatar: string;
  role: {
    id: string;
    roleName: string;
    permissions: TPermission[];
  };
  type: string;
  listPlaylist: [
    {
      id: string;
      userId: string;
      title: string;
      listSong: TSongDetail[];
    }
  ];

  refreshToken: string;
  singerId: {
    id: string;
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
  };
  listFavoriteSong: string[];
}
export default IUserInfo;
