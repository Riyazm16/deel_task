const { logger } = require('../utils/logger');
const { utilityConstants } = require('../constants/constants');

/**
 * 
 * @param {Object} req 
 * @param {*} customSort 
 * @returns  {Array}
 */
exports.initializeLimitPageSort = (req, customSort = null) => {
  logger.info('CommonHelper@initializeLimitPageSort');
  const page = req.query.page
    ? parseInt(req.query.page)
    : utilityConstants.enums.defaultPage;
  const limit = req.query.limit
    ? parseInt(req.query.limit)
    : utilityConstants.enums.defaultLimit;
  let sort = [];
  if (customSort) {
    sort = [sortBy,orderBy]
  }
  
  return [limit, page, sort];
};

exports.initializeQueryBuilder = (select=[],sort=[],page=utilityConstants.enums.defaultPage,limit=utilityConstants.enums.defaultLimit) =>{
const filter = {offset: limit * page - limit,  limit: limit}
if(select.length > 0){
  filter.attributes= select
}
if(sort.length > 0){
  filter.order= sort
}
return filter
}
/**
 * 
 * @param {int} page 
 * @param {int} limit 
 * @param {object} data 
 * @param {boolean} isReturnSingle 
 * @returns  {Object}
 */

exports.expressResponseHandler = (page, limit, data,totalRecords,msg) => {
  logger.info('commonHelper@expressResponseHandler');
  if(!data || totalRecords  === 0){
   return { msg: msg ? msg : utilityConstants.enums.noDataFoundMessage }
  }
  return {
    currentPage: page,
    totalRecords: totalRecords,
    perPage: limit,
    previousPage: page - 1 > 0 ? page - 1 : null,
    lastPage: Math.ceil(data.totalCount / limit),
    nextPage: data.totalCount > limit * page ? page + 1 : null,
    dataList: data ?? [],
  };
};