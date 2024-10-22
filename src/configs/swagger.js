import { SPEC_OUTPUT_FILE_BEHAVIOR } from 'express-oas-generator';
import set from 'lodash';

const swaggerConfig = {
  predefinedSpec: function (spec) {
    set(spec, 'securityDefinitions.bearerAuth', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Please enter your token with 'Bearer ' prefix (e.g., 'Bearer your-token-here').",
    });
    set(spec, 'security', [{ bearerAuth: [] }]);
    set(spec, 'schemes', ['https', 'http']);
    return spec;
  },
  swaggerUiServePath: 'v1/api-docs',
  specOutputPath: 'src/docs/swagger_output.json',
  ignoredNodeEnvironments: ['production', 'qa'],
  alwaysServeDocs: false,
  tags: ['items', 'orders'],
  specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE,
};

export default swaggerConfig;