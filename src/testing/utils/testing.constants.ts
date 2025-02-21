import * as Joi from 'joi';

export const TEST_ENV_VALIDATION_SCHEMA = Joi.object({
  DATASOURCE_PASSWORD: Joi.required(),
  DATASOURCE_USERNAME: Joi.required(),
  DATASOURCE_HOST: Joi.required(),
  DATASOURCE_PORT: Joi.number().integer().positive().required(),
  DATASOURCE_DATABASE: Joi.required(),
  DATASOURCE_URL: Joi.required(),
});
