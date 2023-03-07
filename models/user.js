const { Schema, model, default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = Schema({ 
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 150,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 100
    },
    image: {
        type: String
    },
    social: {
        type: String
    },
    verified: {
        type: Boolean
    },
    favouriteTeam: [
        {
            type: String,
            ref: "Teams"
        }
    ],
    favouriteLeague: [
        {
            type: Number,
            ref: "Leagues"
        }
    ],
    favouritePlayer: [
        {
            type: String,
            ref: "NationalTeams"
        }
    ],
    verifiedAt: {
        type: Date
    }
}, { timestamps: true });

userSchema.methods.generateJWT = function() {
    const token = jwt.sign({
        _id: this.id,
        email: this.email,
        name: this.name,
        verified: this.verified
    }, process.env.JWT_ENCRYPTION_KEY, {expiresIn: "7d"})

    return token
}

module.exports.User = model('User', userSchema);