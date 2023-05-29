/*the purpose of this file is to make the request sent 
and have this setTrue and setFalse as part of its 
middlewares to only accept one request at a time,
instead of multiple request.*/

const newError = require("./error");

let parse = false;

exports.setTrue = (req, res, next) => {
  if (parse == true) {
    throw newError("another post request is fired up", 400);
  } else {
    parse = true;
    next();
  }
};

exports.setFalse = (req, res, next) => {
  parse = false;
};
