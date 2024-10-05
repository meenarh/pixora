import axios from 'axios';

const ACCESS_KEY = 'tFkmFlY7MUqcuaSwZ5tXo2AAYw4aGHVECsaJ8jbCGEc';
const BASE_URL = 'https://api.unsplash.com/';

const unsplashAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export const getPhotos = async (count = 9) => {
  try {
    const response = await unsplashAPI.get('/photos', {
      params: {
        per_page: count,
        query: 'africa',
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

export const searchPhotos = async (query) => {
  try {
    const response = await unsplashAPI.get('/search/photos', {
      params: {
        query,
        per_page: 20,
      },
    });
    console.log(response.data)
    return response.data.results;
  } catch (error) {
    console.error('Error searching for photos:', error);
    throw error;
  }
};