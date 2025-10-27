require('dotenv').config();
const {getUser, sendCode, signIn, signUp, getPassword, checkPassword} = require('../utils/mtProtoAuth');
const {askQuestion} = require('../utils/askQuestion');

const mtProtoAuthorize = async () => {
  const user = await getUser();

  const phone = process.env.TELEGRAM_CLIENT_PHONE;

  if (!user) {
    const {phone_code_hash} = await sendCode(phone);

    const code = await askQuestion('Введіть код авторизації, отриманий у Telegram: ');

    try {
      const signInResult = await signIn({
        code,
        phone,
        phone_code_hash,
      });

      if (signInResult._ === 'auth.authorizationSignUpRequired') {
        await signUp({
          phone,
          phone_code_hash,
        });
      }
    } catch (error) {
      const password = await askQuestion('Введіть пароль: ');

      const {srp_id, current_algo, srp_B} = await getPassword();
      const {g, p, salt1, salt2} = current_algo;

      const {A, M1} = await mtproto.crypto.getSRPParams({
        g,
        p,
        salt1,
        salt2,
        gB: srp_B,
        password,
      });

      await checkPassword({srp_id, A, M1});
    }
  }
};

module.exports = mtProtoAuthorize;
