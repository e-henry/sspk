'use strict'
const yaml = require('js-yaml')
const fs = require('fs')
const Joi = require('joi')
const request = require('request')


const schema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(5).required(),
  ssh_pub_key: Joi.string(),
  github_account: Joi.string(),
  gitlab_account: Joi.string(),
})

function loadStudents(path) {
  // Get document, or throw exception on error
  let doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
  return doc
}

function verifySchema(object) {
  const result = Joi.validate(object, schema)
  if (result.error !== null) {
    throw result.error
  }
  return true
}

function verify(filepath) {
  let students = loadStudents(filepath)
  if (students && students.length !== 0) {
    for (let i = 0; i < students.length; i++) {
      if (verifySchema(students[i])) {
        githubAccountChecker('github.com', students[i].github_account)
          .then((res)=>{})
          .catch((err)=>{
            // console.log(err)
            throw new Error('This github account does not exist')
          })

        gitlabAccountChecker('gitlab.com', students[i].gitlab_account)
          .then((res)=>{})
          .catch((err)=>{
            // console.log(err)
            throw new Error('This gitlab account does not exist')
          })
      }
    }
  } else {
    throw new Error('The file has no entry')
  }
  return students
}

function githubAccountChecker(hostname, accountName) {
  let url = 'https://' + hostname + '/' + accountName

  return new Promise(((resolve, reject) => {
    request.get({
      url,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        // console.log('Error: ' + accountName + ', ', err)
        reject(new Error(hostname + '/' + accountName + ' :error ' + err))
      } else if (res.statusCode !== 200) {
        // console.log(accountName + ' Status:', res.statusCode)
        reject(new Error(hostname + '/' + accountName + ' : status => ' + res.statusCode))
      } else {
        resolve('true')
      }
    })
  }))
}

function gitlabAccountChecker(hostname, accountName) {
  let url = 'https://' + hostname + '/users/' + accountName + '/exists'

  return new Promise(((resolve, reject) => {
    request.get({
      url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        // console.log('Error: ' + accountName + ', ', err)
        reject(new Error(hostname + '/' + accountName + ' :error ' + err))
      } else if (res.statusCode !== 200) {
        // console.log(accountName + ' Status:', res.statusCode)
        reject(new Error(hostname + '/' + accountName + ' : status => ' + res.statusCode))
      } else {
        // data is already parsed as JSON:
        if (data.exists) {
          resolve('true')
        } else {
          reject(new Error(hostname + '/' + accountName + ' :not found'))
        }
      }
    })
  }))
}

module.exports = {loadStudents, verifySchema, verify, gitlabAccountChecker, githubAccountChecker}
