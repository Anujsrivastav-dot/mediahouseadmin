let express = require("express");
let router = express.Router();
let validate = require("../../middleware/validation");
var multer = require("multer");
const sendResponse = require("../../helpers/responseHandler");
//express validation function to throw validation
const { check, validationResult } = require("express-validator/check");
// authentication function
let auth = require("../../middleware/auth");
let config = require("../../helpers/config")();
const sendRes = require("../../helpers/responseHandler");

// check validation result
function checkValidationResult(req, res, next) {
  var result = validationResult(req).array();
  console.log(result);
  result.length ? sendRes.to_user(res, 403, result[0].msg) : next();
}

let storyService = require("../../services/journalist/story.service");

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //   console.log(req.file)
    callback(null, "images");
  },
  filename: function(req, file, callback) {
    var fileName = Date.now() + "_" + file.originalname;
    callback(null, fileName);
  }
});
var uploadImg = multer({ storage: storage });
var cpUpload = uploadImg.fields([{ name: 'uploadTexts', maxCount: 8 }, { name: 'uploadImages', maxCount: 8 }, { name: 'uploadVideos', maxCount: 8 }, { name: 'uploadThumbnails', maxCount: 8 }, { name: 'supportingDocs', maxCount: 8 }, { name: 'uploadAudios', maxCount: 8 }])
// router.route("/postStory").post(
//   uploadImg.single("profilePic"),
//   validate.journalistReq,
//   (req, res, next) => {
//     checkValidationResult(req, res, next);
//   },
//   journalistService.signupJournalist
// );
router.route("/postStory").post(cpUpload,
    storyService.postStory
);


// router
//     .route('/postStory')
//     .post(validate.postStoryReq, (req, res, next) => {
//         checkValidationResult(req, res, next)
//     },journalistService.postStory)

// offer Routing goes here //

module.exports = router;
