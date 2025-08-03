// auth controllers
const club_details = require("../db/models/club_details")
const login_details = require("../db/models/login_details")
const bcrypt = require("bcrypt") 
const jwt = require("jsonwebtoken")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const user_details = require("../db/models/user_details")
const { Op } = require('sequelize');
// const sequelize_db = require('../config/config.js'); // adjust path as needed


const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
}

// login
const login = catchAsync(async (req, res, next) => {
    const { userEmail, userPassword } = req.body

    if (!userEmail || !userPassword) {
        next(new AppError("Email and password required", 400))
    }
    const dataValues = await login_details.findOne({ where: { userEmail } })
    if (!dataValues) {
        next(new AppError("Email not registered", 400))
    }
    else {
        const result = dataValues.dataValues
        const isPasswordMatch = await bcrypt.compare(userPassword, result.userPassword)
        if (!isPasswordMatch) {
            next(new AppError("Password is incorrect", 400))
        }
        else {
            // fetch the user data from the table
            // if club  profile. get the club id 
            const userType = String(result.userType);
            let userData;
            if (userType == 3) {
                userData = await club_details.findOne({ where: { id: result.clubId, } })
            }
            // else get the user id
            else {
                userData = await user_details.findOne({ where: { id: result.userId, } })
            }
            if (!userData) {
                next(new AppError("User data not found", 401))
            }
            const token = generateToken({
                userId: userData.id,
                userType: result.userType,
                cabinetDesignation: userData.designation != undefined ? userData.designation : null
            })
            userData.userEmail = result.userEmail
            res.status(200).json({
                status: "success",
                token: token,
            })
        }
    }

})

// create user 
const signup = catchAsync(async (req, res, next) => {
    const body = req.body
    // console.log(!body)
    // console.log(!((body.userType == 1) || (body.userType == 2) || (body.userType == 3) || (body.userType == 4)) )
    // necessary validations
    const userType = String(body.userType);
    if (
        // if body is not present
        !body ||
        // user type should be any of the 4 types (1,2,3,4)
        !(['1','2','3','4','5'].includes(userType)) ||
        // password should be 8 chars long
        body.userPassword.length < 8
    ) {

        return next(new AppError("Bad request Try again", 400))
    }
    email = body.userEmail
    // check if the email is already registered
    const result = await login_details.findOne({where:{ userEmail:email }})
    if(result){
        return next(new AppError("Email already registered",401))
    }
    
    // create new club if it is a club account (type 3)
    if (userType === '3') {
        const new_club = await club_details.create({
            clubName: body.clubName,
            charterId: body.charterId,
            charterDate: body.charterDate,
            groupId: body.groupId,
            clubLogo: body.clubLogo,
            presidentId: body.presidentId,
            clubType: body.clubType,
            userMobile: body.userMobile,
            secretaryId: body.secretaryId,
            installationDate: body.installationDate,
            parentRotaryName: body.parentRotaryName,
            staffCoordinator: body.staffCoordinator,
            staffCoordinatorNumber: body.staffCoordinatorNumber,
            assets: body.assets,
            facebookHandle: body.facebookHandle,
            instagramHandle: body.instagramHandle,
            linkedinHandle: body.linkedinHandle,
            clubCapacity:0,
            isApproved: false
        })
        if (new_club) {
            // encrypt the password
            const hashedPassword = bcrypt.hashSync(body.userPassword, 10)

            // create a login data in login_details table
            const newlogin_detail = await login_details.create({
                userType: body.userType,
                userEmail: body.userEmail,
                userPassword: hashedPassword,
                clubId: new_club.id,
                isApproved: false
            })
            // send error if no login created
            if (!newlogin_detail) {
                return next(new AppError("Account creation failed", 400))
            }
            else {
                // new user data will not have email of the user
                new_club.email = newlogin_detail.userEmail
                return res.status(201).json({
                    status: "success",
                    data: new_club,
                })
            }
        }
        else {
            return next(new AppError("Account Creation failed", 400))
        }

    }
    // create a new user detail if it is a user account
    else {
        const new_user = await user_details.create({
            userName: body.userName,
            riId: body.riId,
            isBoardMember: body.isBoardMember,
            designation: body.designation,
            clubId: body.clubId,
            userMobile: body.userMobile,
            bloodGroup: body.bloodGroup,
            yearOfRotraction: body.yearOfRotraction,
            address: body.address,
            profilePhoto: body.profilePhoto,
            instaHandle: body.instaHandle,
            linkedinHandle: body.linkedinHandle,
            facebookHandle: body.facebookHandle,
            isApproved: false
        })
        // encrypt the password
        const hashedPassword = bcrypt.hashSync(body.userPassword, 10)

        // create only if the userdetails are inserted
        if (new_user) {
            // create a login data in login_details table
            const newlogin_detail = await login_details.create({
                userType: body.userType,
                userEmail: body.userEmail,
                userPassword: hashedPassword,
                userId: new_user.id,
                isApproved: false
            })
            // send error if no login created
            if (!newlogin_detail) {
                return next(new AppError("Account Creation failed", 400))
            }
            else {
                // new user data will not have email of the user
                new_user.email = newlogin_detail.userEmail
                return res.status(201).json({
                    status: "success",
                    data: new_user
                })
            }
        }
        else {
            return next(new AppError("Account Creation failed", 400))
        }

    }
})


// approveUser
const approveUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params; 

  // fetch login once
  let userLogin = await login_details.findOne({
    where: {
      [Op.or]: [
        { id: userId},
        // you can uncomment if you ever want clubId based lookup:
        // { clubId: userId },
      ],
    },
  });

if (!userLogin) {
  userLogin = await login_details.findOne({
    where: { userId },
  });
}

if (!userLogin) {
  return next(new AppError("User login not found", 404));
}


  console.log("userType", userLogin.userType);

  let userDetails = null;
  let clubDetails = null;
  const userTypeStr = String(userLogin.userType).toLowerCase();

  if (userTypeStr === '3' || userTypeStr === 'club') {
    // club account
    const clubId = userLogin.clubId;
    clubDetails = await club_details.findOne({ where: { id: clubId } });
    if (!clubDetails) {
      return next(new AppError("clubDetails not found", 404));
    }
  } else {
    // normal user
    userDetails = await user_details.findOne({ where: { id: userId } });
    if (!userDetails) {
      return next(new AppError("userDetails not found", 404));
    }
  }

  // Already approved?
  if (
    userLogin.isApproved ||
    (clubDetails && clubDetails.isApproved) ||
    (userDetails && userDetails.isApproved)
  ) {
    return res.status(400).json({ message: "User already approved" });
  }

  // Approve
  try {
    userLogin.isApproved = true;
    await userLogin.save();

    if (clubDetails) {
      clubDetails.isApproved = true;
      await clubDetails.save();
    } else if (userDetails) {
      userDetails.isApproved = true;
      await userDetails.save();
    }
  } catch (err) {
    console.error("Approval save failed:", err);
    return next(new AppError("Failed to approve user", 500));
  }

  // Prepare email
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  let msg;
  if (userTypeStr === '3' || userTypeStr === 'club') {
  msg = {

        to: userLogin.userEmail,

        from: {

      name: 'Rotaract3203 Account Activation',

      email: 'chandhuru.dev.in@gmail.com',

    },

        subject: 'Your account has been approved',

        text: `Hello,\n\nYour account has been approved by the admin.\n\nUsername: ${userLogin.userEmail}\nPassword: [hidden for security]\n\nYou may now log in.`,

        html: `<strong>Hello,</strong><br>Your account has been approved.<br><br><b>Username:</b> ${userLogin.userEmail}<br><b>Password:</b> <b>${clubDetails.userMobile}</b> (if you need to reset your password kindly check in profile and reset your password)<br><br>You may now log in.`,

    };
    }else{
        msg = {

        to: userLogin.userEmail,

        from: {

      name: 'Rotaract3203 Account Activation',

      email: 'chandhuru.dev.in@gmail.com',

    },

        subject: 'Your club account has been approved',

        text: `Hello,\n\nYour club account has been approved by the admin.\n\nUsername: ${userLogin.userEmail}\nPassword: [hidden for security]\n\nYou may now log in.`,

        html: `<strong>Hello,</strong><br>Your account has been approved.<br><br><b>Username:</b> ${userLogin.userEmail}<br><b>Password:</b> <b>${userDetails.userMobile}</b> (if you need to reset your password kindly check in profile and reset your password)<br><br>You may now log in.`,

    };
    }

  try {
    await sgMail.send(msg);
  } catch (emailErr) {
    // Log but don't block response
    console.error("Email send failed:", emailErr);
  }

  return res.status(200).json({ message: "User approved and email sent" });
});



const getUnapprovedUsers = catchAsync(async (req, res, next) => {
  // Step 1: Fetch all unapproved login_details
  const unapprovedUsers = await login_details.findAll({
    where: {
      isApproved: false,
      userType: { [Op.in]: ['1', '2', '3', '4'] },
    },
  });
  // Step 2: Attach related model manually based on userType
  const enrichedUsers = await Promise.all(
    unapprovedUsers.map(async (user) => {
      const userJson = user.toJSON(); // clone plain object

      if (['1', '2', '4', '5'].includes(user.userType)) {
        userJson.userDetails = await user_details.findOne({
          where: { id: user.userId },
        });
      } 
    //   if (['4', '5'].includes(user.userType)) {
    //     userJson.clubDetails = await club_details.findOne({
    //       where: { id: user.clubId },
    //     });
    //   }

      return userJson;
    })
  );

  return res.status(200).json({
    status: 'success',
    results: enrichedUsers.length,
    data: enrichedUsers,
  });
});




const authentication = catchAsync(async (req, res, next) => {
    let idToken = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 400))
    }
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET)
    let freshUser
    if(tokenDetail.userType == "3"){
        freshUser = await club_details.findByPk(tokenDetail.userId);
    }
    else
    {
        freshUser = await user_details.findByPk(tokenDetail.userId);
    }

if (!freshUser) {
    return next(new AppError("User No longer exists", 400))
}
req.user = freshUser
req.tokenDetail = tokenDetail
return next()
})

module.exports = { login, signup, authentication, approveUser, getUnapprovedUsers }