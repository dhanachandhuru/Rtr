const path = require("path");
const fs = require("fs");
const council_members = require('../db/models/web_council_members');
const trianer_members = require('../db/models/web_trainers')
const district_events = require('../db/models/web_district_events')
// const club_events = require('../db/models/club_events')
const web_club_events = require('../db/models/web_club_events')

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




////District events
const addDistrictEvents = async (req, res, next) => {
  try {
    const { eventName, topic, venue, date, hostedBy } = req.body;

    // Check required text fields
    if (!eventName || !topic || !venue || !date || !hostedBy ) {
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

    const newEvent = await district_events.create({
      eventName, 
      topic, venue, 
      date, 
      hostedBy,
      photo
    });

    return res.status(201).json({
      message: 'District Event added successfully',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
};


// Get all council members
const getAllDistrictEvents = async (req, res, next) => {
  try {
    const events = await district_events.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// Delete council member by ID
const deleteDistrictEventsById = async (req, res, next) => {
  try {
    const { id } = req.params;
   

    const deleted = await district_events.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'District event not found' });
    }

    res.status(200).json({ message: 'District event deleted successfully' });
  } catch (err) {
    next(err);
  }
};








////club events
const addClubEvents = async (req, res, next) => {
  try {
    const { eventName, topic, description, date, time, venue, sponsorBy } = req.body;

    // Check required text fields
    if (!eventName || !topic || !description || !date || !time || !venue || !sponsorBy ) {
      return res.status(400).json({ message: 'All fields (eventName, topic, description, date, time, venue, sponsorBy) are required' });
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

    const newEvent = await web_club_events.create({
      eventName, 
      topic, 
      description,
      time,
      date, 
      venue, 
      sponsorBy,
      photo
    });

    return res.status(201).json({
      message: 'club Event added successfully',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
};


// Get all council members
const getAllClubEvents = async (req, res, next) => {
  try {
    const events = await web_club_events.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// Delete council member by ID
const deleteClubEventsById = async (req, res, next) => {
  try {
    const { id } = req.params;
   

    const deleted = await web_club_events.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'club event not found' });
    }

    res.status(200).json({ message: 'club event deleted successfully' });
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
  updateCouncilMember,
  addDistrictEvents,
  getAllDistrictEvents,
  deleteDistrictEventsById,
  addClubEvents,
  getAllClubEvents,
  deleteClubEventsById
};
