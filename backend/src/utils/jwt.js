import { JWT_SECRET } from './../config';
import jwt from 'jsonwebtoken';

export const createTokenFor = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
};

export const verifyToken = (token) => {
  const cleanedUpToken = token.startsWith('Bearer')
    ? token.replace('Bearer ', '')
    : token;
  return jwt.verify(cleanedUpToken, JWT_SECRET, {
    algorithm: 'HS256',
  });
};
