
const { logger } = require('../utils/logger.js');
const { utilityConstants } = require('../constants/constants');
const { Op } = require("sequelize");
const {
  initializeLimitPageSort, initializeQueryBuilder, expressResponseHandler
} = require('../helper/commonHelper');


exports.getUnpaidJobs = async (req, res) => {
  logger.info('service::contracts@getUnpaidJobs');
  try {
    const { Job } = req.app.get('models')
    const { Contract } = req.app.get('models')

    const [limit, page, sortBy] = initializeLimitPageSort(req);
    console.log("🚀 ~ exports.getContracts= ~ limit, page, sortBy:", limit, page, sortBy)
    const filters = initializeQueryBuilder([], sortBy, page, limit,)
    const profileId = parseInt(req.get('profile_id'))
    query = {
      include: [
        {
          model: Contract,
          attributes: [],
          where: {
            status: { [Op.eq]: 'in_progress' },
            [Op.or]: [
              {
                ContractorId: profileId
              },
              {
                ClientId: profileId
              }
            ],
          },
        }],
      where: {
        paid: { [Op.eq]: null }
      }

    }
    query = { ...query, ...filters }
    let jobs = await Job.findAll(query)
    jobs = Object.keys(jobs).length > 0 ? jobs : [];
    jobs = JSON.parse(JSON.stringify(jobs, null, 2));
    const totalRecords = jobs.length;
    const statusCode = totalRecords === 0 ? utilityConstants.serviceResponseCodes.dataNotFound : utilityConstants.serviceResponseCodes.success
    return res.status(statusCode).json(expressResponseHandler(page, limit, jobs, totalRecords))
  } catch (error) {
    logger.error(error);
    res
      .status(utilityConstants.serviceResponseCodes.serverError)
      .json({ error: utilityConstants.commonResponse.serverError });
  }
};

exports.jobPayment = async (req, res) => {
  logger.info('service::contracts@getUnpaidJobs');
  try {

    const { Profile, Contract, Job } = req.app.get('models')
    const profileId = parseInt(req.get('profile_id'))
    const jobQuery = Job.findOne({
      include: [
        {
          model: Contract,
          attributes: ['ContractorId'],
          include: [
            { model: Profile, as: 'Client', attributes: ['balance', 'id'] },
          ]
        },
      ],
      where: {
        id: { [Op.eq]: req.params.job_id },
        paid: { [Op.eq]: null }
      },
      attributes: ['price']
    })
    let jobData = await jobQuery
    let msg = 'Client not found for given job Id';
    if (jobData?.dataValues) {
      const amountToPay = jobData.dataValues.price
      const contractorId = jobData.dataValues.Contract.dataValues.ContractorId
      const balance = jobData.dataValues.Contract.dataValues.Client.dataValues.balance
      const clientId = jobData.dataValues.Contract.dataValues.Client.dataValues.id
      if (balance > amountToPay) {
        const sourceProfile = await Profile.update({ balance: amountToPay-balance },{where: {  id: clientId}});
        console.log("🚀 ~ exports.jobPayment= ~ clientId:", clientId)
        const destinationProfile = await Profile.update({ balance: amountToPay+balance },{where: {  id: contractorId}});
        console.log("🚀 ~ exports.jobPayment= ~ contractorId:", contractorId)
        msg = `Amount has been paid for job id - ${job_id}`
        return res.status(utilityConstants.serviceResponseCodes.success).json(expressResponseHandler(null, null, false, 0, msg))
      }
    }
    return res.status(utilityConstants.serviceResponseCodes.error).json(expressResponseHandler(null, null, false, 0, msg))

    return false;
    console.log("🚀 ~ exports.jobPayment= ~ jobs:", clientDetails)
    jobs = Object.keys(jobs).length > 0 ? jobs : [];
    jobs = JSON.parse(JSON.stringify(jobs, null, 2));
    console.log("🚀 ~ exports.jobPayment= ~ jobs:", jobs)

    const totalRecords = jobs.length;
    console.log("🚀 ~ exports.jobPayment= ~ totalRecords-----------------:", totalRecords)
    const statusCode = totalRecords === 0 ? utilityConstants.serviceResponseCodes.dataNotFound : utilityConstants.serviceResponseCodes.success
    return res.status(statusCode).json(expressResponseHandler(page, limit, jobs, totalRecords))
  } catch (error) {
    logger.error(error);
    res
      .status(utilityConstants.serviceResponseCodes.serverError)
      .json({ error: utilityConstants.commonResponse.serverError });
  }
};
