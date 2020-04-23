const Clay = require('./clayHelper.js')

const { v4: uuidv4 } = require('uuid')

/*
 *
 * package to get a GUID
 *
 */

const guidGeneratorActionDefinition = {
  name: "guidgenerator",
  function: guid_generator_function,
  documentationUri: "http://github.com/clay-run/actions/mysecondactionguide.md",
  displayName: "GUID Generator",
  description: "This action allows the user to generate a GUID",
  actionGroups: ["Utilities"],
  inputParameterSchema: [],//we can allow empty array, null, or omitting inputParameterSchema; we'll pass 'undefined' to the action function
  outputParameterSchema:[
    {
      name: "theguid",
      type: "text"
    }
  ],
  inputSample: null,
  outputSample: {
    theguid: "b2f07c7d-29dc-4408-9012-45b8d13206e5"
  },
  isPublic: false
}


function guid_generator_function(actionInputs, context){
  const one_guid = uuidv4()
  console.log('debug: inside guid_generator_function with guid: ', one_guid, ' with type: ', typeof one_guid)
  return Clay.success(
    { theguid: one_guid }, //data output field
    one_guid //preview field
    )
}

module.exports = guidGeneratorActionDefinition