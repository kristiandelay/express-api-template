const logRequestBody = (req, res, next) => {
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
  };
  
  module.exports = logRequestBody;
  