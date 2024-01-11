const swaggerDocument = require('./swagger.json');

exports.contract = (req, res, next) => {
  swaggerDocument.host = req.get('host');
  req.swaggerDoc = swaggerDocument;
  swaggerDocument.info = {
    title: 'Contract',
    version: '1.0',
  };
 
 
  next();
};
