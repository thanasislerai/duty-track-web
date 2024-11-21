import { AxiosRequestHeaders } from "axios";
import axiosInstance from "./axios";

type HttpMethod = "post" | "put" | "delete" | "patch";

type MutatorParams<T> = {
    method: HttpMethod;
    url: string;
    data?: T;
    headers?: AxiosRequestHeaders;
};

export const mutator = async <TResponse = void, TData = unknown>({
    method,
    url,
    data,
    headers,
}: MutatorParams<TData>): Promise<TResponse> => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            headers,
        });

        return response.data as TResponse;
    } catch (error) {
        throw error;
    }
};
