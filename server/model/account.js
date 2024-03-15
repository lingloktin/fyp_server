const {DataTypes} = require("sequelize");

class Account{
    static model = null;
    #sequelize;

    constructor(sequelize) {
        this.#sequelize = sequelize;
        if (Account.model === null){
            Account.model = this.#define();
        }
    }

    #define() {
        return this.#sequelize.define('Account',{
            email:{
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            id:{
                // hashed identity card number
                type: DataTypes.STRING,
                allowNull: true
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false
            },
            type:{
                type: DataTypes.ENUM('INDIVIDUAL', 'BUSINESS'),
                allowNull: false
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            chain_address:{
                type: DataTypes.STRING,
                allowNull: false
            }
        })
    }

    async create(email, password, name, chain_address, type, id){
        return await Account.model.create({
                email: email,
                password: password,
                name: name,
                chain_address: chain_address,
                type: type,
                id: id
        })
    }

    async findOne(query){
        return await Account.model.findOne({
                where:query
            })
    }
}

module.exports.Account = Account
