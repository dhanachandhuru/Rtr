const path = require('path');
const council_members = require('../db/models/web_council_members');
const trianer_members = require('../db/models/web_trainers')

const addCouncilMember = async (req, res, next) => {
  try {
    const { name, role, position } = req.body;

    // Check required text fields
    if (!name || !role || !position) {
      return res.status(400).json({ message: 'All fields (name, role, position) are required' });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required and must be jpg, jpeg, or png format' });
    }

    // Validate extension
    const ext = path.extname(req.file.originalname).toLowerCase();
    const validTypes = ['.jpg', '.jpeg', '.png'];
    if (!validTypes.includes(ext)) {
      return res.status(400).json({ message: 'Invalid file type. Only jpg, jpeg, and png are allowed.' });
    }

    const photo = req.file.filename;

    const newMember = await council_members.create({
      name,
      role,
      position,
      photo
    });

    return res.status(201).json({
      message: 'Council Member added successfully',
      data: newMember
    });
  } catch (err) {
    next(err);
  }
};


const updateCouncilMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, position } = req.body;

    // Validate text fields
    if (!name || !role || !position) {
      return res.status(400).json({ message: 'All fields (name, role, position) are required' });
    }

    // Find the member to update
    const existingMember = await council_members.findByPk(id);
    if (!existingMember) {
      return res.status(404).json({ message: 'Council member not found' });
    }

    let photo = existingMember.photo;

    // If new image is uploaded
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const validTypes = ['.jpg', '.jpeg', '.png'];
      if (!validTypes.includes(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only jpg, jpeg, and png are allowed.' });
      }

      // Delete old photo if it exists
      const oldPhotoPath = path.join(__dirname, '../uploads', existingMember.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }

      photo = req.file.filename;
    }

    // Update the record
    await council_members.update(
      { name, role, position, photo },
      { where: { id } }
    );

    const updatedMember = await council_members.findByPk(id);

    return res.status(200).json({
      message: 'Council Member updated successfully',
      data: updatedMember
    });
  } catch (err) {
    next(err);
  }
};



// Get all council members
const getAllCouncilMembers = async (req, res, next) => {
  try {
    const members = await council_members.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

// Delete council member by ID
const deleteCouncilMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
   

    const deleted = await council_members.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Council Member not found' });
    }

    res.status(200).json({ message: 'Council Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};





///trainer members

const addTrainerMember = async (req, res, next) => {
  try {
    const { trainerName, club, zone } = req.body;

    // Check required text fields
    if (!trainerName || !club || !zone) {
      return res.status(400).json({ message: 'All fields (name, role, position) are required' });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required and must be jpg, jpeg, or png format' });
    }

    // Validate extension
    const ext = path.extname(req.file.originalname).toLowerCase();
    const validTypes = ['.jpg', '.jpeg', '.png'];
    if (!validTypes.includes(ext)) {
      return res.status(400).json({ message: 'Invalid file type. Only jpg, jpeg, and png are allowed.' });
    }

    const photo = req.file.filename;

    const newMember = await trianer_members.create({
      trainerName,
      club,
      zone,
      photo
    });

    return res.status(201).json({
      message: 'Trainer Member added successfully',
      data: newMember
    });
  } catch (err) {
    next(err);
  }
};


// Get all council members
const getAllTrainerMembers = async (req, res, next) => {
  try {
    const members = await trianer_members.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

// Delete council member by ID
const deleteTrainerMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
   

    const deleted = await trianer_members.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Trainer Member not found' });
    }

    res.status(200).json({ message: 'Trainer Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCouncilMember,
  getAllCouncilMembers,
  deleteCouncilMemberById,
  addTrainerMember,
  getAllTrainerMembers,
  deleteTrainerMemberById,
  updateCouncilMember
};
