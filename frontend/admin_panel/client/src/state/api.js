import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    reducerPath: "adminApi",
    tagTypes: ["User", "Products"],
    endpoints: (build) => ({
        getUserById: build.query({
        query: (id) => `general/${id}`,
        providesTags: ["User"]
        }),
        getAllProducts: build.query({
            query: () => "client/products",
            providesTags: ["Products"],
        }),
        getAllCustomers: build.query({
            query: () => "client/customers",
            providesTags: ["Customers"],
          }),
    }),
});

export const { 
    useGetUserByIdQuery,
    useGetAllProductsQuery,
    useGetAllCustomersQuery
} = api;
