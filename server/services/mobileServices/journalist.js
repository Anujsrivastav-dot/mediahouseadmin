const db = require("../../dbConnection/dao");
const sendResponse = require("../../helpers/responseHandler");
const encryptDecrypt = require("../../helpers/cryptoPassword");
const generateToken = require("../../helpers/generateAuthToken");
// var mailFunction = require("../../lib/mailer");
var randomOtp = require('random-number');
var nodemailer = require('nodemailer');
var random = require('random-number-generator')

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
        $or: [{
          emailId: req.body.emailId,
        }, {
          mobileNumber: req.body.mobileNumber
        }]
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
        var fileArray=req.files;
        var profilePic;
        var shortVideo;
        fileArray['profilePic'].forEach(img => {
          if(img['mimetype']=="image/jpeg" ||img['mimetype']=="image/png"){
            profilePic=img['filename'];
          }
          else{
            sendResponse.to_user(res, 400, "File_type_Error", "Please upload valid file");
            return;
            }
         });
        fileArray['shortVideo'].forEach(vid => {
          if(vid['mimetype']=="video/mp4"||vid['mimetype']=="video/3gpp" ||vid['mimetype']=="video/x-flv"||vid['mimetype']=="application/x-mpegURL"||vid['mimetype']=="video/x-msvideo"){
          shortVideo=vid['filename'];
          }
          else{
            sendResponse.to_user(res, 400, "File_type_Error", "Please upload valid file");
            return;
            }
            
        });
        req.body.password = encryptDecrypt.encrypt(req.body.password);
        req.body.profilePic=profilePic; 
        req.body.shortVideo=shortVideo; 
        var journalists = new db.journalist(req.body);
        if(shortVideo&&profilePic){
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
    } 
    catch (e) {
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  
  "professionalDetails": async (req, res) => {
    try {
     
        const filter = { _id: req.body.journalistId };     
        req.body.areaOfInterest = req.body.areaOfInterest.split(",");
        req.body.targetAudience = req.body.targetAudience.split(",");
        var resume;
        if(req.file.mimetype=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||req.file.mimetype=="application/msword"||req.file.mimetype=="application/pdf"){
          resume=req.file.filename;
        }
        else{
          sendResponse.to_user(res, 400, "File_type_Error", "Please upload valid file");
          }
            req.body.uploadResume = resume
            if(resume){
            var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Professional details saved Successfully", success);
            }
         }
    } catch (e) {
  
        sendResponse.to_user(res, 400, e, 'Something went wrong');
    }
  },

  "refrences": async (req, res) => {
    try {
        const filter = { _id: req.body.journalistId };     
        req.body.refrences =JSON.parse(req.body.refrences);
        
            var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Refrences saved Successfully", success);
            }
    } catch (e) {
        sendResponse.to_user(res, 400, e, 'Something went wrong');
    }
  },
  "previousWorks": async (req, res) => {
    try {
        const filter = { _id: req.body.journalistId };     
        req.body.previousWorks =JSON.parse(req.body.previousWorks);
        
            var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Previous Works saved Successfully", success);
            }
    } catch (e) {
        sendResponse.to_user(res, 400, e, 'Something went wrong');
    }
  },
  "socialAccountLinks": async (req, res) => {
    try {
        const filter = { _id: req.body.journalistId };     
            var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Social Account Links saved Successfully", success);
            }
    } catch (e) {
        sendResponse.to_user(res, 400, e, 'Something went wrong');
    }
  },

  "platformBenefits": async (req, res) => {
    try {
     
        const filter = { _id: req.body.journalistId };     
      
        req.body.platformBenefits = req.body.platformBenefits.split(",");
            var success = await db.journalist.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Platform Benefits  saved Successfully", success);
            }
        // }
    } catch (e) {
  
        sendResponse.to_user(res, 400, e, 'Something went wrong');
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
      if (!journalistData) {
        sendResponse.to_user(
          res,
          400,
          null,
          "Email id or password is incorrect.",
          null
        );
      } else {
        authToken = generateToken.authToken({
          _id: journalistData._id
        });
        sendResponse.to_user(res, 200, null, "Login successfully", {
          journalistToken: authToken
        });
      }
    } catch (e) {
      console.log(e);
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Forgot password API
  // ==============================
  "forgotPassword": async (req, res) => {
    try {
      var condition = {
        emailId: req.body.emailId,
        // status: 1,
      }
      var journalistData = await db.journalist.findOne(condition);
      if (!journalistData) {
        sendResponse.to_user(res, 400, null, ' Email id does not exist.', null);
      } else {
        var otpGen = random(9999, 1111) // random integer between 10 and 50
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
          html: "<b>your Recover code is:</b>" + otpGen,
        }

        smtpTransport.sendMail(mail, function (error, response) {
          if (error) {
            console.log("err", error)
            //sendResponse.to_user(res, 400, error, "Something went wrong");
          } else {
            console.log("success", response)
            sendResponse.to_user(res, 200, null, 'OTP has been sent on your registered email.', null);
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

  "verifyOtp": async (req, res) => {
    try {
      var condition = {
        emailId: req.body.emailId
      }
      var journalistData = await db.journalist.findOne(condition);
      // console.log("==>>journalistData", journalistData.otp)
      if (!journalistData) {
        sendResponse.to_user(res, 400, null, ' Email id does not exist', null);
      }
      else if (journalistData.otp != req.body.otp) {
        sendResponse.to_user(res, 202, null, ' Invalid OTP', null);
      }
      else {
        console.log("==>>data", journalistData);
        journalistData.verifyOtp = true;
        await journalistData.save();
        authToken = generateToken.authToken({
          _id: journalistData._id
        });
        sendResponse.to_user(res, 200, null, 'OTP verified successfully, Please contact to admin', {
          journalistToken: authToken,
          _id: journalistData._id,
          otp: journalistData.otp
        });
      }
    } catch (e) {
      console.log(e)
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Reset password API
  // ==============================

  "resetPassword": async (req, res) => {
    try {
      if (req.body.newPassword == req.body.confirmPassword) {
        var success = await db.journalist.findOne({
          emailId: req.body.emailId,

        });
        if (!success) {
          sendResponse.to_user(res, 400, null, 'Email id does not exist', null);
        } else {
          await db.journalist.findOneAndUpdate({
            emailId: req.body.emailId,

          }, {
            $set: {
              "password": encryptDecrypt.encrypt(req.body.newPassword)
            }
          });
          sendResponse.to_user(res, 200, null, 'Password reset successfully', null);
        }
      } else {
        sendResponse.to_user(res, 400, null, "New password and confirm password doesn't match", null);
      }
    } catch (e) {
      // console.log(e)
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },

  // ==============================
  //  Story API
  // ==============================
  "blog": async(req, res) => {
    try {
         
        req.body.keywordId = req.body.keywordId.split(",");
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
  "uploadBlog": async(req, res) => {
    try {
         var imageArray=req.files;
         console.log(imageArray)
             var textNote =req.body.textNote.split(",");
             var imageNote =req.body.imageNote.split(",");
             var videoNote =req.body.videoNote.split(",");
             var docNote =req.body.docNote.split(",");
             var thumbnaleNote =req.body.thumbnaleNote.split(",");
             var audioNote =req.body.audioNote.split(","); 
             var uploadTexts=[];
             var uploadImages=[];
             var uploadVideos=[];
             var uploadThumbnails=[];
             var supportingDocs=[];
             var uploadAudios=[];
             var l=0;
             imageArray['uploadTexts'].forEach(txt => {
              if(txt['mimetype']=="txt"){
                uploadTexts.push({text:txt['filename'],textNote:textNote[l]},);
              l++;
              }
               else{
                sendResponse.to_user(res, 400, "File_type_Error", "Please upload text file");
               }
            });
            var k=0;
            imageArray['uploadImages'].forEach(img => {
              uploadImages.push({Image:img['filename'],imageNote:imageNote[k]},);
            k++;
            });
              var  j=0;
              imageArray['uploadVideos'].forEach(vid => {
                if(vid['mimetype']=="video/mp4"){
                  uploadVideos.push({video:vid['filename'],videoNote:videoNote[j]},);
                  j++;
                }
                 else{
                  sendResponse.to_user(res, 400, "File_type_Error", "Please upload valid file");
                 }
              });
            var i=0;
            imageArray['uploadThumbnails'].forEach(thumb => {
              uploadThumbnails.push({thumbnale:thumb['filename'],thumbnaleNote:thumbnaleNote[i]},);
            i++; 
            });
            var m=0;
            imageArray['supportingDocs'].forEach(docs => {
              supportingDocs.push({doc:docs['filename'],docNote:docNote[m]},);
              m++; 
            });
            var n=0;
            imageArray['uploadAudios'].forEach(audio => {
              uploadAudios.push({audio:audio['filename'],audioNote:audioNote[n]},);
              n++; 
            });
           
            req.body.uploadTexts=uploadTexts; 
            req.body.uploadImages=uploadImages;
            req.body.uploadVideos=uploadVideos;
            req.body.uploadThumbnails=uploadThumbnails;
            req.body.supportingDocs=supportingDocs;
            req.body.uploadAudios=uploadAudios;
        // var story = new db.story(req.body);
        // await story.save();
            const filter = { _id: req.body.blogId };
            var success = await db.story.findByIdAndUpdate(filter, req.body, {
                new: true
            })
            if (!success) {
                sendResponse.to_user(res, 404, "DATA_NOT_FOUND", "Journalist Not Found With Id", null);
            }
            else {
                sendResponse.to_user(res, 200, null, "Blog added  successfully", success);
            }
      
    } catch (e) {
      console.log(e)
      sendResponse.to_user(res, 400, e, "Something went wrong");
    }
  },


};
