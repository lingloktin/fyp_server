const { DataTypes} = require("sequelize");

class Agreement{
    static model = null;
    #sequelize;

    constructor(sequelize) {
        this.#sequelize = sequelize;
        if (Agreement.model === null){
            Agreement.model = this.#define();
        }
    }

    #define() {
        return this.#sequelize.define('Agreement',{
            id:{
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            cid:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            token_id:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            candidate_sig:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            company_sig:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            job_title:{
                type: DataTypes.STRING,
                allowNull: false
            },
            job_description:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            contract:{
                type: DataTypes.BLOB,
                allowNull: false
            },
            candidate_email: {
                type: DataTypes.STRING,
                allowNull: false

            },    
            company_email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status:{
                // "REQ_REVIEW", "REQ_SIGN", "COMPLETED", "TERMINATED", "REJECTED", "REMOVED", "REQ_MODIFY"
                // requested for review, requested for sign, completed signing, contract terminated, offer rejected, offer removed, requested for modification 
                type: DataTypes.ENUM("REQ_REVIEW", "REQ_SIGN", "COMPLETED", "TERMINATED", "REJECTED", "REMOVED", "REQ_MODIFY"),
                allowsNull: false
            }
        })
    }

    async create(job_title, candidate_email, company_email, contract, status, job_description){
        return await Agreement.model.create({
                job_title: job_title,
                candidate_email: candidate_email,
                company_email: company_email,
                contract: contract,
                status: status,
                job_description: job_description
            });
    }

    async findOne(id){
        return await Agreement.model.findOne({
            where:{id:id}
        })
    }

    async findAll(query){
        return await Agreement.model.findAll({
            where: query
        })
    }
}

module.exports.Agreement = Agreement
