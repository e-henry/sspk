'use strict'
const yaml = require('js-yaml')
const fs = require('fs')
const Joi = require('joi')
const tls = require('tls');
const https = require('https');
const util = require('util');


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
      if(verifySchema(students[i])){
        accountGitChecker('github.com',students[i].github_account)
        .then(res=>{})
        .catch(err=>{console.log(err)});

        accountGitChecker('gitlab.com',students[i].gitlab_account)
        .then(res=>{})
        .catch(err=>{console.log(err)});
      }
    }
  } else {
    throw new Error('The file has no entry')
  }
  return students
}


function accountGitChecker (hostname, accountName){
  var check=false;
  const options = {
    hostname: hostname,
    port: 443,
    path: '/'+accountName,
    checkServerIdentity: function(host, cert) {
      const err = tls.checkServerIdentity(host, cert);
      if (err) {
        return err;
      }
      do {
        var lastprint256 = cert.fingerprint256;
        var cert = cert.issuerCertificate;
      } while (cert.fingerprint256 !== lastprint256);
    },
  };

  options.agent = new https.Agent(options);

    return new Promise(function(resolve, reject) {
      const req = https.get(options, (res) => {
        if(res.statusCode == 200){
        resolve("true");

        }
        else if (res.statusCode == 404){
          reject(new Error(hostname+"/"+accountName+" :not found"));
        }
      })
      .on('error', (e) => {
        reject(e.message);
      }).end();
    })

}



module.exports = {loadStudents, verifySchema, verify, accountGitChecker}
