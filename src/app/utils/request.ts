import {
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
} from "../helper/localStorageClient";
// chỉ dùng cho client call api, còn nếu server muốn call api thì call trực tiếp tới server backend luôn

export const apiBasicClient = async (
  method: string,
  path: string,
  query?: any,
  option?: object
) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const body = {
    path,
    query,
    method: method,

    ...(option ? { option: option } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASIC_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  return response;
};
export const apiBasicServer = async (
  method: string,
  path: string,
  query?: any,
  option?: object,
  access_token?: any,
  tagNext: Array<string> = []
) => {
  let queryParams = "";
  if (query) {
    queryParams = new URLSearchParams(query).toString(); // Chuyển đổi query thành chuỗi
  }
  if (access_token) {
    access_token = access_token.value; // Lấy giá trị của access_token
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_BACK_END_URL + path + `?${queryParams}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      ...(option ? { body: JSON.stringify(option) } : {}),
      credentials: "include",
      ...(tagNext.length > 0 && {
        next: {
          tags: tagNext, // Thêm tags nếu có
        },
      }),
    }
  );

  const result = await response.json(); // Giải mã JSON
  return result; // Trả về kết quả
};
export const apiBackEndCreateWithFile = async (
  path: string,
  formData: any,
  accessToken: string | null
) => {
  const response = await fetch(process.env.NEXT_PUBLIC_BACK_END_URL + path, {
    method: "POST",
    body: formData,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });
  const result = await response.json();
  return result;
};
export const apiBasicClientPublic = async (
  method: string,
  path: string,
  query?: any,
  option?: object
) => {
  const body = {
    path,
    query,
    method: method,

    ...(option ? { option: option } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  return response;
};

//--------------------auth
export const login = async (body: { username: string; password: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/login`, {
    method: "POST",
    credentials: "include",

    body: JSON.stringify(body),
  });
  const data = await response.json();

  return data;
};
export const logout = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();

  return data;
};
export const refreshtoken = async () => {
  const accessLocal = getAccessTokenFromLocalStorage();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_API}/refreshToken`,
    {
      method: "POST",
      headers: {
        ...(accessLocal ? { Authorization: `Bearer ${accessLocal}` } : {}),
      },
      credentials: "include",
    }
  );
  const data = await response.json();
  if (data.data) {
    setAccessTokenToLocalStorage(data.data.access_token);
  }
  return data;
};
//------------call api thông tin user
export const getInfoUser = async (value_access_token: string | null) => {
  if (!value_access_token)
    return {
      message: "Bạn chưa đăng nhập",
      statusCode: 400,
    };
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACK_END_URL + "/users/profile",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${value_access_token}`,
      },
      credentials: "include",
      next: {
        tags: ["revalidate-tag-infoUser"], // Thêm tags nếu có
      },
    }
  );

  const result = await response.json(); // Giải mã JSON
  return result; // Trả về kết quả
};
