
const { logger } = require('../utils/logger.js');
const { utilityConstants } = require('../constants/constants');
const { Op } = require("sequelize");
const {
 initializeLimitPageSort, initializeQueryBuilder,expressResponseHandler
} = require('../helper/commonHelper');

/**
 * FIX ME!
 * @returns contract by id
 */
// app.get('/contracts/:id',getProfile ,async (req, res) =>{
//   const {Contract} = req.app.get('models')
//   const {id} = req.params
//   const contract = await Contract.findOne({where: {id}})
//   if(!contract) return res.status(404).end()
//   res.json(contract)
// })



exports.getContracts = async (req, res) => {
  logger.info('service::contracts@getContracts');
  try {
    const { Contract } = req.app.get('models')
    const [limit, page, sortBy] = initializeLimitPageSort(req);
    console.log("🚀 ~ exports.getContracts= ~ limit, page, sortBy:", limit, page, sortBy)
    const filters = initializeQueryBuilder([],sortBy,page,limit,)
    let query = {}
    let contract = []
    const id = req.params.id
    if (id) {
      query = { where: { id } }
      contract = await Contract.findOne(query)
    }
    if (!id) {
      const profileId = parseInt(req.get('profile_id'))
      query = {
        where: {
          status: { [Op.ne]: 'terminated' },
          [Op.or]: [
            {
              ContractorId: profileId
            },
            {
              ClientId: profileId
            }
          ],
        }
      }
      query = {...query,...filters}
      contract = await Contract.findAll(query)
    }
    const totalRecords = contract.length;
    const statusCode = totalRecords > 0? utilityConstants.serviceResponseCodes.success:utilityConstants.serviceResponseCodes.dataNotFound
    return res.status(statusCode).json(expressResponseHandler(page, limit, contract,totalRecords))
  } catch (error) {
    logger.error(error);
    res
      .status(utilityConstants.serviceResponseCodes.serverError)
      .json({ error: utilityConstants.commonResponse.serverError });
  }
};
