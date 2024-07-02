import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";

const rtkMutation = async (request: MutationTrigger<any>, credentials: {}) => {
  //   let data = null;
  //   let errorData = null;
  try {
    const result = await request(credentials).unwrap();
    // data = result.data;
  } catch (error) {
    // errorData = formatErrorResponse(error);
  }

  //   return { data, errorData };
};

export default rtkMutation;
