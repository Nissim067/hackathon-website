const User = require('../models/User');
const Team = require('../models/Team');
const { generateUniqueTeamCode } = require('../utils/teamCode');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistrationBody(body) {
  const errors = [];

  const {
    name,
    email,
    phone,
    college,
    teamType,
    teamName,
    teamAction,
    teamCode,
  } = body;

  if (!name || String(name).trim() === '') {
    errors.push('name is required');
  }
  if (!email || String(email).trim() === '') {
    errors.push('email is required');
  } else if (!EMAIL_REGEX.test(String(email).trim())) {
    errors.push('email must be a valid email address');
  }
  if (!phone || String(phone).trim() === '') {
    errors.push('phone is required');
  }
  if (!college || String(college).trim() === '') {
    errors.push('college is required');
  }
  if (!teamType || !['solo', 'team'].includes(teamType)) {
    errors.push('teamType must be "solo" or "team"');
  }

  if (teamType === 'team') {
    if (!teamAction || !['create', 'join'].includes(teamAction)) {
      errors.push('teamAction must be "create" or "join" when teamType is "team"');
    }
    if (teamAction === 'create') {
      if (!teamName || String(teamName).trim() === '') {
        errors.push('teamName is required when creating a team');
      }
    }
    if (teamAction === 'join') {
      if (!teamCode || String(teamCode).trim() === '') {
        errors.push('teamCode is required when joining a team');
      }
    }
  }

  return errors;
}

function formatUser(userDoc) {
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.__v;
  return u;
}

function formatTeam(teamDoc) {
  if (!teamDoc) return null;
  const t = teamDoc.toObject ? teamDoc.toObject() : { ...teamDoc };
  delete t.__v;
  return t;
}

async function registerUser(req, res) {
  const errors = validateRegistrationBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  const {
    name,
    email,
    phone,
    college,
    branch,
    year,
    teamType,
    teamName,
    teamAction,
    teamCode,
  } = req.body;

  const emailNormalized = String(email).trim().toLowerCase();

  try {
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email is already registered',
      });
    }

    const baseUserData = {
      name: String(name).trim(),
      email: emailNormalized,
      phone: String(phone).trim(),
      college: String(college).trim(),
      paymentStatus: 'pending',
    };
    if (branch != null && String(branch).trim() !== '') {
      baseUserData.branch = String(branch).trim();
    }
    if (year != null && String(year).trim() !== '') {
      baseUserData.year = String(year).trim();
    }

    if (teamType === 'solo') {
      const user = await User.create({
        ...baseUserData,
        team: null,
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: formatUser(user),
        team: null,
      });
    }

    if (teamType === 'team' && teamAction === 'create') {
      const code = await generateUniqueTeamCode();
      const team = await Team.create({
        teamName: String(teamName).trim(),
        teamCode: code,
        members: [],
      });

      try {
        const user = await User.create({
          ...baseUserData,
          team: team._id,
        });

        await Team.findByIdAndUpdate(team._id, {
          $push: { members: user._id },
        });

        const teamUpdated = await Team.findById(team._id).lean();

        return res.status(201).json({
          success: true,
          message: 'Registration successful',
          user: formatUser(user),
          team: formatTeam(teamUpdated),
        });
      } catch (userErr) {
        await Team.findByIdAndDelete(team._id);
        throw userErr;
      }
    }

    if (teamType === 'team' && teamAction === 'join') {
      const code = String(teamCode).trim().toUpperCase();
      const team = await Team.findOne({ teamCode: code });
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'No team found with that team code',
        });
      }

      const user = await User.create({
        ...baseUserData,
        team: team._id,
      });

      await Team.findByIdAndUpdate(team._id, {
        $push: { members: user._id },
      });

      const teamUpdated = await Team.findById(team._id).lean();

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: formatUser(user),
        team: formatTeam(teamUpdated),
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid registration parameters',
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'field';
      return res.status(409).json({
        success: false,
        message: `Duplicate value for ${field}`,
      });
    }
    console.error('registerUser error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
}

module.exports = { registerUser };
