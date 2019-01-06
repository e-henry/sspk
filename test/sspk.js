'use strict'
const tap = require('tap')
const app = require('../lib/sspk.js')

tap.test('file loading', (t) => {
  const expect = new Error("ENOENT: no such file or directory, open 'toto'")
  //expect.name = 'Error'
  expect.code = 'ENOENT'
  expect.syscall = 'open'
  expect.path = 'toto'
  expect.errno = -2
  tap.throws(() => {
    app.loadStudents('toto')
  }, expect)
  //tap.throws(app.loadStudents('test/notthere.yml'), prop, 'Throws ENOENT when the file does not exist')
  //tap.throws(app.loadStudents('test/notthere.yml'), Error, {message: 'Error: ENOENT: no such file or directory, open \'test/notthere.yml\''})

  let wanted = [{
    ssh_pub_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC22UDTnx2+UvsE96VGNFq47U9oZgy4pv0BUhNhw0JbyNlGp5M+q2g0bjvIvHNS2r2+QubayZCQZ8GoPWUPEBIy2XbwHGQgasQsGaYvIB175p6fzjINANhTHzBYBFViTZPKvDBBV/qwFa/yv63QYOWl39int5rt9g7rnLeKhYuNiakat0yCghA5shxcrNF3ElcReY3w/EKg1iBaHqIfzN+ziqZVS3NL7/0ztZgKX+weGp7eltC1XC/EnYy1yS2xyOMb3o11m+FamrK9RZ4nI3o06B8yc8Dl3IYssWhDzLb1S/zgkzMdWPR8dUGlwzIQqXbwQhnE6YcQyPLP9T8iI8SskAF4oBaIfQwavfJTa+T3hNX/NqWfqU6GcU+BV6wegb3K2KiJ7xdpQTXyKE6hGYPJB3jdWVVB0R+m4k2of9c6AD/v++Ezs/S2hcKAWsRgrqomqz/XH0OizuMZZtWsh8WLO/d4ycs2jUauSgJSUZcUhAMTeAvDaxQSSxqj8E4dgP1FjQmzVxhnd/9kaL8prLmjYjD5AqNrT+EQ0TxunBbmyl3Oc8ueLbNHvBUI/YMMDWlSjpWKwFyFncie3i8+BlDFn4/5g2DABkOUHArl4YxuO8k2734U/FHUcSNQTw4xnyZKD9kRB7WPUv25KpJyAQP3BamhYquisf1GEJygyBR5iQ== me@mycomputer',
    github_account: 'e-henry',
    gitlab_account: 'e-henry',
    name: 'Me'
  }]
  let found = app.loadStudents('test/OK.yml')
  t.same(found, wanted)

  let notWanted = [{
    ssh_pub_key: 'ssh-rsa AAAAB3zaC1yc2EAAAADAQABAAACAQC22UDTnx2+UvsE96VGNFq47U9oZgy4pv0BUhNhw0JbyNlGp5M+q2g0bjvIvHNS2r2+QubayZCQZ8GoPWUPEBIy2XbwHGQgasQsGaYvIB175p6fzjINANhTHzBYBFViTZPKvDBBV/qwFa/yv63QYOWl39int5rt9g7rnLeKhYuNiakat0yCghA5shxcrNF3ElcReY3w/EKg1iBaHqIfzN+ziqZVS3NL7/0ztZgKX+weGp7eltC1XC/EnYy1yS2xyOMb3o11m+FamrK9RZ4nI3o06B8yc8Dl3IYssWhDzLb1S/zgkzMdWPR8dUGlwzIQqXbwQhnE6YcQyPLP9T8iI8SskAF4oBaIfQwavfJTa+T3hNX/NqWfqU6GcU+BV6wegb3K2KiJ7xdpQTXyKE6hGYPJB3jdWVVB0R+m4k2of9c6AD/v++Ezs/S2hcKAWsRgrqomqz/XH0OizuMZZtWsh8WLO/d4ycs2jUauSgJSUZcUhAMTeAvDaxQSSxqj8E4dgP1FjQmzVxhnd/9kaL8prLmjYjD5AqNrT+EQ0TxunBbmyl3Oc8ueLbNHvBUI/YMMDWlSjpWKwFyFncie3i8+BlDFn4/5g2DABkOUHArl4YxuO8k2734U/FHUcSNQTw4xnyZKD9kRB7WPUv25KpJyAQP3BamhYquisf1GEJygyBR5iQ== me@mycomputer',
    github_account: 'e-henry',
    gitlab_account: 'e-henry',
    name: 'Me'
  }]
  t.notSame(found, notWanted, 'Check that an error in the file is detected')
  t.end()
})


tap.test('Validating entries', (t) => {
  let good = {
    ssh_pub_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC22UDTnx2+UvsE96VGNFq47U9oZgy4pv0BUhNhw0JbyNlGp5M+q2g0bjvIvHNS2r2+QubayZCQZ8GoPWUPEBIy2XbwHGQgasQsGaYvIB175p6fzjINANhTHzBYBFViTZPKvDBBV/qwFa/yv63QYOWl39int5rt9g7rnLeKhYuNiakat0yCghA5shxcrNF3ElcReY3w/EKg1iBaHqIfzN+ziqZVS3NL7/0ztZgKX+weGp7eltC1XC/EnYy1yS2xyOMb3o11m+FamrK9RZ4nI3o06B8yc8Dl3IYssWhDzLb1S/zgkzMdWPR8dUGlwzIQqXbwQhnE6YcQyPLP9T8iI8SskAF4oBaIfQwavfJTa+T3hNX/NqWfqU6GcU+BV6wegb3K2KiJ7xdpQTXyKE6hGYPJB3jdWVVB0R+m4k2of9c6AD/v++Ezs/S2hcKAWsRgrqomqz/XH0OizuMZZtWsh8WLO/d4ycs2jUauSgJSUZcUhAMTeAvDaxQSSxqj8E4dgP1FjQmzVxhnd/9kaL8prLmjYjD5AqNrT+EQ0TxunBbmyl3Oc8ueLbNHvBUI/YMMDWlSjpWKwFyFncie3i8+BlDFn4/5g2DABkOUHArl4YxuO8k2734U/FHUcSNQTw4xnyZKD9kRB7WPUv25KpJyAQP3BamhYquisf1GEJygyBR5iQ== me@mycomputer',
    github_account: 'e-henry',
    gitlab_account: 'e-henry',
    name: 'Moi'
  }
  t.doesNotThrow(() => {
    app.verifySchema(good)
  }, 'Verify that an entry in the the yaml schema is valid')

  t.same(app.verifySchema(good), true, 'verifySchema retruns true on success')

  t.throws(() => {
    let bad = {
      ssh_pub_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC22UDTnx2+UvsE96VGNFq47U9oZgy4pv0BUhNhw0JbyNlGp5M+q2g0bjvIvHNS2r2+QubayZCQZ8GoPWUPEBIy2XbwHGQgasQsGaYvIB175p6fzjINANhTHzBYBFViTZPKvDBBV/qwFa/yv63QYOWl39int5rt9g7rnLeKhYuNiakat0yCghA5shxcrNF3ElcReY3w/EKg1iBaHqIfzN+ziqZVS3NL7/0ztZgKX+weGp7eltC1XC/EnYy1yS2xyOMb3o11m+FamrK9RZ4nI3o06B8yc8Dl3IYssWhDzLb1S/zgkzMdWPR8dUGlwzIQqXbwQhnE6YcQyPLP9T8iI8SskAF4oBaIfQwavfJTa+T3hNX/NqWfqU6GcU+BV6wegb3K2KiJ7xdpQTXyKE6hGYPJB3jdWVVB0R+m4k2of9c6AD/v++Ezs/S2hcKAWsRgrqomqz/XH0OizuMZZtWsh8WLO/d4ycs2jUauSgJSUZcUhAMTeAvDaxQSSxqj8E4dgP1FjQmzVxhnd/9kaL8prLmjYjD5AqNrT+EQ0TxunBbmyl3Oc8ueLbNHvBUI/YMMDWlSjpWKwFyFncie3i8+BlDFn4/5g2DABkOUHArl4YxuO8k2734U/FHUcSNQTw4xnyZKD9kRB7WPUv25KpJyAQP3BamhYquisf1GEJygyBR5iQ== me@mycomputer',
      github_account: 'e-henry',
      gitlab_account: 'e-henry',
      name: 'Me'
    }
    app.verifySchema(bad)
  }, {message: 'child "name" fails because ["name" length must be at least 3 characters long]'}, 'Verify that an entry in the the yaml schema is valid')
  t.end()
})

tap.test('Validating full file', (t) => {
  t.doesNotThrow(() => {
    app.verify('test/OKx3.yml')
  }, 'validates correct file')

  t.throws(() => {
    app.verify('test/KO.yml')
  }, {message: '"name" length must be at least 3 characters long'}, 'throws on incorrect file')

  t.throws(() => {
    app.verify('test/empty.yml')
  }, new Error('The file has no entry', 'throws on incorrect file'))
  t.end()
})
