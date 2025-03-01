import axios from "axios"

const API_URL = 'http://localhost:3500/'

export type AxiosResponse<T> = Promise<AxiosSuccess<T> | AxiosError>

export type AxiosSuccess<T> = {
    status: 'SUCCESS',
    data: T
}

export type AxiosError = {
    status: 'ERROR',
    message: JSON
}

export const axiosGet = async <T>(relativeUrl: string) : AxiosResponse<T> => {
    try {
        const result = await axios.get<T>(`${API_URL}${relativeUrl}`);
        return { status: 'SUCCESS', data: result.data };
    } catch (e: unknown) {
        return {
            status: 'ERROR',
            message: axios.isAxiosError(e) ? e.response?.data : { message: 'Unknown error' }
        };
    }
};

export const axiosPost = async <T>(relativeUrl: string, data: T): AxiosResponse<void> => {
    try {
        const result = await axios.post<void>(`${API_URL}${relativeUrl}`, data);
        return { status: 'SUCCESS', data: result.data };
    } catch (e: unknown) {
        return {
            status: 'ERROR',
            message: axios.isAxiosError(e) ? e.response?.data : { message: 'Unknown error' }
        };
    }
};

export const axiosPatch = async <T>(relativeUrl: string, data: T): AxiosResponse<void> => {
    try {
        const result = await axios.patch<void>(`${API_URL}${relativeUrl}`, data);
        return { status: 'SUCCESS', data: result.data };
    } catch (e: unknown) {
        return {
            status: 'ERROR',
            message: axios.isAxiosError(e) ? e.response?.data : { message: 'Unknown error' }
        };
    }
};

export const axiosDelete = async <T>(relativeUrl: string) : AxiosResponse<void> => {
    try {
        const result = await axios.delete<void>(`${API_URL}${relativeUrl}`);
        return { status: 'SUCCESS', data: result.data };
    } catch (e: unknown) {
        return {
            status: 'ERROR',
            message: axios.isAxiosError(e) ? e.response?.data : { message: 'Unknown error' }
        };
    }
};

export const axiosMutate = <T extends {}>(url: string, method: 'POST' | 'PATCH' | 'DELETE', body: T) : AxiosResponse<void> => {
    if (method === 'POST') return axiosPost(url, body)
    if (method === 'PATCH') return axiosPatch(url, body)
    return axiosDelete(url)
}