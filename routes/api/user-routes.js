//Import modules
const router = require('express').Router();
const { getAllUsers, getOneUser, createNewUser, updateUserInfo, deleteUser, addAFriend, dropAFriend } = require('../../controllers/user-controller');

router.route('/')
.get(getAllUsers)
.post(createNewUser);

router.route('/:userId')
.get(getOneUser)
.put(updateUserInfo)
.delete(deleteUser);

router.route('/:userId/friends/:friendId')
.post(addAFriend)
.delete(dropAFriend);

module.exports = router;