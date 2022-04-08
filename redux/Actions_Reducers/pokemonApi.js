import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

export const pokemonApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonList: builder.query({
      query: () => `pokemon/`,
    }),
  }),
});

export const { useGetPokemonByNameQuery, useGetPokemonListQuery} = pokemonApi;

export const { getPokemonByName, getPokemonList } = pokemonApi.endpoints;