//nodeserver.js
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
  Goal: {
    type: DataTypes. INTEGER,
    allowNull: true
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
    allowNull: false
  }
}, {
  timestamps: true // createdAt 및 updatedAt 필드를 자동으로 관리
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { name, userid, password, email, adminCode } = req.body;

  try {
    await sequelize.sync();
    
    // 이미 사용 중인 이메일인지 확인
    const existingUserEmail = await Users.findOne({ where: { Email: email } });
    if (existingUserEmail) {
      console.log("이미 사용 중인 이메일입니다.");
      res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
      return;
    }

    // 이미 사용 중인 ID인지 확인
    const existingUserId = await Users.findOne({ where: { Userid: userid } });
    if (existingUserId) {
      console.log("이미 사용 중인 ID입니다.");
      res.status(400).json({ error: "이미 사용 중인 ID입니다." });
      return;
    }

    const user = await Users.create({
      Name: name,
      Userid: userid,
      Password: password,
      Email: email,
      Admin: adminCode === 'sogong8',
      Goal: null,
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


app.post('/find-id', async (req, res) => {
  const { name, email } = req.body;

  try {
    await sequelize.sync();
    const user = await Users.findOne({ where: { Name: name, Email: email } });

    if (user) {
      res.status(200).json({ id: user.Userid });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('아이디 찾기 중 오류:', error);
    res.sendStatus(500);
  }
});

app.post('/find-password', async (req, res) => {
  const { name, id, email } = req.body;

  try {
    await sequelize.sync();
    const user = await Users.findOne({ where: { Name: name, Userid: id, Email: email } });

    if (user) {
      res.status(200).json({ password: user.Password });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('비밀번호 찾기 중 오류:', error);
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
            Goal: user.Goal,
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
    // Get the user information from the session
    const { user } = req.session;
  
    console.log(user);
  
    // Check if the user exists and is an admin
    const isAdmin = user && user.Admin;
    const username = user ? user.Name : '';
  
    res.status(200).json({ isAdmin, username });
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

// 단어 목록 조회 API
app.get('/words', async (req, res) => {
  try {
    // 데이터베이스에서 단어 목록 조회
    const words = await Words.findAll();

    // 조회된 단어 데이터를 JSON 형식으로 반환
    res.json({ words });
  } catch (error) {
    // 오류 처리
    console.error('단어 목록 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ error: '단어 목록 조회 중 오류가 발생했습니다.' });
  }
});

app.put('/words/:english', async (req, res) => {
  const english = req.params.english;
  const { memo } = req.body;

  try {
    const word = await Words.findOne({ where: { English: english } });
    if (!word) {
      res.status(404).json({ error: '단어를 찾을 수 없습니다.' });
      return;
    }

    // Memo 업데이트
    word.Memo = memo;
    await word.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Memo 업데이트 중 오류가 발생했습니다:', error);
    res.status(500).json({ error: 'Memo 업데이트 중 오류가 발생했습니다.' });
  }
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
  

  app.post('/ability-test', async (req, res) => {
    const { userid, score, level } = req.body;
  
    try {
      await sequelize.sync();
      const user = await Users.findOne({ where: { Userid: userid } });
  
      if (user) {
        // Update the user's score and level
        user.Score = score;
        user.Level = level;
        await user.save();
  
        console.log('능력 평가 결과가 업데이트되었습니다:', user.toJSON());
        res.status(200).json({ success: true });
      } else {
        console.log('사용자를 찾을 수 없습니다.');
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('능력 평가 결과 업데이트 중 오류가 발생했습니다:', error);
      res.sendStatus(500);
    }
  });

  app.get('/words2', async (req, res) => {
    try {
      // 데이터베이스에서 단어 목록 조회
      const words = await Words.findAll();
  
      // 조회된 단어 데이터를 JSON 형식으로 반환
      res.json(words);
    } catch (error) {
      // 오류 처리
      console.error('단어 목록 조회 중 오류가 발생했습니다:', error);
      res.status(500).json({ error: '단어 목록 조회 중 오류가 발생했습니다.' });
    }
  });

  app.get('/wrong-choices', async (req, res) => {
    try {
      const words = await Words.findAll({
        attributes: ['Meaning'],
        limit: 3
      });
  
      const wrongChoices = words.map((word) => word.Meaning); // 선택지 배열 생성
  
      res.json({ wrongChoices }); // 선택지 배열을 전송
    } catch (error) {
      console.error('Failed to retrieve wrong choices:', error);
      res.status(500).json({ error: 'Failed to retrieve wrong choices.' });
    }
  });
  
  

  app.post('/update-user-level', (req, res) => {
    const { level } = req.body;
    const { userId } = req.session; // 사용자 세션에서 userId 가져오기
  
    // userId를 사용하여 해당 사용자를 Users DB에서 찾음
    Users.findOne({ where: { Userid: userId } })
      .then((user) => {
        if (user) {
          // 사용자가 존재하는 경우 레벨을 업데이트
          user.update({ Level: level })
            .then(() => {
              res.json({ success: true });
            })
            .catch((error) => {
              console.error('Error updating user level:', error);
              res.json({ success: false });
            });
        } else {
          // 사용자가 존재하지 않는 경우
          res.json({ success: false });
        }
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.json({ success: false });
      });
  });
  
  app.listen(port, () => {
    console.log(`서버가 실행되었습니다. http://localhost:${port}`);
  });

  // ======================단어 삽입=========================== //

  async function addWords(english, meaning, verb, day) {
    try {
      await sequelize.sync();
      
      // 이미 존재하는 단어인지 확인
      const existingWord = await Words.findOne({
        where: { English: english }
      });
  
      // 이미 존재하는 단어인 경우 추가하지 않음
      if (existingWord) {
        console.log('이미 존재하는 단어입니다:', existingWord.toJSON());
        return null;
      }
  
      // 존재하지 않는 단어인 경우 추가
      const word = await Words.create({
        English: english,
        Meaning: meaning,
        Verb: verb,
        Day: day
      });
  
      console.log('단어가 추가되었습니다:', word.toJSON());
      return word.toJSON();
    } catch (error) {
      console.error('단어 추가 오류:', error);
      throw error;
    }
  }


  
  addWords('discard', '버리다', '동사', 1);
  addWords('advantageous', '유리한', '형용사', 1);
  addWords('contribute', '기여하다', '동사', 1);
  addWords('decrease', '감소하다', '동사', 1);
  addWords('examine', '조사하다', '동사', 1);
  addWords('fundamental', '근본적인', '형용사', 1);
  addWords('generate', '생성하다', '동사', 1);
  addWords('hinder', '방해하다', '동사', 1);
  addWords('illustrate', '예시로 보여주다', '동사', 1);
  addWords('juncture', '시점', '명사', 1);
  addWords('accomplish', '달성하다', '동사', 1);
  addWords('leisure', '여가', '명사', 1);
  addWords('magnify', '확대하다', '동사', 1);
  addWords('negotiate', '협상하다', '동사', 1);
  addWords('objective', '목표', '명사', 1);
  addWords('pursue', '추구하다', '동사', 1);
  addWords('qualify', '자격을 얻다', '동사', 1);
  addWords('reliable', '믿을 만한', '형용사', 1);
  addWords('substantial', '상당한', '형용사', 1);
  addWords('terminate', '끝내다', '동사', 1);
  
  addWords('ability', '능력', '명사', 2);
  addWords('business', '비즈니스', '명사', 2);
  addWords('customer', '고객', '명사', 2);
  addWords('decision', '결정', '명사', 2);
  addWords('education', '교육', '명사', 2);
  addWords('factor', '요소', '명사', 2);
  addWords('global', '세계적인', '형용사', 2);
  addWords('health', '건강', '명사', 2);
  addWords('industry', '산업', '명사', 2);
  addWords('job', '일', '명사', 2);
  addWords('knowledge', '지식', '명사', 2);
  addWords('language', '언어', '명사', 2);
  addWords('management', '관리', '명사', 2);
  addWords('necessary', '필요한', '형용사', 2);
  addWords('organization', '조직', '명사', 2);
  addWords('production', '생산', '명사', 2);
  addWords('quality', '질', '명사', 2);
  addWords('resource', '자원', '명사', 2);
  addWords('strategy', '전략', '명사', 2);
  addWords('technology', '기술', '명사', 2);

  addWords('analyze', '분석하다', '동사', 3);
  addWords('collaborate', '협력하다', '동사', 3);
  addWords('efficiency', '효율성', '명사', 3);
  addWords('expand', '확장하다', '동사', 3);
  addWords('innovation', '혁신', '명사', 3);
  addWords('motivate', '동기를 부여하다', '동사', 3);
  addWords('productivity', '생산성', '명사', 3);
  addWords('resolve', '해결하다', '동사', 3);
  addWords('skill', '기술', '명사', 3);
  addWords('strategic', '전략적인', '형용사', 3);
  addWords('team', '팀', '명사', 3);
  addWords('training', '훈련', '명사', 3);
  addWords('vision', '비전', '명사', 3);
  addWords('goal', '목표', '명사', 3);
  addWords('performance', '성과', '명사', 3);
  addWords('communication', '의사 소통', '명사', 3);
  addWords('leadership', '리더십', '명사', 3);
  addWords('problem-solving', '문제 해결', '명사', 3);
  addWords('decision-making', '의사 결정', '명사', 3);
  addWords('organizational', '조직의', '형용사', 3);

  addWords('acquire', '습득하다', '동사', 4);
  addWords('adapt', '적응하다', '동사', 4);
  addWords('challenge', '도전', '명사', 4);
  addWords('commitment', '헌신', '명사', 4);
  addWords('creativity', '창의성', '명사', 4);
  addWords('diligent', '근면한', '형용사', 4);
  addWords('empower', '권한을 부여하다', '동사', 4);
  addWords('entrepreneur', '기업가', '명사', 4);
  addWords('ethical', '윤리적인', '형용사', 4);
  addWords('flexibility', '유연성', '명사', 4);
  addWords('initiative', '주도적인 태도', '명사', 4);
  addWords('innovative', '혁신적인', '형용사', 4);
  addWords('market', '시장', '명사', 4);
  addWords('network', '네트워크', '명사', 4);
  addWords('problem-solving', '문제 해결', '명사', 4);
  addWords('resilience', '탄력', '명사', 4);
  addWords('strategic', '전략적인', '형용사', 4);
  addWords('teamwork', '팀워크', '명사', 4);
  addWords('vision', '비전', '명사', 4);
  addWords('work-life balance', '일과 삶의 균형', '명사', 4);

  addWords('abandon', '버리다', '동사', 5);
  addWords('benefit', '이익', '명사', 5);
  addWords('compete', '경쟁하다', '동사', 5);
  addWords('develop', '개발하다', '동사', 5);
  addWords('efficient', '효율적인', '형용사', 5);
  addWords('flexible', '유연한', '형용사', 5);
  addWords('global', '세계적인', '형용사', 5);
  addWords('hire', '고용하다', '동사', 5);
  addWords('increase', '증가하다', '동사', 5);
  addWords('jobseeker', '구직자', '명사', 5);
  addWords('knowledge', '지식', '명사', 5);
  addWords('leadership', '리더십', '명사', 5);
  addWords('negotiate', '협상하다', '동사', 5);
  addWords('opportunity', '기회', '명사', 5);
  addWords('performance', '성과', '명사', 5);
  addWords('qualify', '자격을 갖추다', '동사', 5);
  addWords('resource', '자원', '명사', 5);
  addWords('strategy', '전략', '명사', 5);
  addWords('team', '팀', '명사', 5);
  addWords('unique', '독특한', '형용사', 5);
