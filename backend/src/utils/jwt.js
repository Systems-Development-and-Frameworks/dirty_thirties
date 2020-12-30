require('dotenv').config();
import jwt from 'jsonwebtoken';

const LOCAL_JWT_KEY = "a20e136e4925467fca61e3f17fabf8de58d7087f";

export const createTokenFor = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_KEY || LOCAL_JWT_KEY,
    { algorithm: 'HS256' }
  );
};

export const verifyToken = (token) => {
  const cleanedUpToken = token.startsWith('Bearer')
    ? token.replace('Bearer ', '')
    : token;
  return jwt.verify(cleanedUpToken, process.env.JWT_KEY || LOCAL_JWT_KEY, {
    algorithm: 'HS256',
  });
};