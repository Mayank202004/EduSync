/**
 * @class ApiResponse
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
