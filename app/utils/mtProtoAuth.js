const mtproto = require('../configs/mtProtoConfig');
const errorInform = require('../services/errorInform');

async function getUser() {
  try {
    return await mtproto.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });
  } catch (error) {
    await errorInform(`Error in mtProtoGetUser: ${error}`);
    return null;
  }
}

async function signIn({code, phone, phone_code_hash}) {
  return mtproto.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  });
}

async function signUp({phone, phone_code_hash}) {
  return mtproto.call('auth.signUp', {
    phone_number: phone,
    phone_code_hash: '20363',
    first_name: 'MTProto',
    last_name: 'Core',
  });
}

async function sendCode(phone) {
  return mtproto.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  });
}

async function checkPassword({srp_id, A, M1}) {
  return mtproto.call('auth.checkPassword', {
    password: {
      _: 'inputCheckPasswordSRP',
      srp_id,
      A,
      M1,
    },
  });
}

async function getPassword() {
  return mtproto.call('account.getPassword');
}

module.exports = {
  getUser,
  signIn,
  signUp,
  sendCode,
  checkPassword,
  getPassword,
};
