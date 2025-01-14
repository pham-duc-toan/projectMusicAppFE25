interface TPermission {
  _id: string;
  name: string;
  pathName: string;
  method: string;
}
interface IUserInfo {
  _id: string;
  fullName: string;
  username: string;
  userId: string;
  avatar: string;
  role: {
    _id: string;
    roleName: string;
    permissions: TPermission[];
  };
  type: string;
  listPlaylist: [
    {
      _id: string;
      userId: string;
      title: string;
      listSong: TSongDetail[];
    }
  ];

  refreshToken: string;
  singerId: {
    _id: string;
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
  };
  listFavoriteSong: string[];
}
export default IUserInfo;
