// enviroments
const environment: { [key: string]: { API_BASE_URL: string | undefined } } = {
  production: {
    API_BASE_URL: process.env.NEXT_PUBLIC_PROD_API,
  },
  development: {
    API_BASE_URL: process.env.NEXT_PUBLIC_DEV_API,
  },
};

const currentEnvironment = process.env.NEXT_PUBLIC_ENV || "development";
// const currentEnvironment = "production";

export default environment[currentEnvironment];
