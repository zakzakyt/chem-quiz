const express = require('express');
const app = express();
const compounds = require('./data'); // 修正済みのデータ配列

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

let currentSession = {
    targetId: null,
    turnCount: 0,
    history: [] // 質問の履歴（フィルタ条件）を保存
};

// 判定ロジック関数（全化合物へのフィルタリングで再利用するため独立化）
function checkCondition(compound, targetProp, value, operator) {
    const compoundValue = compound[targetProp];

    // ★ 名前（文字列）の比較用に追加
    if (targetProp === 'name') {
        return compoundValue === value;
    }

    const numValue = parseInt(value, 10);

    // ブール値（フラグ）の場合の処理
    if (["reaction_acid", "reaction_silver", "reaction_iodoform", "reaction_fe", "reaction_sodium", "reaction_bromine", "reaction_dehydrate", "is_chiral"].includes(targetProp)) {
        return (compoundValue === 1) === (numValue === 1); // 1ならYes
    }

    // 数値比較の場合
    if (operator === 'equal') return compoundValue === numValue;
    if (operator === 'gte') return compoundValue >= numValue;
    if (operator === 'lte') return compoundValue <= numValue;
    return false;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/api/reset', (req, res) => {
    const randomTarget = compounds[Math.floor(Math.random() * compounds.length)];
    currentSession = {
        targetId: randomTarget.id,
        turnCount: 0,
        history: [] // 履歴をリセット
    };
    console.log(`[RESET] 新しい正解: ${randomTarget.name} (ID: ${randomTarget.id})`);
    // リセット時は全件数が残り候補
    res.json({ message: "Reset complete", totalCandidates: compounds.length });
});

app.post('/api/ask', (req, res) => {
    const { target, value, operator } = req.body;
    currentSession.turnCount++;

    const targetCompound = compounds.find(c => c.id === currentSession.targetId);
    
    // 1. 正解データに対する判定（Yes/No）
    const isMatch = checkCondition(targetCompound, target, value, operator);
    const answerStr = isMatch ? "はい" : "いいえ";

    // 2. この質問結果を履歴に追加
    // Yesなら「その条件を満たすもの」、Noなら「その条件を満たさないもの」が絞り込み条件になる
    currentSession.history.push({
        targetProp: target,
        value: value,
        operator: operator,
        mustMatch: isMatch // trueなら条件合致が必須、falseなら条件不一致が必須
    });

    // 3. 全化合物をスキャンして、現在の履歴すべてに矛盾しない候補を数える
    const remainingCandidates = compounds.filter(c => {
        return currentSession.history.every(condition => {
            const check = checkCondition(c, condition.targetProp, condition.value, condition.operator);
            return condition.mustMatch ? check : !check;
        });
    });

    res.json({
        answer: answerStr,
        currentTurn: currentSession.turnCount,
        remainingCount: remainingCandidates.length // ★ここが新機能！
    });
});

app.post('/api/guess', (req, res) => {
    const { name } = req.body;
    currentSession.turnCount++;
    const targetCompound = compounds.find(c => c.id === currentSession.targetId);
    const correct = targetCompound.name === name;

    // ★ 不正解だった場合、その名前を「除外条件」として履歴に追加
    if (!correct) {
        currentSession.history.push({
            targetProp: 'name',
            value: name,
            operator: 'equal',
            mustMatch: false // 「この名前と一致してはいけない」という条件
        });
    }

    // ★ 現在の履歴すべてに矛盾しない候補を数え直す
    const remainingCandidates = compounds.filter(c => {
        return currentSession.history.every(condition => {
            const check = checkCondition(c, condition.targetProp, condition.value, condition.operator);
            return condition.mustMatch ? check : !check;
        });
    });
    
    res.json({
        correct: correct,
        currentTurn: currentSession.turnCount,
        image: correct ? targetCompound.image : null,
        finalTurn: currentSession.turnCount,
        formula: correct ? targetCompound.formula : null
    });
});

app.post('/api/giveup', (req, res) => {
    const targetCompound = compounds.find(c => c.id === currentSession.targetId);
    res.json({
        name: targetCompound.name,
        image: targetCompound.image,
        turnCount: currentSession.turnCount,
        formula: targetCompound.formula
    });
});

// --- app.js に追加 ---
// オートコンプリート用の名前リストを取得するAPI
app.get('/api/compounds/names', (req, res) => {
    const names = compounds.map(c => c.name);
    res.json(names);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));