const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUpload');
const { authentication } = require("../controllers/authController");
const {
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
} = require('../controllers/webApiController');

router.post('/addCouncilMembers', upload.single('photo'), addCouncilMember);
router.get('/getAllCouncilMembers', getAllCouncilMembers);
router.delete('/deleteCouncilmembers/:id',deleteCouncilMemberById);
router.put('/council-members/:id', upload.single('photo'), updateCouncilMember);
router.post('/addTrainerMembers', upload.single('photo'), addTrainerMember);
router.get('/getAllTrainerMembers', getAllTrainerMembers);
router.delete('/deleteTrainerMembers/:id',deleteTrainerMemberById);
router.post('/addDistrictEvents', upload.single('photo'), addDistrictEvents);
router.get('/getAllDistrictEvents', getAllDistrictEvents);
router.delete('/deleteDistrictEvents/:id',deleteDistrictEventsById);
router.post('/addClubEvents', upload.single('photo'), addClubEvents);
router.get('/getAllClubEvents', getAllClubEvents);
router.delete('/deleteClubEvents/:id',deleteClubEventsById);

module.exports = router;
