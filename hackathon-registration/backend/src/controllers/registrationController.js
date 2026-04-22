const User = require('../models/User');
const Team = require('../models/Team');
const { generateUniqueTeamCode } = require('../utils/teamCode');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the body of the registration request and returns an array of errors.
 */
function validateRegistrationBody(body) {
  const errors = [];
  const { name, email, phone, college, teamType, teamName, teamAction, teamCode } = body;

  const isMissing = (val) => !val || String(val).trim() === '';

  if (isMissing(name)) errors.push('name is required');
  
  if (isMissing(email)) {
    errors.push('email is required');
  } else if (!EMAIL_REGEX.test(String(email).trim())) {
    errors.push('email must be a valid email address');
  }

  if (isMissing(phone)) errors.push('phone is required');
  if (isMissing(college)) errors.push('college is required');

  if (!['solo', 'team'].includes(teamType)) {
    errors.push('teamType must be "solo" or "team"');
  } else if (teamType === 'team') {
    if (!['create', 'join'].includes(teamAction)) {
      errors.push('teamAction must be "create" or "join" when teamType is "team"');
    }
    if (teamAction === 'create' && isMissing(teamName)) {
      errors.push('teamName is required when creating a team');
    }
    if (teamAction === 'join' && isMissing(teamCode)) {
      errors.push('teamCode is required when joining a team');
    }
  }

  return errors;
}

/**
 * Strips out internal mongoose properties (like __v) from documents.
 */
function formatDocument(doc) {
  if (!doc) return null;
  const formatted = doc.toObject ? doc.toObject() : { ...doc };
  delete formatted.__v;
  return formatted;
}

/**
 * Handles the registration of a solo participant.
 */
async function handleSoloRegistration(userData, res) {
  const user = await User.create({ ...userData, team: null });
  return sendSuccessResponse(res, user, null);
}

/**
 * Handles the logic required to create a new team, register the team creator, 
 * and associate them together. Rolls back the team creation if user creation fails.
 */
async function handleTeamCreation(userData, teamName, res) {
  const code = await generateUniqueTeamCode();
  const team = await Team.create({
    teamName: String(teamName).trim(),
    teamCode: code,
    members: [],
  });

  try {
    const user = await User.create({ ...userData, team: team._id });
    await Team.findByIdAndUpdate(team._id, { $push: { members: user._id } });
    
    const updatedTeam = await Team.findById(team._id).lean();
    return sendSuccessResponse(res, user, updatedTeam);
  } catch (err) {
    await Team.findByIdAndDelete(team._id); // Rollback team creation
    throw err;
  }
}

/**
 * Handles the logic for joining an existing team via team code.
 */
async function handleTeamJoin(userData, teamCode, res) {
  const code = String(teamCode).trim().toUpperCase();
  const team = await Team.findOne({ teamCode: code });

  if (!team) {
    return res.status(404).json({ success: false, message: 'No team found with that team code' });
  }

  const user = await User.create({ ...userData, team: team._id });
  await Team.findByIdAndUpdate(team._id, { $push: { members: user._id } });
  
  const updatedTeam = await Team.findById(team._id).lean();
  return sendSuccessResponse(res, user, updatedTeam);
}

/**
 * Standard utility to dispatch formatted successful responses.
 */
function sendSuccessResponse(res, user, team) {
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: formatDocument(user),
    team: formatDocument(team),
  });
}

/**
 * Main Controller handling the registration execution path.
 */
async function registerUser(req, res) {
  const errors = validateRegistrationBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  const { name, email, phone, college, branch, year, teamType, teamName, teamAction, teamCode } = req.body;
  const emailNormalized = String(email).trim().toLowerCase();

  try {
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email is already registered' });
    }

    const userData = {
      name: String(name).trim(),
      email: emailNormalized,
      phone: String(phone).trim(),
      college: String(college).trim(),
      paymentStatus: 'pending',
    };
    
    if (branch?.trim()) userData.branch = branch.trim();
    if (year?.trim()) userData.year = year.trim();

    if (teamType === 'solo') {
      return await handleSoloRegistration(userData, res);
    }
    
    if (teamAction === 'create') {
      return await handleTeamCreation(userData, teamName, res);
    } 
    
    return await handleTeamJoin(userData, teamCode, res);
    
  } catch (err) {
    if (err.code === 11000) {
      const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'field';
      return res.status(409).json({ success: false, message: `Duplicate value for ${field}` });
    }
    console.error('registerUser error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
}

module.exports = { registerUser };
