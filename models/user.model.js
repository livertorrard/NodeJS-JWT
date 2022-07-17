const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userConnection = require('../helpers/connections_multi_mongodb');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function (next) {
    try {
        const satl = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(this.password, satl);
        this.password = hashPassword;
        next();
    }
    catch (err) { next(err); }
})

UserSchema.methods.isCheckPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (e) { }
}

module.exports = userConnection.model('user', UserSchema);

