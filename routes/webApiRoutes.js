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
  updateCouncilMember
} = require('../controllers/webApiController');

router.post('/addCouncilMembers', upload.single('photo'), addCouncilMember);
router.get('/getAllCouncilMembers', getAllCouncilMembers);
router.delete('/deleteCouncilmembers/:id',deleteCouncilMemberById);
router.put('/council-members/:id', upload.single('photo'), updateCouncilMember);
router.post('/addTrainerMembers', upload.single('photo'), addTrainerMember);
router.get('/getAllTrainerMembers', getAllTrainerMembers);
router.delete('/deleteTrainerMembers/:id',deleteTrainerMemberById);

module.exports = router;
