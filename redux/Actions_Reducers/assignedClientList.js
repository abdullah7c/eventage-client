import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

export const assignClientListApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://eventage-server.herokuapp.com/",
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getassignClientList: builder.query({
      query: (name) => `/${name}`,
    }),

  }),
});

export const { useGetassignClientListQuery } = assignClientListApi;

export const { getassignClientList } = assignClientListApi.endpoints;