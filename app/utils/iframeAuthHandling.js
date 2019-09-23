const cookieHeader = {
  key: "MtCookie",
  value: undefined
};

export const setCookieHeader = value => {
  cookieHeader.value = value;
  return cookieHeader;
};
export const getCookieHeader = () => {
  return cookieHeader;
};
