var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  myContents = new Schema(
    {
      myContent: [
        {
          contentOriginalName: {
            type: String
          },
          contentDuplicateName: {
            type: String
          }
        }
      ],
      journalistId: {
        type: ObjectId,
        default: null,
        ref: "journalists"
      }
    },
    {
      timestamps: true
    }
  );

myContents.plugin(mongoosePaginate);
module.exports = mongoose.model("myContents", myContents, "myContents");
