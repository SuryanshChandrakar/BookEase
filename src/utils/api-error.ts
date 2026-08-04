
//umbrela level class
export class ApiError extends Error{
    readonly statusCode: number;
    readonly details?: unknown;

    constructor(statusCode :number ,message:string,details?:unknown){
        super(message);
        this.statusCode=statusCode;
        this.details=details;
        this.name="ApiError";
        Error.captureStackTrace(this,this.constructor)
    }
}
//expose it as fxn;
//these are good utility fxn just call bad request for bad request instead of calling this class/constructor and pass status code and all;

export const badRequest=(message:string,details?:unknown)=> new ApiError(400,message,details);


export const notFound = (message: string, details?: unknown) =>
  new ApiError(404, message, details);

//we dont want to show details about server side error to client this details could expose critical things...you have to check logs we wont providing it as server response.
//details of client side error or error caused by client is displayed so they can fix it.
export const internalServerError = (message="Internal Server Error") =>
  new ApiError(500, message);

export const unauthorized = (message: string, details?: unknown) =>
  new ApiError(401, message, details);

export const forbidden = (message: string, details?: unknown) =>
  new ApiError(403, message, details);

export const conflict = (message: string, details?: unknown) =>
  new ApiError(409, message, details);

export const badGateway = (message: string, details?: unknown) =>
  new ApiError(502, message, details);

export const serviceUnavailable = (message: string, details?: unknown) =>
  new ApiError(503, message, details);

export const gatewayTimeout = (message: string, details?: unknown) =>
  new ApiError(504, message, details);

export const preconditionFailed = (message: string, details?: unknown) =>
  new ApiError(412, message, details);

export const payloadTooLarge = (message: string, details?: unknown) =>
  new ApiError(413, message, details);

export const unprocessableEntity = (message: string, details?: unknown) =>
  new ApiError(422, message, details);

//you can use status code library(http-status-code)and go by that method 
//but many languages dont have library support of it.