const express = require('express');
const app = express();
const compounds = require('./data');
// ★ JWTライブラリの読み込み
const jwt = require('jsonwebtoken');

// ★ 暗号化のための「秘密鍵」（絶対にユーザーには教えないサーバーだけのパスワード）
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-chem-key-2026';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

function checkCondition(compound, targetProp, value, operator) {
    const compoundValue = compound[targetProp];
    if (targetProp === 'name') return compoundValue === value;
    const numValue = parseInt(value, 10);
    if (["reaction_acid", "reaction_silver", "reaction_iodoform", "reaction_fe", "reaction_sodium", "reaction_bromine", "reaction_dehydrate", "is_chiral"].includes(targetProp)) {
        return (compoundValue === 1) === (numValue === 1); 
    }
    if (operator === 'equal') return compoundValue === numValue;
    if (operator === 'gte') return compoundValue >= numValue;
    if (operator === 'lte') return compoundValue <= numValue;
    return false;
}

app.get('/', (req, res) => { res.render('index'); });
app.get('/api/compounds/names', (req, res) => { res.json(compounds.map(c => c.name)); });
app.get('/api/compounds/zukan', (req, res) => { res.json(compounds.map(c => ({ id: c.id, name: c.name, formula: c.formula, image: c.image }))); });

// --- API ---

app.post('/api/reset', (req, res) => {
    const randomTarget = compounds[Math.floor(Math.random() * compounds.length)];
    // ★ IDをそのまま渡さず、秘密鍵を使って暗号化（署名）した「トークン」を作成する
    const token = jwt.sign({ targetId: randomTarget.id }, SECRET_KEY);
    
    console.log(`[RESET] 新しい正解ID: ${randomTarget.id} (Tokenを発行しました)`);
    res.json({ token: token, totalCandidates: compounds.length }); // targetIdではなくtokenを返す
});

app.post('/api/ask', (req, res) => {
    const { token, history, target, value, operator } = req.body;
    
    // ★ 受け取ったトークンを秘密鍵で復号化して、中からターゲットIDを取り出す
    let targetId;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        targetId = decoded.targetId;
    } catch (err) {
        return res.status(400).json({ error: "不正なトークン（カンニングや改ざん）を検知しました" });
    }

    const targetCompound = compounds.find(c => c.id === targetId);
    const isMatch = checkCondition(targetCompound, target, value, operator);
    const newHistoryItem = { targetProp: target, value: value, operator: operator, mustMatch: isMatch };
    
    const updatedHistory = [...history, newHistoryItem];
    const remainingCandidates = compounds.filter(c => {
        return updatedHistory.every(condition => {
            const check = checkCondition(c, condition.targetProp, condition.value, condition.operator);
            return condition.mustMatch ? check : !check;
        });
    });

    res.json({ answer: isMatch ? "はい" : "いいえ", remainingCount: remainingCandidates.length, newHistoryItem: newHistoryItem });
});

app.post('/api/guess', (req, res) => {
    const { token, history, name } = req.body;
    
    // ★ 復号化
    let targetId;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        targetId = decoded.targetId;
    } catch (err) {
        return res.status(400).json({ error: "不正なトークンを検知しました" });
    }

    const targetCompound = compounds.find(c => c.id === targetId);
    const correct = targetCompound.name === name;

    let updatedHistory = history;
    let newHistoryItem = null;

    if (!correct) {
        newHistoryItem = { targetProp: 'name', value: name, operator: 'equal', mustMatch: false };
        updatedHistory = [...history, newHistoryItem];
    }

    const remainingCandidates = compounds.filter(c => {
        return updatedHistory.every(condition => {
            const check = checkCondition(c, condition.targetProp, condition.value, condition.operator);
            return condition.mustMatch ? check : !check;
        });
    });

    res.json({
        correct: correct, id: targetCompound.id, image: correct ? targetCompound.image : null,
        formula: correct ? targetCompound.formula : null, remainingCount: remainingCandidates.length, newHistoryItem: newHistoryItem
    });
});

app.post('/api/giveup', (req, res) => {
    const { token } = req.body;
    
    // ★ 復号化
    let targetId;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        targetId = decoded.targetId;
    } catch (err) {
        return res.status(400).json({ error: "不正なトークンを検知しました" });
    }

    const targetCompound = compounds.find(c => c.id === targetId);
    res.json({ name: targetCompound.name, image: targetCompound.image, formula: targetCompound.formula });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));