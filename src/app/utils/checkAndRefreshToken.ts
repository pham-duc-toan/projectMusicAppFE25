import { decodeToken } from "../helper/jwt";
import { getAccessTokenFromLocalStorage } from "../helper/localStorageClient";
import { refreshtoken } from "./request";

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  //nếu ko có hoặc token ko đúng dạng jsonwebtoken thì vẫn cho vào các route ko được middleware bảo vệ, và các route ko call api
  if (!accessToken) return;
  const decodedAccessToken = decodeToken(accessToken) as any;
  if (!decodedAccessToken) {
    return;
  }

  const now = Math.round(new Date().getTime() / 1000);

  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // Gọi API refresh token
    try {
      const res = await refreshtoken();
      if (res.data) {
        param?.onSuccess && param.onSuccess();
      } else {
        param?.onError && param.onError();
      }
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
