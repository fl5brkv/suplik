import {customAlphabet} from 'nanoid';

const alphabet = '346789ABCDEFGHJKLMNPQRTUVWXY';
const nanoid = customAlphabet(alphabet, 8);

export default function () {
  return nanoid();
}
