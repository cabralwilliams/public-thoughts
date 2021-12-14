//Import modules
const { User, Thought } = require('../models');

async function clearThoughts(gatheredThoughts) {
    const output = await gatheredThoughts.map(thought => {
        let returnedThought;
        return Thought.findById({ _id: thought._id })
        .select('-__v')
        .then(retrievedThought => {
            returnedThought = retrievedThought;
            //Now clear the thought
            Thought.findByIdAndDelete({ _id: thought._id })
            .then(() => {
                //Return returnedThought
                return returnedThought;
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
    });

    return output;
}

const userController = {
    //Retrieve all users in the database
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Retrieve a user and her/his thoughts and friends by user _id
    getOneUser({ params }, res) {
        User.findOne({ _id: params.userId })
        .select('-__v')
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Create a user - check to see if username has been used already
    createNewUser({ body }, res) {
        User.findOne({ username: body.username })
        .then(dbUserData => {
            if(dbUserData) {
                res.status(403).json({ 'message': `The username ${body.username} is already in use`});
                return;
            }
            //Check to see if email address is unique
            User.findOne({ email: body.email })
            .then(dbUserData2 => {
                if(dbUserData2) {
                    res.status(403).json({ 'message': `The email address ${body.email} is already in use`});
                    return;
                }
                //Check to see if email is proper pattern
                const properEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(body.email);
                if(!properEmail) {
                    res.status(400).json({ 'message': `The email address provided, ${body.email}, is not properly formatted.`});
                    return;
                }
                //Create the new user if these tests both pass
                User.create(body)
                .then(dbUserData3 => res.json(dbUserData3))
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Update a user's information
    updateUserInfo({ body, params }, res) {
        User.findByIdAndUpdate({ _id: params.userId}, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Delete a user
    deleteUser({ params }, res) {
        //Delete user's thoughts first
        //Start by checking if the user exists
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '_id'
        })
        .then(dbUserData => {
            //Is there a user to delete?
            if(!dbUserData) {
                res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                return;
            }
            //Now, delete the thoughts
            if(dbUserData.thoughts.length > 0) {
                clearThoughts(dbUserData.thoughts)
                .then(deletedThoughts => {
                    //Now, delete the user
                    User.findByIdAndDelete({ _id: params.userId })
                    .then(deletedUser => {
                        const finalObject = { deletedUser, deletedThoughts };
                        res.json(finalObject);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    });
                });
            } else {
                //Now, delete the user
                User.findByIdAndDelete({ _id: params.userId })
                .then(deletedUser => {
                    const finalObject = { deletedUser, deletedThoughts: [] };
                    res.json(finalObject);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Add a friend
    addAFriend({ params }, res) {
        //Check to see if friendId exists first
        User.findById({ _id: params.friendId })
        .then(dbFriend => {
            if(!dbFriend) {
                res.status(404).json({ 'message': `There is no user with id ${params.friendId}`});
                return;
            }
            //Friend exists - now check to see if user exists
            User.findByIdAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId }}, { new: true })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Drop a friend
    dropAFriend({ params }, res) {
        //Search to see if friendId exists first
        User.findById({ _id: params.friendId })
        .then(dbFriend => {
            if(!dbFriend) {
                res.status(404).json({ 'message': `There is no user with id ${params.friendId}`});
                return;
            }
            //Friend exists - now check to see if user exists
            User.findByIdAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId }}, { new: true })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ 'message': `There is no user with id ${params.userId}`});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
};

module.exports = userController;