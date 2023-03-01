module.exports = (data, status) => {
  const err = new Error(data);
  err.status = status;
  console.log(err.message)
  return err;
};
