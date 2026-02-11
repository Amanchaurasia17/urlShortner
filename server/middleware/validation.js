const Joi = require('joi');

const schemas = {
  createUrl: Joi.object({
    originalUrl: Joi.string().uri().required().messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),
    customAlias: Joi.string()
      .pattern(/^[a-zA-Z0-9-_]+$/)
      .min(3)
      .max(20)
      .optional()
      .messages({
        'string.pattern.base': 'Custom alias can only contain letters, numbers, hyphens, and underscores',
        'string.min': 'Custom alias must be at least 3 characters long',
        'string.max': 'Custom alias cannot exceed 20 characters'
      }),
    expiresIn: Joi.number().integer().min(1).max(365).optional().messages({
      'number.min': 'Expiration must be at least 1 day',
      'number.max': 'Expiration cannot exceed 365 days'
    }),
    tags: Joi.array().items(Joi.string()).max(10).optional()
  }),

  updateUrl: Joi.object({
    tags: Joi.array().items(Joi.string()).max(10).optional(),
    expiresIn: Joi.number().integer().min(1).max(365).optional()
  })
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req.body = value;
    next();
  };
};

module.exports = { validate };
