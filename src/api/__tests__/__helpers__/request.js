export const GET_METHOD = 'GET';
export const POST_METHOD = 'POST';
export const PUT_METHOD = 'PUT';
export const DELETE_METHOD = 'DELETE';

export const createEventObject = (resourcePath, httpMethod, body) => {
  return {
    requestContext: {
      resourcePath,
      httpMethod,
    },
    body,
  };
};

export const createPathEventObject = (
  resourcePath,
  httpMethod,
  pathParameters
) => {
  return {
    requestContext: {
      resourcePath,
      httpMethod,
    },
    pathParameters,
  };
};

export const ENDPOINTS = {
  addSongs: '/songs/add',
  playCount: '/songs/popular/{year}/{month}/{limit}',
  albumCount: '/albums/popular/{year}/{month}',
};
