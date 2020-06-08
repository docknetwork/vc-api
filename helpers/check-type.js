module.exports = function(result) {
  if (result.proof) {
    return 'proof';
  }

  return 'unknown';
};
