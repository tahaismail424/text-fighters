var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FriendReqSchema = new Schema(
    {
        sender: {type: Schema.Types.ObjectID, ref: 'User', required: true},
        recipient: {type: Schema.Types.ObjectID, ref: 'User', required: true},
        status: {type: String, required: true},
        createdAt: {type: Date, required: true}
    }
)



// Export model
module.exports = mongoose.model('FriendReq', FriendReqSchema);

