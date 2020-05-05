const { handler } = require('./clay_handler.js')
const util = require('util')

async function clayRunnerFunction(actionName, inputs){
  const event = {
    isTestMode: true,
    actionName,
    inputs,
    context: {}
  }
  const context = {}
  const clayHandlerResponse = await handler(event, context)
  console.log('action runner completed with output:', util.inspect(clayHandlerResponse, {depth: null, colors: true, compact: false}))
}

console.log('starting the action runner')

if(process.argv.length === 4){
  const actionName = process.argv[2]
  const sampleFilePath = process.argv[3]
  //TODO: change sample data path construction when converting to npm module
  const sampleData = require('./../' + sampleFilePath)
  if(sampleData != null){
    console.log('calling action with name:', actionName, ' and sample data:', sampleData)
    clayRunnerFunction(actionName, sampleData)
  }
  else{
    console.log('ERROR: please check the sample data file path; unable to import data from:', sampleFilePath)
  }
}
else{
  console.log('ERROR: invalid usage for action runner, please specific the action name and the sample data file path as command line arguments')
  console.log('Usage: npm run action my-action-name path/to/sample_data/file.js')
}