const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');
const Likes = require('../models/like');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  //console.log(req.user)
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      console.log('User : ', user);
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로우 취소
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (err) {
    console.dir(err);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  //console.log(req.params)
  const { UserId, PostId } = await req.body;
  try {
    console.log(UserId, PostId);
    if (UserId !== null && PostId !== null) {
      await Likes.create({
        UserId,
        PostId,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/check', isLoggedIn, async (req, res, next) => {
  //console.log(req.params)
  const { UserId, PostId } = await req.body;
  try {
    const LikeFindAll = Likes.findAll({
      where: {
        UserId: UserId,
      },
    }).then((result) => {
      console.log(result);
      var chk;
      result.map((data) => {
        console.log(data.dataValues.PostId, '      ', PostId);
        if (data.dataValues.PostId === PostId) {
          chk = true;
        }
      });
      if (chk) {
        res.send('true');
      } else {
        res.send('false');
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
  //console.log(req.params)
  const { UserId, PostId } = await req.body;
  try {
    if (UserId !== null && PostId !== null) {
      await Likes.destroy({
        where: {
          UserId: UserId,
          PostId: PostId,
        },
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//닉네임 수정
router.post('/change', isLoggedIn, async (req, res, next) => {
  const changeName = req.body.name;
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      User.update({ nick: changeName }, { where: { id: req.user.id } });
      return res.send('닉네임 변경 완료');
    } else {
      res.status(404).send('유저가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
