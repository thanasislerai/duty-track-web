import axiosInstance from "./axios";

interface FetcherParams {
    queryKey: string[];
}

export const fetcher = async <T>({ queryKey }: FetcherParams) => {
    const [url] = queryKey;
    const { data } = await axiosInstance.get<T>(url);

    return data;
};
