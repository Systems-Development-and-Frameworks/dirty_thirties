require('dotenv').config();
import jwt from 'jsonwebtoken';

export const createTokenFor = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_KEY,
    { algorithm: 'HS256' }
  );
};

export const verifyToken = (token) => {
  const cleanedUpToken = token.startsWith('Bearer')
    ? token.replace('Bearer ', '')
    : token;
  return jwt.verify(cleanedUpToken, process.env.JWT_KEY, {
    algorithm: 'HS256',
  });
};