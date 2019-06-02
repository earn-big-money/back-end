var validator = {};
// 账号
validator.checkID = function(input){
  return /^[a-zA-Z][0-9a-zA-Z_]{4,6}[0-9a-zA-Z_]$/.test(input) || !input;
};
validator.checkPassword = function(input){
  return /^[a-zA-Z0-9_\-][0-9a-zA-Z_\-]{4,10}[0-9a-zA-Z_\-]$/.test(input) || !input;
};

// 手机
validator.checkPhone = function(input){
  return /^[1-9][0-9]{9}[0-9]$/.test(input) || !input;
};
// 邮箱
validator.checkEmail = function(input){
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(input) || !input;
};

module.export = validator;