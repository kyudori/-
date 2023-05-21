const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;
app.use(express.static('public'));

const session = require('express-session');
app.use(session({
    secret: 'sogong8',  // 세션의 비밀 키 설정
    resave: false,
    saveUninitialized: false
  }));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Users = sequelize.define('Users', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Userid: {  // 변경된 열 이름: Userid
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {  // 변경된 열 이름: Email
    type: DataTypes.STRING,
    allowNull: false
  },
  Admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  Score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Level: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true // createdAt 및 updatedAt 필드를 자동으로 관리
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
app.use(express.json());

app.post('/register', async (req, res) => {
  const { name, userid, password, email, adminCode } = req.body;  // 변경된 변수 이름: userid
  
  try {
    await sequelize.sync();
    const user = await Users.create({
      Name: name,
      Userid: userid,  // 변경된 열 이름: Userid
      Password: password,
      Email: email,  // 변경된 열 이름: Email
      Admin: adminCode === 'sogong8',
      Score: null,
      Level: null
    });
    console.log("사용자가 회원 가입되었습니다.");
    console.log(user.toJSON());
    res.status(200).json({ admin: user.Admin });
  } catch (error) {
    console.error("회원 가입 중 오류가 발생했습니다:", error);
    res.sendStatus(500);
  }
});

app.post('/login', async (req, res) => {
    const { userid, password } = req.body;
  
    try {
      await sequelize.sync();
      const user = await Users.findOne({ where: { Userid: userid } });
  
      if (user && user.Password === password) {
        console.log('로그인 성공:', user.toJSON());
        req.session.user = {
            id: user.id,
            Name: user.Name,
            Userid: user.Userid,
            Password: user.Password,
            Email: user.Email,
            Admin: user.Admin,
            Score: user.Score,
            Level: user.Level,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        res.status(200).json({ loggedIn: true, admin: user.Admin });
      } else {
        console.log('로그인 실패');
        res.status(200).json({ loggedIn: false });
      }
    } catch (error) {
      console.error('로그인 중 오류:', error);
      res.sendStatus(500);
    }
  });

  app.get('/grade', async (req, res) => {
    const { userid } = req.query;
  
    if (!userid) {
      res.status(400).json({ error: '사용자 아이디를 제공해야 합니다.' });
      return;
    }
  
    try {
      await sequelize.sync();
      const user = await Users.findOne({ where: { Userid: userid } });
  
      if (!user) {
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        return;
      }
  
      let grade;
      if (user.Admin) {
        grade = '관리자';
      } else {
        grade = '일반회원';
      }
  
      res.status(200).json({ grade, admin: user.Admin });
    } catch (error) {
      console.error('등급 조회 중 오류:', error);
      res.sendStatus(500);
    }
  });

  app.get('/admin', (req, res) => {
    // 세션에서 사용자 정보 가져오기
    const { user } = req.session;

    console.log(user);
  
    // 사용자가 존재하고 관리자인지 확인
    const isAdmin = user && user.Admin;
  
    res.status(200).json({ isAdmin });
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('로그아웃 중 오류:', err);
        res.sendStatus(500); // 내부 서버 오류
      } else {
        res.sendStatus(200); // OK
      }
    });
  });


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