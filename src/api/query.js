import { useQuery, useMutation, useQueryClient } from "react-query";
import { instance } from "./instance";

export const useGetData = (endpoint, queryKey, options = {}) => {
    return useQuery(
        queryKey,
        async () => {
            const response = await instance.get(endpoint, {
                params: options.params,
            });
            return response?.data;
        },
        options
    );
};

export const usePostData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const response = await instance.post(endpoint, data);
            return response.data.data;
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const usePutData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (data) => {
            const response = await instance.put(`${endpoint}`, data);
            return response?.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const usePatchData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const response = await instance.patch(`${endpoint}`, data);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const useDeleteData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const response = await instance.delete(`${endpoint}`, {
                data,
            });
            return response?.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};
