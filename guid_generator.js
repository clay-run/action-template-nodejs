const ActionFunctionReturnType = require('./clay_action_function_type.js')
const ActionFunctionStatusEnum = require('./clay_action_function_status.js')
/*
 *
 * package to get a GUID
 *
 */
const { v4: uuidv4 } = require('uuid')

function guid_generator_function(actionInputs, context){
  const one_guid = uuidv4()
  console.log('debug: inside guid_generator_function with guid: ', one_guid, ' with type: ', typeof one_guid)
  return new ActionFunctionReturnType(
    { theguid: one_guid }, //data output field
    ActionFunctionStatusEnum.SUCCESS, //status field
    null, //message field
    one_guid //preview field
    )
}

module.exports = guid_generator_function