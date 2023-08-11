var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true, maxLength: 12},
        password: {type: String, required: true, maxLength: 100},
        email: {type: String, required: true},
        phone: {type: String, maxLength: 15},
        desc: {type: String, maxLength: 200},
        friendList: {type: [Schema.Types.ObjectId], ref: 'User', required: true}
    }
)

// Virtual for user page
UserSchema.virtual('page')
.get(function () {
    return '/users/' + this.username
});

// Export model
module.exports = mongoose.model('User', UserSchema);

