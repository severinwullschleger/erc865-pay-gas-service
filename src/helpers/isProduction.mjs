export const isProduction = () => {
  // for frontend
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost';
  }
  // for backend
  return process.env.NODE_ENV === 'production';
};