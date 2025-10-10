
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


export const getBookings = async () => {
  const res = await axios.get(`${API_URL}/api/bookings`);
  return res.data;
};


export const deleteBooking = async (id) => {
  await axios.delete(`${API_URL}/api/bookings/${id}`);
};
