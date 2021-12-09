//Import modules
const { Schema, model, Types } = require('mongoose');
const dFormat = require('../utils/dateFormatter');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => Types.ObjectId
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [
            ReactionSchema
        ]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
);

//Creates a virtual property/field that counts the number of reactions to a thought
ThoughtSchema.virtual('reactionCount').get(() => {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;