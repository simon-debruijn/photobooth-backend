import Hashids from 'hashids';

import { HASH_ID_SALT } from '../constants';

export const hashids = new Hashids(HASH_ID_SALT, 8);
