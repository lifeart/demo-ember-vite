function config(environment: 'production' | 'development') {
  const ENV = {
    modulePrefix: 'vite-ember',
    environment,
    rootURL: '/',
    locationType: 'history', // here is the change
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        Date: false,
      },
    },
    APP: {},
  };

  return ENV;
}

const ENV = config(import.meta.env.MODE as 'production' | 'development');
export default ENV;
