import * as Joi from 'joi';

export const ENV_VALIDATION_SCHEMA = Joi.object({
  DATASOURCE_USERNAME: Joi.required(),
  DATASOURCE_PASSWORD: Joi.required(),
  DATASOURCE_HOST: Joi.required(),
  DATASOURCE_PORT: Joi.required(),
  DATASOURCE_DATABASE: Joi.required(),

  DATASOURCE_URL: Joi.required(),

  FIREBASE_APPLICATION_CREDENTIALS: Joi.required(),
});
