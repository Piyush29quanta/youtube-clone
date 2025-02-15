export const API_KEY = "AIzaSyCS3QGySDgo3GLUFi9o8TFQvSzP6Fr9iqE";

export const value_converter = (value) => {
  if (value > 1000000) {
    return `${Math.floor(value / 1000000)}M`;
  } else if (value > 1000) {
    return `${Math.floor(value / 1000)}K`;
  } else {
    return value;
  }
};

export const time_converter = (time) => {
  const date = new Date(time);
  return date.toDateString();
};
