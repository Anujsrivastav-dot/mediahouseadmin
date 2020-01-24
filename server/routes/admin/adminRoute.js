let express = require('express');
let router = express.Router();
let validate = require('../../middleware/validation')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(req.body)
        callback(null, 'images')
    },
    filename: function (req, file, callback) {
        var fileName = Date.now() + '_' + file.originalname;
        callback(null, fileName)
    }
});
var upload = multer({ storage: storage });

//  console.log(storage)
//express validation function to throw validation
const {
    check,
    validationResult
} = require('express-validator/check');
// authentication function 
let auth = require('../../middleware/auth');
let varify = require('../../middleware/verifyToken');
let config = require('../../helpers/config')();
const sendRes = require("../../helpers/responseHandler");


// check validation result
function checkValidationResult(req, res, next) {
    var result = validationResult(req).array();
    console.log(result)
    result.length ? sendRes.to_user(res, 403, result[0].msg) : next()
}


// admin services
let admin = require("../../services/admin/admin.service");
let content = require("../../services/admin/staticContent.service");

//var cpUpload = upload.fields([{ name: 'video', maxCount: 8 }, { name: 'file', maxCount: 8 }])

//router for Admin
router
    .route('/admin')
    .post(admin.add)
    .get(admin.get, varify.verifyUserToken);
router.route("/login").post(
    validate.adminLoginReq,
    (req, res, next) => {
        checkValidationResult(req, res, next);
    },
    admin.adminLogin
);


//router for designation
router
    .route('/designation')
    .post(validate.designationReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addDesignation)

    .get(admin.getDesignation)

    .put(validate.designationReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateDesignation)

    .delete(admin.deleteDesignation)



//router for benifit  of platform  
router
    .route('/benefit')
    .post(validate.benefitReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addBenefit)

    .get(admin.getBenefit)

    .put(validate.benefitReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateBenefit)

    .delete(admin.deleteBenefit)

//router for category    
router
    .route('/category')
    .post(validate.categoryReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addCategory)

    .get(admin.getCategory)

    .put(validate.categoryReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateCategory)

    .delete(admin.deleteCategory)

//router for story category    
router
    .route('/storyCategory')
    .post(validate.storyCategoryReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addStoryCategory)

    .get(admin.getStoryCategory)

    .put(validate.storyCategoryReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateStoryCategory)

    .delete(admin.deleteStoryCategory)

//router for story type    
router
    .route('/storyType')
    .post(validate.storyTypeReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addStoryType)

    .get(admin.getStoryType)

    .put(validate.storyTypeReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateStoryType)

    .delete(admin.deleteStoryType)

//router for story  Keyword     
router
    .route('/storyKeyword')
    .post(validate.storyKeywordReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addStoryKeyword)

    .get(admin.getStoryKeyword)

    .put(validate.storyKeywordReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateStoryKeyword)

    .delete(admin.deleteStoryKeyword)

//router for list of journalist  
router
    .route('/journalist')
    .get(admin.getJournalist)
    .put(validate.journalistReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateJournalist)

//router for static content 

router
    .route('/staticContent')
    .get(content.getContent)
    .put(content.updateContent)

//router for story  Keyword     
router
    .route('/socioLinks')
    .post(validate.socioLinkReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addSocioLinks)

    .get(admin.getSocioLinks)

    .put(validate.socioLinkReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateSocioLinks)

    .delete(admin.deleteSocioLinks)

//router for mediahouseType 
router
    .route('/mediahouseType')
    .post(validate.benefitReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.addBenefit)

    .get(admin.getBenefit)

    .put(validate.benefitReq, (req, res, next) => {
        checkValidationResult(req, res, next)
    }, admin.updateBenefit)

    .delete(admin.deleteBenefit)    
module.exports = router;