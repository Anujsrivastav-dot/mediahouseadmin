var mongoose = require("mongoose"),
  // mongoosePaginate = require('mongoose-paginate'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  journalist = new Schema(
    {
      langCOde: {
        type: String
      },
      langName: {
        type: String
      },
      designationId: {
        type: ObjectId,
        default: null,
        ref: "designation"
      },
      categoryId: {
        type: ObjectId,
        default: null,
        ref: "category"
      },
      profilePic: {
        type: String
      },
      mailingAddress: {
        type: String
      },
      shortVideo: {
        type: String
      },
      firstName: {
        type: String
      },
      middleName: {
        type: String
      },
      lastName: {
        type: String
      },
      emailId: {
        type: String
      },
      mobileNumber: {
        type: String
      },
      country: {
        type: String
      },
      state: {
        type: String
      },
      pincode: {
        type: String
      },
      currency: {
        type: String
      },
      shortBio: {
        type: String
      },
      password: {
        type: String
      },
      mobileNumber: {
        type: Number
      },
      // professionalDetails: [{
      //     areaOfInterest:{
      //         type:String
      //     }
      //   }],
      areaOfInterest: {
        type: ObjectId
      },
      targetAudience: {
        type: String
      },
      resumeDetails: {
        type: String
      },
      uploadResume: {
        type: String
      },
      refrences: [
        {
          firstName: {
            type: String
          },
          middleName: {
            type: String
          },
          lastName: {
            type: String
          },
          email: {
            type: String
          },
          designation: [
            {
              type: String
            }
          ],
          phoneNumber: [
            {
              type: String
            }
          ]
        }
      ],
      previousWorks: [
        {
          title: {
            type: String
          },
          link: {
            type: String
          }
        }
      ],
      //   socialAccountLinks: [{
      facebookLink: {
        type: String
      },
      twitterLink: {
        type: String
      },
      linkedinLink: {
        type: String
      },
      snapChatLink: {
        type: String
      },
      instagramLink: {
        type: String
      },
      youtubeLink: {
        type: String
      },
      //   }],
      platformBenefits: [
        {
          type: ObjectId,
          default: null,
          ref: "benefit"
        }
      ],
      platformSuggestion: {
        type: String
      },
      paymentStatus: {
        type: Number //0 for inactive 1 for active
      },
      status: {
        type: Number,
        default: "" // 0 for inactive 1 for pending 2 for active
      }
    },
    {
      timestamps: true
    }
  );

// journalist.plugin(mongoosePaginate);
module.exports = mongoose.model("journalist", journalist, "journalists");
//module.exports  = mongoose.model('session', session, 'session');
