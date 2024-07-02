const formatErrorResponse = (error: any): string | null => {
  if (!error) {
    return null;
  }
  const message = error?.data?.error ?? error?.data?.message ?? error?.error;
  return message;
};

export default formatErrorResponse;
