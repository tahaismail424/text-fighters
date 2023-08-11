var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectID, ref: 'User', required: true},
        text: {type: String, required: true},
        effect: {type: String, required: true},
        sentAt: {type: Date, required: true}
    }
)



// Export model
module.exports = mongoose.model('Message', MessageSchema);

