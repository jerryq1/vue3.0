//邮箱
export function validateUsername(rule, value, callback) {
  let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else if (!reg.test(value)) {
    callback(new Error('用户名格式不对'));
  } else {
    callback();
  }
};

//密码
export function validatePass(rule, value, callback) {
  let reg = /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (!reg.test(value)) {
    callback(new Error('密码格式不对'));
  } else {
    callback();
  }
};

//6位纯数字
export function validateCode(rule, value, callback) {
  let reg = /^[a-z0-9]{6}$/
  if (value === '') {
    callback(new Error('验证码不能为空'));
  } else if (!reg.test(value)) {
    callback(new Error('验证码格式不正确'));
  }
};
