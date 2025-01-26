
import { hashSync, compareSync } from 'bcryptjs';

// const password = 'Pa$$w0rd'
const password = 'pwabc'

const hash = hashSync( password, 8 );
console.log( hash )

const compare = compareSync( password, hash );
console.log( compare )