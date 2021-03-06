const mongoose = require('../lib/mongo.js'),
    logger = require('../logger/logger.js'),
    userService = require('../service/userService.js'),
    Schema = mongoose.Schema;
let ItemSchema = new Schema({
    item: { type: String, required: true },
    acount: { type: String, required: true },
    isInput: { type: Boolean, required: true }
}),
    BillSchema = new Schema({
        billDetails: [ItemSchema],
        inputAmount: Number,
        outputAmount: Number,
        billDate: String
    }),
    MonthBillSchema = new Schema({
        Daybills: [BillSchema],
        billMonth: String
    }),
    UserSchema = new Schema({
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: String,
        monthBills: [MonthBillSchema]
    }),
    User = mongoose.model('User', UserSchema);

function AddUser(data) {
    let user = new User({
        name: data.username,
        password: data.password,
        email: data.email
    });
    user.save(function (err, res) {
        if (err) {
            logger.error('add user ' + data.name + ' error.Error:' + err);
        } else {
            logger.info('add user ' + data.name + ' successful.');
        }
    });
}

function findUserByName(name) {
    return User.findOne({ name: name }, function (err, res) {
        if (err) {
            logger.error(`findUserByName Error: ${err}`);
        } else {
            logger.info('findUserByName successful.');
        }
    });
}

function changeUserBills(data) {
    User.findOne({ name: data.name }, (err, res) => {
        if (err) {
            logger.error('changeUserBills Error:' + err);
        } else {
            userService.changeUserBills(res, data);
            res.save((error) => {
                if (error) {
                    logger.error(`changeUserBills Error: ${err}`);
                } else {
                    logger.info('changeUserBills ' + data.name + ' successful.');
                }
            });
        }
    });
}

module.exports = {
    AddUser: AddUser,
    findUserByName: findUserByName,
    changeUserBills: changeUserBills
};