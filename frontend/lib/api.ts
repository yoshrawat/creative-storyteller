import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchStory = async (topic: string) => {
  const response = await axios.get(`${API_URL}/api/story`, {
    params: { topic },
  });

  return response.data;
};