let ErrorCodes = {};
ErrorCodes.forbidden = [403];
ErrorCodes.unauthorised = [401];
ErrorCodes.notFound = [404];
ErrorCodes.codeError = [600];
ErrorCodes.serverErrors = [500, 501, 502, 503, 504, 400];

export default ErrorCodes;
