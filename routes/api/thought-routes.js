//Import modules
const router = require('express').Router();
const { getAllThoughts, getAThought, createAThought, updateAThought, deleteAThought, reactToAThought, removeReaction } = require('../../controllers/thought-controller');

router.route('/')
.get(getAllThoughts)
.post(createAThought);

router.route('/:thoughtId')
.get(getAThought)
.put(updateAThought);

router.route('/:thoughtId/:userId')
.delete(deleteAThought);

router.route('/:thoughtId/reactions')
.post(reactToAThought);

router.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;