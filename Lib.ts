import * as request from "request";

import { appendFile, PathLike } from "fs";

export interface IRequest {
    Url: string;
}

export interface IResponse {
    IsSuccess: boolean;
    ErrorMessage: string;
    Data: string;
}

export async function MSleepAsync(timeout: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export async function AppendFileAsync(file: PathLike | number, data: any) {
    return new Promise<void>((resolve, reject) => {
        appendFile(file, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function RequestAsync(Url: string) {
    return new Promise<IResponse>((resolve) => {
        request.default(Url, (error, response, body) => {
            const IsSuccess = error === null ? true : false;
            const ErrorMessage = `${error}`;
            const Data = `${body}`;
            resolve({
                IsSuccess,
                ErrorMessage,
                Data,
            });
        });
    });
}
