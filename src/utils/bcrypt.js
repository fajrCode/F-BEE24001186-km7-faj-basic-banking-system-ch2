//if yout want to use encryption/hashing you can use basic example as below
import bcrypt from 'bcrypt';

const salt = 11;

const hashSync = (pw) => {
  return bcrypt.hash(pw, salt);
};

const compare = (pw, hash) => {
  return bcrypt.compare(pw, hash);
};

export default {hash, compare}
