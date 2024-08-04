import * as joi from 'joi';

import { MSG } from '../configs/strings';

const loginSchema = joi.object().keys({
  email: joi.string().email().required().messages({
    'any.required': MSG.INVALID_FIELDS,
    'string.base': MSG.INVALID_FIELDS,
    'string.email': MSG.INVALID_EMAIL_OR_PASSWORD,
    'string.empty': MSG.INVALID_FIELDS,
  }),
  password: joi.string().min(6).required().messages({
    'any.required': MSG.INVALID_FIELDS,
    'string.base': MSG.INVALID_FIELDS,
    'string.empty': MSG.INVALID_FIELDS,
    'string.min': MSG.INVALID_EMAIL_OR_PASSWORD,
  }),
});

export default loginSchema;
