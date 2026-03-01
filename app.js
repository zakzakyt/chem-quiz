const express = require('express');
const app = express();
const compounds = require('./data');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// ★ グローバル変数 currentSession は削除されました！（ステートレス化）

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

app.get('/api/compounds/names', (req, res) => {
    res.json(compounds.map(c => c.name));
});

app.get('/api/compounds/zukan', (req, res) => {
    res.json(compounds.map(c => ({ id: c.id, name: c.name, formula: c.formula, image: c.image })));
});

// リセット時：正解のID「だけ」をブラウザに返す
app.post('/api/reset', (req, res) => {
    const randomTarget = compounds[Math.floor(Math.random() * compounds.length)];
    console.log(`[RESET] 新しい正解ID: ${randomTarget.id}`);
    res.json({ targetId: randomTarget.id, totalCandidates: compounds.length });
});

// 質問時：ブラウザから「ID」と「これまでの履歴」を受け取って判定する
app.post('/api/ask', (req, res) => {
    const { targetId, history, target, value, operator } = req.body;
    const targetCompound = compounds.find(c => c.id === targetId);
    
    const isMatch = checkCondition(targetCompound, target, value, operator);
    const newHistoryItem = { targetProp: target, value: value, operator: operator, mustMatch: isMatch };
    
    // サーバー上で一時的に履歴を結合して残り件数を計算
    const updatedHistory = [...history, newHistoryItem];
    const remainingCandidates = compounds.filter(c => {
        return updatedHistory.every(condition => {
            const check = checkCondition(c, condition.targetProp, condition.value, condition.operator);
            return condition.mustMatch ? check : !check;
        });
    });

    res.json({
        answer: isMatch ? "はい" : "いいえ",
        remainingCount: remainingCandidates.length,
        newHistoryItem: newHistoryItem // ブラウザに記憶させるための新しい履歴
    });
});

// 回答時：同じくブラウザからのデータを使って判定
app.post('/api/guess', (req, res) => {
    const { targetId, history, name } = req.body;
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
        correct: correct,
        id: targetCompound.id,
        image: correct ? targetCompound.image : null,
        formula: correct ? targetCompound.formula : null,
        remainingCount: remainingCandidates.length,
        newHistoryItem: newHistoryItem
    });
});

// 降参時：ブラウザから送られたIDの答えを返す
app.post('/api/giveup', (req, res) => {
    const { targetId } = req.body;
    const targetCompound = compounds.find(c => c.id === targetId);
    res.json({
        name: targetCompound.name,
        image: targetCompound.image,
        formula: targetCompound.formula
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));