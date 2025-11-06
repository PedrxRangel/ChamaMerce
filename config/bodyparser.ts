import { defineConfig } from '@adonisjs/core/bodyparser'

const bodyParserConfig = defineConfig({
  /**
   * Allow method spoofing via _method field
   * Enables PUT, PATCH, DELETE requests via POST forms
   */
  // @ts-ignore - Property exists but not in type definition
  allowMethodSpoofing: true, // 👈 ADICIONE ESTA LINHA

  /**
   * The bodyparser middleware will parse the request body
   * for the following HTTP methods.
   */
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * Config for the "application/x-www-form-urlencoded"
   * content-type parser
   */
  form: {
    convertEmptyStringsToNull: true,
    types: ['application/x-www-form-urlencoded'],
  },

  /**
   * Config for the JSON parser
   */
  json: {
    convertEmptyStringsToNull: true,
    types: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
    ],
  },

  /**
   * Config for the "multipart/form-data" content-type parser.
   * File uploads are handled by the multipart parser.
   */
  multipart: {
    /**
     * Enabling auto process allows bodyparser middleware to
     * move all uploaded files inside the tmp folder of your
     * operating system
     */
    autoProcess: true,
    convertEmptyStringsToNull: true,
    processManually: [],

    /**
     * Maximum limit of data to parse including all files
     * and fields
     */
    limit: '20mb',
    types: ['multipart/form-data'],
  },
})

export default bodyParserConfig