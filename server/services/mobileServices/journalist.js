const db = require("../../dbConnection/dao");
const sendResponse = require("../../helpers/responseHandler");
const encryptDecrypt = require("../../helpers/cryptoPassword");
const generateToken = require("../../helpers/generateAuthToken");
// var mailFunction = require("../../lib/mailer");
var randomOtp = require("random-number");
var nodemailer = require("nodemailer");
var random = require("random-number-generator");

randomOtp();

// const COUNTRIES =require("../../helpers/country");
const STATES = require("../../helpers/state");
const CITY = require("../../helpers/city");
module.exports = {
  // ==============================
  //   Journalist Signup API
  // ==============================

  personalInfo: async (req, res) => {
    try {
      var condition = {
        $or: [
          {
            emailId: req.body.emailId
          },
          {
            mobileNumber: req.body.mobileNumber
          }
        ]
      };
      var success = await db.journalist.findOne(condition);
      if (success) {
        sendResponse.to_user(
          res,
          409,
          "DATA_ALREADY_EXIST",
          "Email id or mobile number already taken",
          null
        );
      } else {
        var fileArray = req.files;
        var profilePic;
        var shortVideo;
        fileArray["profilePic"].forEach(img => {
          if (
            img["mimetype"] == "image/jpeg" ||
            img["mimetype"] == "image/jpg" ||
            img["mimetype"] == "image/png"
          ) {
            profilePic = img["path"];
          } else {
            sendResponse.to_user(
              res,
              400,
              "Image_File_type_Error",
              "Please upload valid file"
            );
            return;
          }
        });
        fileArray["shortVideo"].forEach(vid => {
          if (
            vid["mimetype"] == "video/mp4" ||
            vid["mimetype"] == "video/3gpp" ||
            vid["mimetype"] == "video/x-flv" ||
            vid["mimetype"] == "video/quicktime" ||
            vid["mimetype"] == "application/x-mpegURL" ||
            vid["mimetype"] == "video/x-msvideo"
          ) {
            shortVideo = vid["path"];
          } else {
            sendResponse.to_user(
              res,
              400,
              "Video_File_type_Error",
              "Please upload valid file"
            );
            return;
          }
        });
        req.body.password = encryptDecrypt.encrypt(req.body.password);
        req.body.profilePic = profilePic;
        req.body.shortVideo = shortVideo;
        req.body.country = JSON.parse(req.body.country);
        req.body.city = JSON.parse(req.body.city);
        req.body.state = JSON.parse(req.body.state);
        var journalists = new db.journalist(req.body);
        if (shortVideo && profilePic) {
          await journalists.save();
        }

        sendResponse.to_user(
          res,
          200,
          null,
          "Personal Information Saved successfully",
          journalists
        );
      }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  professionalDetails: async (req, res) => {
    try {
      const filter = { _id: req.body.journalistId };
      req.body.areaOfInterest = req.body.areaOfInterest.split(",");
      req.body.targetAudience = req.body.targetAudience.split(",");
      var resume;
      if (
        req.file.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        req.file.mimetype == "application/msword" ||
        req.file.mimetype == "application/pdf"
      ) {
        resume = req.file.path;
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_type_Error",
          "Please upload valid file"
        );
      }
      req.body.uploadResume = resume;
      if (resume) {
        var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
          new: true
        });
        if (!success) {
          sendResponse.to_user(
            res,
            404,
            "DATA_NOT_FOUND",
            "Journalist Not Found With Id",
            null
          );
        } else {
          sendResponse.to_user(
            res,
            200,
            null,
            "Professional details saved Successfully",
            success
          );
        }
      }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  refrences: async (req, res) => {
    try {
      const filter = { _id: req.body.journalistId };
      req.body.refrences = JSON.parse(req.body.refrences);

      var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "Journalist Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Refrences saved Successfully",
          success
        );
      }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },
  previousWorks: async (req, res) => {
    try {
      const filter = { _id: req.body.journalistId };
      req.body.previousWorks = JSON.parse(req.body.previousWorks);

      var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "Journalist Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Previous Works saved Successfully",
          success
        );
      }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },
  socialAccountLinks: async (req, res) => {
    try {
      const filter = { _id: req.body.journalistId };
      var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "Journalist Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Social Account Links saved Successfully",
          success
        );
      }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  platformBenefits: async (req, res) => {
    try {
      const filter = { _id: req.body.journalistId };

      req.body.platformBenefits = req.body.platformBenefits.split(",");
      var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "Journalist Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Platform Benefits  saved Successfully",
          success
        );
      }
      // }
    } catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //   All State list API
  // ==============================
  state: async (req, res) => {
    try {
      var countryId = req.query.countryId;
      const filteredStates = STATES.filter(state => {
        return state.country_id === countryId;
      });
      sendResponse.to_user(res, 200, null, "State list found", filteredStates);
    } catch (e) {
      console.log("err====", e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //   All City list API
  // ==============================
  city: async (req, res) => {
    try {
      var stateId = req.query.stateId;
      const filteredCity = CITY.filter(city => {
        return city.state_id === stateId;
      });
      sendResponse.to_user(res, 200, null, "City list found", filteredCity);
    } catch (e) {
      console.log("err====", e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //   Journalist Login API
  // ==============================
  journalistLogin: async (req, res) => {
    try {
      var condition = {
        emailId: req.body.emailId,
        password: encryptDecrypt.encrypt(req.body.password)
      };
      var journalistData = await db.journalist.findOne(condition);
      var mediahouseData = await db.mediahouse.findOne(condition);
      console.log(mediahouseData);
      if (!journalistData) {
        if (!mediahouseData) {
          sendResponse.to_user(
            res,
            400,
            null,
            "Email id or password is incorrect.",
            null
          );
        } else {
          authToken = generateToken.authToken({
            _id: mediahouseData._id
          });
          sendResponse.to_user(res, 200, null, "Login successfully", {
            mediahouseToken: authToken,
            stepCount: mediahouseData.stepCount,
            journalistId: mediahouseData._id,
            userType: mediahouseData.userType,
            prevData: mediahouseData,
            prevJouralistData: journalistData
          });
        }
      } else {
        if (journalistData) {
          authToken = generateToken.authToken({
            _id: journalistData._id
          });
          sendResponse.to_user(res, 200, null, "Login successfully", {
            journalistToken: authToken,
            stepCount: journalistData.stepCount,
            journalistId: journalistData._id,
            userType: journalistData.userType
          });
        }
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Forgot password API
  // ==============================
  forgotPassword: async (req, res) => {
    try {
      var condition = {
        emailId: req.body.emailId
        // status: 1,
      };
      var journalistData = await db.journalist.findOne(condition);
      if (!journalistData) {
        sendResponse.to_user(res, 400, null, " Email id does not exist.", null);
      } else {
        var otpGen = random(9999, 1111); // random integer between 10 and 50
        journalistData.otp = otpGen;
        await journalistData.save();
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "satyendra.designoweb@gmail.com",
            pass: "satyadesignoweb@123"
          }
        });

        var mail = {
          from: "satyendra.designoweb@gmail.com",
          to: "satyendra05cs@gmail.com",
          subject: "Recover your account",
          text: "Hey Please use the code",
          html: "<b>your Recover code is:</b>" + otpGen
        };

        smtpTransport.sendMail(mail, function(error, response) {
          if (error) {
            console.log("err", error);
            //sendResponse.to_user(res, 400, error, "Something went wrong");
          } else {
            console.log("success", response);
            sendResponse.to_user(
              res,
              200,
              null,
              "OTP has been sent on your registered email.",
              null
            );
          }
          smtpTransport.close();
        });
      }
    } catch (e) {
      // console.log(e)
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Verify OTP API
  // ==============================

  verifyOtp: async (req, res) => {
    try {
      var condition = {
        emailId: req.body.emailId
      };
      var journalistData = await db.journalist.findOne(condition);
      // console.log("==>>journalistData", journalistData.otp)
      if (!journalistData) {
        sendResponse.to_user(res, 400, null, " Email id does not exist", null);
      } else if (journalistData.otp != req.body.otp) {
        sendResponse.to_user(res, 202, null, " Invalid OTP", null);
      } else {
        console.log("==>>data", journalistData);
        journalistData.verifyOtp = true;
        await journalistData.save();
        authToken = generateToken.authToken({
          _id: journalistData._id
        });
        sendResponse.to_user(
          res,
          200,
          null,
          "OTP verified successfully, Please contact to admin",
          {
            journalistToken: authToken,
            _id: journalistData._id,
            otp: journalistData.otp
          }
        );
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Reset password API
  // ==============================

  resetPassword: async (req, res) => {
    try {
      if (req.body.newPassword == req.body.confirmPassword) {
        var success = await db.journalist.findOne({
          emailId: req.body.emailId
        });
        if (!success) {
          sendResponse.to_user(res, 400, null, "Email id does not exist", null);
        } else {
          await db.journalist.findOneAndUpdate(
            {
              emailId: req.body.emailId
            },
            {
              $set: {
                password: encryptDecrypt.encrypt(req.body.newPassword)
              }
            }
          );
          sendResponse.to_user(
            res,
            200,
            null,
            "Password reset successfully",
            null
          );
        }
      } else {
        sendResponse.to_user(
          res,
          400,
          null,
          "New password and confirm password doesn't match",
          null
        );
      }
    } catch (e) {
      // console.log(e)
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Story API
  // ==============================
  blog: async (req, res) => {
    try {
      req.body.keywordId = req.body.keywordId.split(",");
      req.body.journalistId = req.journalist._id;
      req.body.country = JSON.parse(req.body.country);
      req.body.city = JSON.parse(req.body.city);
      req.body.state = JSON.parse(req.body.state);
      var story = new db.story(req.body);
      await story.save();
      sendResponse.to_user(
        res,
        200,
        null,
        "blog details saved successfully",
        story
      );
    } catch (e) {
      console.log("err====", e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  uploadBlog: async (req, res) => {
    try {
      var imageArray = req.files;
      var textNote = req.body.textNote.split(",");
      var imageNote = req.body.imageNote.split(",");
      var videoNote = req.body.videoNote.split(",");
      var docNote = req.body.docNote.split(",");
      var thumbnaleNote = req.body.thumbnaleNote.split(",");
      var audioNote = req.body.audioNote.split(",");
      var uploadTexts = [];
      var uploadImages = [];
      var uploadVideos = [];
      var uploadThumbnails = [];
      var supportingDocs = [];
      var uploadAudios = [];
      var l = 0;
      //console.log(imageArray);
      if (imageArray["uploadTexts"]) {
        imageArray["uploadTexts"].forEach(txt => {
          if (txt["mimetype"] == "text/plain") {
            uploadTexts.push({ text: txt["path"], textNote: textNote[l] });
            l++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload text file for text"
            );
          }
        });
      } else {
        sendResponse.to_user(res, 400, "File_Error", "uploadTexts is required");
        return;
      }
      var k = 0;
      if (imageArray["uploadImages"]) {
        imageArray["uploadImages"].forEach(img => {
          if (
            img["mimetype"] == "image/jpeg" ||
            img["mimetype"] == "image/png"
          ) {
            uploadImages.push({
              Image: img["path"],
              imageNote: imageNote[k]
            });
            k++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload image file for image"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadImages is required"
        );
        return;
      }
      var j = 0;
      if (imageArray["uploadVideos"]) {
        imageArray["uploadVideos"].forEach(vid => {
          if (
            vid["mimetype"] == "video/mp4" ||
            vid["mimetype"] == "video/3gpp" ||
            vid["mimetype"] == "video/x-flv" ||
            vid["mimetype"] == "application/x-mpegURL" ||
            vid["mimetype"] == "video/x-msvideo" ||
            vid["mimetype"] == "video/quicktime"
          ) {
            uploadVideos.push({
              video: vid["path"],
              videoNote: videoNote[j]
            });
            j++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload video file for videos"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadVideos is required"
        );
        return;
      }
      var i = 0;
      if (imageArray["uploadThumbnails"]) {
        imageArray["uploadThumbnails"].forEach(thumb => {
          if (
            thumb["mimetype"] == "image/jpeg" ||
            thumb["mimetype"] == "image/png"
          ) {
            uploadThumbnails.push({
              thumbnale: thumb["path"],
              thumbnaleNote: thumbnaleNote[i]
            });
            i++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload image file for thumbnail"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadThumbnails is required"
        );
        return;
      }
      var m = 0;
      if (imageArray["supportingDocs"]) {
        imageArray["supportingDocs"].forEach(docs => {
          if (
            docs["mimetype"] ==
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            docs["mimetype"] == "application/msword" ||
            docs["mimetype"] == "application/pdf"
          ) {
            supportingDocs.push({ doc: docs["path"], docNote: docNote[m] });
            m++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload doc file"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "supportingDocs is required"
        );
        return;
      }
      var n = 0;
      if (imageArray["uploadAudios"]) {
        imageArray["uploadAudios"].forEach(audio => {
          if (audio["mimetype"] == "audio/mpeg") {
            uploadAudios.push({
              audio: audio["path"],
              audioNote: audioNote[n]
            });
            n++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload audio file for audio"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadAudios is required"
        );
        return;
      }
      req.body.uploadTexts = uploadTexts;
      req.body.uploadImages = uploadImages;
      req.body.uploadVideos = uploadVideos;
      req.body.uploadThumbnails = uploadThumbnails;
      req.body.supportingDocs = supportingDocs;
      req.body.uploadAudios = uploadAudios;

      const filter = { _id: req.body.blogId };
      var success = await db.story.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "blog Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Story added  successfully",
          success
        );
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  sellStory: async (req, res) => {
    try {
      req.body.keywordId = req.body.keywordId.split(",");
     // req.body.journalistId = req.journalist._id;
      req.body.country = JSON.parse(req.body.country);
      req.body.city = JSON.parse(req.body.city);
      req.body.state = JSON.parse(req.body.state);
      var story = new db.story(req.body);
      await story.save();
      sendResponse.to_user(
        res,
        200,
        null,
        "story details saved successfully",
        story
      );
    } catch (e) {
      console.log("err====", e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  uploadStory: async (req, res) => {
    try {
      var imageArray = req.files;
      var textNote = req.body.textNote.split(",");
      var imageNote = req.body.imageNote.split(",");
      var videoNote = req.body.videoNote.split(",");
      var docNote = req.body.docNote.split(",");
      var thumbnaleNote = req.body.thumbnaleNote.split(",");
      var audioNote = req.body.audioNote.split(",");
      var uploadTexts = [];
      var uploadImages = [];
      var uploadVideos = [];
      var uploadThumbnails = [];
      var supportingDocs = [];
      var uploadAudios = [];
      var l = 0;
      //console.log(imageArray);
      if (imageArray["uploadTexts"]) {
        imageArray["uploadTexts"].forEach(txt => {
          if (txt["mimetype"] == "text/plain") {
            uploadTexts.push({ text: txt["path"], textNote: textNote[l] });
            l++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload text file for text"
            );
          }
        });
      } else {
        sendResponse.to_user(res, 400, "File_Error", "uploadTexts is required");
        return;
      }
      var k = 0;
      if (imageArray["uploadImages"]) {
        imageArray["uploadImages"].forEach(img => {
          if (
            img["mimetype"] == "image/jpeg" ||
            img["mimetype"] == "image/png"
          ) {
            uploadImages.push({
              Image: img["path"],
              imageNote: imageNote[k]
            });
            k++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload image file for image"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadImages is required"
        );
        return;
      }
      var j = 0;
      if (imageArray["uploadVideos"]) {
        imageArray["uploadVideos"].forEach(vid => {
          if (
            vid["mimetype"] == "video/mp4" ||
            vid["mimetype"] == "video/3gpp" ||
            vid["mimetype"] == "video/x-flv" ||
            vid["mimetype"] == "application/x-mpegURL" ||
            vid["mimetype"] == "video/x-msvideo" ||
            vid["mimetype"] == "video/quicktime"
          ) {
            uploadVideos.push({
              video: vid["path"],
              videoNote: videoNote[j]
            });
            j++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload video file for videos"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadVideos is required"
        );
        return;
      }
      var i = 0;
      if (imageArray["uploadThumbnails"]) {
        imageArray["uploadThumbnails"].forEach(thumb => {
          if (
            thumb["mimetype"] == "image/jpeg" ||
            thumb["mimetype"] == "image/png"
          ) {
            uploadThumbnails.push({
              thumbnale: thumb["path"],
              thumbnaleNote: thumbnaleNote[i]
            });
            i++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload image file for thumbnail"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadThumbnails is required"
        );
        return;
      }
      var m = 0;
      if (imageArray["supportingDocs"]) {
        imageArray["supportingDocs"].forEach(docs => {
          if (
            docs["mimetype"] ==
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            docs["mimetype"] == "application/msword" ||
            docs["mimetype"] == "application/pdf"
          ) {
            supportingDocs.push({ doc: docs["path"], docNote: docNote[m] });
            m++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload doc file"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "supportingDocs is required"
        );
        return;
      }
      var n = 0;
      if (imageArray["uploadAudios"]) {
        imageArray["uploadAudios"].forEach(audio => {
          if (audio["mimetype"] == "audio/mpeg") {
            uploadAudios.push({
              audio: audio["path"],
              audioNote: audioNote[n]
            });
            n++;
          } else {
            sendResponse.to_user(
              res,
              400,
              "File_type_Error",
              "Please upload audio file for audio"
            );
          }
        });
      } else {
        sendResponse.to_user(
          res,
          400,
          "File_Error",
          "uploadAudios is required"
        );
        return;
      }
      req.body.uploadTexts = uploadTexts;
      req.body.uploadImages = uploadImages;
      req.body.uploadVideos = uploadVideos;
      req.body.uploadThumbnails = uploadThumbnails;
      req.body.supportingDocs = supportingDocs;
      req.body.uploadAudios = uploadAudios;

      const filter = { _id: req.body.blogId };
      var success = await db.story.findByIdAndUpdate(filter, req.body, {
        new: true
      });
      if (!success) {
        sendResponse.to_user(
          res,
          404,
          "DATA_NOT_FOUND",
          "Journalist Not Found With Id",
          null
        );
      } else {
        sendResponse.to_user(
          res,
          200,
          null,
          "Story added  successfully",
          success
        );
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  getProfile: async (req, res) => {
    try {
      var obj = await db.journalist
        .find({
          _id: req.journalist._id
        })
        .populate("designationId", "designationName")
        .populate("areaOfInterest", "categoryName");
      if (obj != "") {
        sendResponse.to_user(
          res,
          200,
          null,
          "journalist profile  get successfully",
          obj
        );
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },
  getAllJournalist: async (req, res) => {
    try {
      var options = {
        select: "firstName middleName lastName",
        sort: { createdAt: -1 },
        limit: 10,
        page: req.query.pageNumber || 1
      };
      var obj = await db.journalist.paginate({}, options);
      if (obj != "") {
        sendResponse.to_user(
          res,
          200,
          null,
          "journalist profile  get successfully",
          obj
        );
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },

  getStory: async (req, res) => {
    try {
      var obj = await db.story
        .find({
          typeStatus: 1,
          status: 1,
          "country.id": req.query.countryId
        })
        .populate("keywordId", "storyKeywordName")
        .populate("categoryId", "categoryName");

      if (obj != "") {
        sendResponse.to_user(res, 200, null, "Story  get successfully", obj);
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },

  countStory: async (req, res) => {
    try {
      var obj = await db.story
        .find({ journalistId: req.journalist._id })
        .count();
      if (obj != "") {
        sendResponse.to_user(res, 200, null, "Story  count successfully", obj);
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },

  getSaveStory: async (req, res) => {
    try {
      var obj = await db.story
        .find({
          typeStatus: 0,
          journalistId: req.journalist._id
        })
        .populate("keywordId", "storyKeywordName")
        .populate("categoryId", "categoryName");
      if (obj != "") {
        sendResponse.to_user(res, 200, null, "Story  get successfully", obj);
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },

  getMyStory: async (req, res) => {
    try {
      var obj = await db.story
        .find({
          typeStatus: 1,
          journalistId: req.journalist._id
        })
        .populate("keywordId", "storyKeywordName")
        .populate("categoryId", "categoryName");

      if (obj != "") {
        sendResponse.to_user(res, 200, null, "Story  get successfully", obj);
      } else {
        sendResponse.to_user(res, 200, "NO_CONTENT", "No Data Avilable", null);
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, "Bad request", "Something went wrong");
    }
  },

  favouriteStory: async (req, res) => {
    try {
      // var obj = await db.favouriteStory.find({
      //   storyId: req.body.storyId,
      //   journalistId: req.body.journalistId
      // });
      // console.log(obj.status);
      const filter = { storyId: req.body.storyId };

      const update = { status: 0 };
      var success = await db.favouriteStory.findOneAndUpdate(filter, update, {
        new: true
      });
      if (success) {
        //db.favouriteStory.deleteMany({ st: "hii" });
        // db.favouriteStory.remove({ st: "hii" });
        sendResponse.to_user(
          res,
          200,
          null,
          "remove from favourite list",
          success
        );
      } else {
        var favourite = new db.favouriteStory(req.body);
        await favourite.save();
        sendResponse.to_user(
          res,
          200,
          null,
          "Story added to favourite list successfully",
          favourite
        );
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  }
};
