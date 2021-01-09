import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

export default function context({ req }) {
  console.log('context', req);
  let token = req.headers.authorization || '';
  token = token.replace('Bearer ', '');

  const jwtSign = (payload) =>
    jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithm: 'HS256' });
    return { person: { ...decoded }, jwtSign };
  } catch (e) {
    return { jwtSign };
  }
}
