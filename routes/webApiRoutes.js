const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUpload');
const { authentication } = require("../controllers/authController");
const {
  addCouncilMember,
  getAllCouncilMembers,
  deleteCouncilMemberById
} = require('../controllers/webApiController');

router.post('/addCouncilMembers', upload.single('photo'), addCouncilMember);
router.get('/getAllCouncilMembers', getAllCouncilMembers);
router.delete('/deleteCouncilmembers/:id',deleteCouncilMemberById);

module.exports = router;
