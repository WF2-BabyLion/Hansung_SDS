const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

//삭제
router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.id;
    await Post.destroy({
      where: { id: postId },
    });
    res.send('글 삭제 완료');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//수정
router.post('/:id/edit', isLoggedIn, async (req, res, next) => {
  const changeContent = req.body.EditContent;
  try {
    const twitId = await Post.findOne({ where: { id: req.params.id } });
    if (twitId) {
      Post.update({ content: changeContent }, { where: { id: req.params.id } });
      return res.send('게시글 수정 완료');
    } else {
      res.status(404).send('유저가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
