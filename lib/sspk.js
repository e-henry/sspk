'use strict'
const yaml = require('js-yaml')
const fs = require('fs')
const Joi = require('joi')

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
      verifySchema(students[i])
    }
  } else {
    throw new Error('The file has no entry')
  }
  return students
}

module.exports = {loadStudents, verifySchema, verify}
