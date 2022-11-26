const successful = {
  ok: 200,
  created: 201,
};
type Successful = typeof successful;

const clientError = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  conflict: 409
};
type ClientError = typeof clientError;

const serverError = {
  internalServerError: 500,
};
type ServerError = typeof serverError;

const statusCode = { ...successful, ...clientError, ...serverError };

export type StatusCode = keyof Successful | keyof ClientError | keyof ServerError;

function getStatusCode(code: StatusCode): number {
  return statusCode[code];
}

export default getStatusCode;
