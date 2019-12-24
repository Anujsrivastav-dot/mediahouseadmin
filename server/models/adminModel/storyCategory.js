var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    storyCategory = new Schema({
        storyCategoryName:{
            type:String
        },
        status: {
            type: Number,
            default: 1   // 0 for inactive 1 for pending 2 for active
        }                   
},{
    timestamps:true
});


module.exports = mongoose.model('storyCategory', storyCategory, 'storyCategories');
//module.exports  = mongoose.model('session', session, 'session');