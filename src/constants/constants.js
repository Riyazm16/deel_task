exports.utilityConstants = {
  serviceResponseCodes: {
    success: 200,
    error: 400,
    serverError: 500,
    unauthorized: 401,
    dataNotFound: 404,
  },

  commonResponse: {
    serverError: "An Error occurred please try again",
  },

  defaultOrderFields: ["ASC", "DESC"],

  enums: {
    unauthorized: "unauthorized",

    minimumValidation: { min: 1 },

    defaultPage: 1,
    defaultLimit: 10,
    defaultSort: "_id",
    defaultOrder: -1,
    noDataFoundMessage: "Not data found",
    userTypes: {
      client: "client",
      contractor: "contractor",
    },
  },
};
