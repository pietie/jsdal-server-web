export interface IApiResponse {
    ApiResponseVer: string;
    Message: string;
    Title: string
    Type: ApiResponseType;
    Data: any;

}

export enum ApiResponseType {
    Unknown = 0,
    Success = 1,
    InfoMsg = 10,
    ExclamationModal = 20,
    Error = 30,
    Exception = 40
}