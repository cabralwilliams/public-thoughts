//Import modules
const { User, Thought } = require('../models');

const thoughtController = {
    //Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData =>  res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Get a single thought by _id
    getAThought({ params }, res) {
        Thought.findById({ _id: params.thoughtId })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ 'message': `There is no thought with id ${params.thoughtId}`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Post a new thought
    createAThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Update a thought
    updateAThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.thoughtId }, body, { new: true })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ 'message': `There is no thought with id ${params.thoughtId}`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Delete a thought
    deleteAThought({ params }, res) {
        Thought.deleteOne({ _id: params.thoughtId })
        .then(deletedThought => {
            if(!deletedThought) {
                res.status(404).json({ 'message': `There is no thought with id ${params.thoughtId}`});
                return;
            }
            //Remove Thought from User's thoughts array
            return { deletedThought, updatedUser: User.findByIdAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId }},
                { new: true }
            )};
        })
        .then(outputObject => {
            if(!outputObject) {
                res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                return;
            }
            res.json(outputObject)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //React to a thought
    reactToAThought({ params, body }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ 'message': `There is no thought with id ${params.thoughtId}`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Remove a reaction to a thought
    removeReaction({ params }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
        .then(updatedThought => {
            if(!updatedThought) {
                res.status(404).json({ 'message': `There is no thought with id ${params.thoughtId}`});
                return;
            }
            res.json(updatedThought);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
};

module.exports = thoughtController;