/**
 * @class ApiResponse
 * @desc A class to standardize API responses.
 * @property {number} statusCode - HTTP status code of the response.
 * @property {Object} data - The data to be returned in the response.
 * @property {String} message - A message describing the response.
 * @property {boolean} success - Indicated whether the request was successful or
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
