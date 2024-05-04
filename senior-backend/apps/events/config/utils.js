// Function to validate query parameters
function validateQueryParams(params) {
    const errors = [];
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const valueMin = parseFloat(params.valueMin);
    const valueMax = parseFloat(params.valueMax);
  
    if (isNaN(page) || page < 1) {
      errors.push('Invalid page number');
    }
  
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Invalid limit (must be between 1 and 100)');
    }
  
    if (valueMin && isNaN(valueMin)) {
      errors.push('Invalid valueMin (must be a number)');
    }
  
    if (valueMax && isNaN(valueMax)) {
      errors.push('Invalid valueMax (must be a number)');
    }
  
    if (valueMax && valueMin && valueMax < valueMin) {
      errors.push('valueMax cannot be less than valueMin');
    }
  
    return errors;
  }
  
  module.exports = validateQueryParams;