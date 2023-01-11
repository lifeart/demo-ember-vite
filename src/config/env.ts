const ENV = {
  modulePrefix: "vite-ember",
  environment: "development",
  rootURL: "/",
  locationType: "none", // here is the change
  EmberENV: {
    FEATURES: {},
    EXTEND_PROTOTYPES: {
      Date: false,
    },
  },

  APP: {},
};

export default ENV;
