export enum Method {
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
}
export interface IEnv {
  FREEDOME_BUCKET: any;
}
export interface IUploadR2 {
  fileName: string;
  file: string;
}
