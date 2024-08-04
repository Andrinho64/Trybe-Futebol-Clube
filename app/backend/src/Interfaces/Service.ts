export type ServiceMessage = { message: string };
export type ServiceResponse<Success, Error> = {
  status: number,
  data: Success | Error
};
