const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = internalError('Invalid username or password', exports.INVALID_USER);

exports.NOT_FOUND = 'not_found';
exports.notFound = internalError('Not found', exports.NOT_FOUND);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
