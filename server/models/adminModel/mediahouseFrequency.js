var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    mediahouseFrequency = new Schema({
        mediahouseFrequencyName: {
            type: String
        },
        status: {
            type: Number,
            default: 1 // status 1 is Active and 0 is inActive/delete
        }
    },{
        timestamps:true
    })

    mediahouseFrequency.plugin(mongoosePaginate);
module.exports = mongoose.model('mediahouseFrequency', mediahouseFrequency, 'mediahouseFrequency');