const crypto = require('crypto');
const Team = require('../models/Team');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 25;

/**
 * Generates a random team code and ensures it is unique in the database.
 */
async function generateUniqueTeamCode() {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const bytes = crypto.randomBytes(CODE_LENGTH);
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      code += ALPHABET[bytes[i] % ALPHABET.length];
    }
    const exists = await Team.exists({ teamCode: code });
    if (!exists) {
      return code;
    }
  }

  throw new Error('Could not generate a unique team code');
}

module.exports = { generateUniqueTeamCode };
