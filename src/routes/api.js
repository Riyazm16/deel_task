const router = require("express").Router();
const { utilityConstants } = require("../constants/constants");

const { getContracts } = require("../service/contracts");
const { getUnpaidJobs, jobPayment } = require("../service/jobs");
// const { } = require('../service/jobs');

// const { utilityConstants } = require('../constants/constants');
const { validateGetContracts } = require("../validator/validateContracts");
const { getProfile } = require("../middleware/getProfile");
const {
  validateGetUnpaidJobs,
  validatejobPayment,
} = require("../validator/validateJobs");
router.get("/healthcheck", (req, res) =>
  res
    .status(utilityConstants.serviceResponseCodes.success)
    .json({ msg: "API works !" })
);

router.get("/contracts/:id?", [validateGetContracts, getProfile, getContracts]);
// //jobs routes
router.get("/jobs/unpaid", [validateGetUnpaidJobs, getProfile, getUnpaidJobs]);
router.post("/jobs/:job_id/pay", [validatejobPayment, getProfile, jobPayment]);
// //admin routes
router.get("/admin/best-profession?start=<date>&end=<date>", []);
router.get("/admin/best-clients?start=<date>&end=<date>&limit=<integer>", []);
//balances  routes
router.post("/balances/deposit/:userId", []);

module.exports = router;
