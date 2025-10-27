import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

const workflowSchema = {
  type: 'object',
  required: ['version','meta','trigger','steps'],
  properties: {
    version: { type: 'number' },
    meta: { 
      type: 'object', 
      properties: { 
        title: { type: 'string' }, 
        slug: { type: 'string' }, 
        description: { type: 'string' } 
      } 
    },
    trigger: { type: 'object' },
    steps: { type: 'array' }
  },
  additionalProperties: true
};

const validate = ajv.compile(workflowSchema);

export function validateWorkflow(data: any) {
  const valid = validate(data);
  return { valid: !!valid, errors: validate.errors };
}

