const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;
app.use(express.static('public'));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Words = sequelize.define('Words', {
  English: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Meaning: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Verb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Memo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Day: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true // createdAt 및 updatedAt 필드를 자동으로 관리
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 데이터 파싱을 위해 추가

app.post('/word-add', async (req, res) => {
  const { english, meaning, verb, day } = req.body;

  try {
    await sequelize.sync();
    const word = await Words.create({
      English: english,
      Meaning: meaning,
      Verb: verb,
      Day: day
    });
    console.log("단어가 추가되었습니다.");
    console.log(word.toJSON());
    res.sendStatus(200);
  } catch (error) {
    console.error("단어 추가 중 오류가 발생했습니다:", error);
    res.sendStatus(500);
  }
});

// 단어 수정
app.put('/mod-word', async (req, res) => {
    const { search, English, Meaning, Verb } = req.body;
  
    try {
      await sequelize.sync();
      const word = await Words.findOne({
        where: {
          English: search
        }
      });
  
      if (word) {
        word.English = English;
        word.Meaning = Meaning;
        word.Verb = Verb;
        await word.save();
        console.log("단어가 수정되었습니다.");
        console.log(word.toJSON());
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('단어 수정 중 오류가 발생했습니다.', error);
      res.sendStatus(500);
    }
  });

app.get('/search-word', async (req, res) => {
  const { search } = req.query;

  try {
    await sequelize.sync();
    const word = await Words.findOne({
      where: {
        English: search
      }
    });

    if (word) {
      res.status(200).json(word.toJSON());
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('단어 검색 중 오류가 발생했습니다.', error);
    res.sendStatus(500);
  }
});
  
  app.delete('/delete-word', async (req, res) => {
    const { search } = req.query;
  
    try {
      await sequelize.sync();
      const result = await Words.destroy({
        where: {
          English: search
        }
      });
  
      if (result === 1) {
        console.log('단어가 성공적으로 삭제되었습니다.');
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('단어 삭제 중 오류가 발생했습니다.', error);
      res.sendStatus(500);
    }
  });
  
  
  app.get('/go-back', (req, res) => {
    // 이전 페이지의 URL로 리다이렉트
    const referer = req.headers.referer;
    res.redirect(referer);
  });
  
  app.listen(port, () => {
    console.log(`서버가 실행되었습니다. http://localhost:${port}`);
  });
  