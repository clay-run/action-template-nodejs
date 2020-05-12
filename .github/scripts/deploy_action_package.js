/*
 * packages for local file manipulation
 */
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

/*
 * package for http request
 */
const superagent = require('superagent')

async function deployActionPackage(){
  try {
    console.log('Deploying action package')

    //set the correct API uri for http request
    let API_HOST = 'https://api.clay.run/v1'
    if(process.env.ENV == 'staging') {
        API_HOST = 'https://staging.clay.run/v1'
        console.log('Using staging environment', API_HOST)
    }
    else if(process.env.ENV == 'local') {
        API_HOST = 'http://localhost:3001/v1'
        console.log('Using local environment', API_HOST)
    }
    else if(process.env.ENV != null){
        API_HOST = 'https://' + process.env.ENV + '.clay.run/v1'
        console.log('Using custom branch environment', API_HOST)
    }

    //get the API token
    let API_TOKEN = null
    if(process.env.API_TOKEN){
      if(process.env.API_TOKEN && typeof process.env.API_TOKEN == 'string' && 'api_token' in JSON.parse(process.env.API_TOKEN ) ){
        API_TOKEN = JSON.parse(process.env.API_TOKEN).api_token
      }
    }

    const actionPackageIndexFilePath = path.resolve('./src/index.js')
    console.log('Attempting to locate action package definition in:', actionPackageIndexFilePath)
    if(!fs.existsSync(actionPackageIndexFilePath) ){
      console.log('ERROR: could not find action package definition in:', actionPackageIndexFilePath)
      return
    }

    const actionPackageDefinition = require(actionPackageIndexFilePath)
    const actionPackageName = actionPackageDefinition.name
    if(!actionPackageName){
      console.log('ERROR: could not find action package name in :', actionPackageIndexFilePath)
      return
    }
    console.log('Found action package with name:', actionPackageName)

    const actionPackageTmpDir = path.resolve('./clay_zipped_action_packages/')
    console.log('Creating temporary directory for zipping action package:', actionPackageTmpDir)
    if(!fs.existsSync(actionPackageTmpDir) ){
      fs.mkdirSync(actionPackageTmpDir)
    }
    const actionPackageZipFilePath = path.resolve(actionPackageTmpDir, 'action_package_' + Date.now() + '.zip')

    console.log('Creating zip file for action package.')

    const archive = archiver.create('zip', {})
    const output = fs.createWriteStream(actionPackageZipFilePath)
    output.on('close', async function() {
      console.log('created zip file of size ' + archive.pointer() + ' bytes')
      console.log('deploying zipped action package')

      try {
        let response = await superagent
          .post(API_HOST + '/actions')
          .set('Authorization', API_TOKEN)
          .attach('actionPackageZipFile',actionPackageZipFilePath)
          .field('actionPackageDefinition', JSON.stringify(actionPackageDefinition) )

        const success = response.body.success
        if(success) {
          console.log('Action package deployed: ', response.body)
          return
        }
        else {
          console.log('Error while deploying action package' )
          if('body' in response){
            console.log('Action package error: ', response.body)
          }
          else {
            console.log('Action package error: ', response)
          }
          return
        }
      }
      catch (err){
        console.log('Error while sending action package' )
        if('response' in err){
          console.log('Action package error: ', err.response.body)
        }
        else {
          console.log('Action package error: ', err)
        }
        return
      }

    })

    archive.on('warning', function(err) {
      if(err.code === 'ENOENT') {
        console.log('WARNING: zipping ENOENT:', err)
      } else {
        console.log('WARNING: zipping:', err)
      }
      return
    })

    archive.on('error', function(err) {
      console.log('ERROR: could not zip directory with error:', err)
      return
    })

    archive.pipe(output)
    const clayHandlerFile = 'const { ClayHandler } = require(\'@clay-run/clay-action-client\');exports.handler = ClayHandler'
    archive.append(clayHandlerFile, { name: 'clay.js' })

    const actionPackageSrcDirectoryPath = path.resolve('./src/')
    const actionPackageNodeModulesDirectoryPath = path.resolve('./node_modules/')
    archive.directory(actionPackageSrcDirectoryPath, 'src')
    archive.directory(actionPackageNodeModulesDirectoryPath, 'node_modules')
    archive.finalize()
  }
  catch (err){
    console.log('ERROR: failed to deploy action package with error:', err)
  }
}

deployActionPackage()