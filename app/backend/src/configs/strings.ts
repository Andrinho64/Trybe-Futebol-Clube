enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

enum JOI_ERROR_CODE {
  'any.required' = HTTP_STATUS.BAD_REQUEST,
  'any.unknown' = HTTP_STATUS.BAD_REQUEST,
  'number.base' = HTTP_STATUS.UNPROCESSABLE_ENTITY,
  'number.empty' = HTTP_STATUS.UNPROCESSABLE_ENTITY,
  'number.min' = HTTP_STATUS.UNPROCESSABLE_ENTITY,
  'string.base' = HTTP_STATUS.UNPROCESSABLE_ENTITY,
  'string.min' = HTTP_STATUS.UNAUTHORIZED,
  'string.email' = HTTP_STATUS.UNAUTHORIZED,
  'string.empty' = HTTP_STATUS.BAD_REQUEST,
}

enum MSG {
  VALIDATE_FIELD = 'Some required fields are missing',
  INVALID_FIELDS = 'All fields must be filled',
  DISPLAYNAME_NOT_VALID = '"displayName" length must be at least 8 characters long',
  EMAIL_NOT_VALID = '"email" must be a valid email',
  USER_ALREADY_REGISTERED = 'User already registered',
  INVALID_USER = 'User does not exist',
  UNAUTHORIZED_USER = 'Unauthorized user',
  CREDENTIALS_NOT_VALID = 'Some required fields are missing',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  EMAIL_NOT_FOUND = 'Email not found',
  EMAIL_NOT_STRING = 'Email is not a string',
  EMAIL_EMPTY = 'The email field is empty',
  PASSWORD_NOT_STRING = 'Password is not a string',
  PASSWORD_NOT_FOUND = 'Password not found',
  PASSWORD_EMPTY = 'The password is empty',
  TOKEN_NOT_FOUND = 'Token not found',
  TOKEN_NOT_VALID = 'Token must be a valid token',
  DISPLAYNAME_NOT_FOUND = 'Displayname not found',
  NAME_NOT_STRING = '"name" must be a string',
  NAME_NOT_FOUND = '"name" is required',
  NAME_NOT_VALID = '"name" length must be at least 3 characters long',
  PRICE_NOT_STRING = '"price" must be a string',
  PRICE_NOT_FOUND = '"price" is required',
  PRICE_NOT_VALID = '"price" length must be at least 3 characters long',
  USERID_REQUIRED = '"userId" is required',
  USERID_NOT_NUMBER = '"userId" must be a number',
  USERID_NOT_FOUND = '"userId" not found',
  INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password',
  ERROR_FETCHING_TEAM = 'Error fetching team',
  ERROR_FETCHING_TEAMS = 'Error fetching teams',
  TEAM_NOT_FOUND = 'Team not found',
  INVALID_MATCH = 'It is not possible to create a match with two equal teams',
  TEAM_NO_SUCH_ID = 'There is no team with such id!',
  ERROR_FETCHING_MATCHES = 'Error fetching matches',
}

enum ROUTE {
  TEAMS = '/teams',
  LOGIN = '/login',
  MATCHES = '/matches',
  LEADERBOARD = '/leaderboard',
}

export { HTTP_STATUS, JOI_ERROR_CODE, MSG, ROUTE };
