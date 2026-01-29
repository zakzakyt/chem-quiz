const express = require('express');
const app = express();
const compounds = require('./data'); // data.jsを読み込む

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public')); // 画像フォルダ公開

let secretCompound = null;
let turnCount = 0;

// ゲーム開始・リセット処理
function startNewGame() {
    // ★修正: 難易度に関係なく、常にすべての化合物(compounds)を候補にする
    let candidates = compounds;
    
    // ランダム選択
    const randomIndex = Math.floor(Math.random() * candidates.length);
    secretCompound = candidates[randomIndex];
    turnCount = 0;
    
    console.log(`[統一モード] 新しい正解: ${secretCompound.name} (ID: ${secretCompound.id})`);
}

// サーバー起動時に一度実行
startNewGame('easy');

// トップページ
app.get('/', (req, res) => {
    res.render('index');
});

// 質問API
app.post('/api/ask', (req, res) => {
    // サーバー再起動直後などのエラー防止
    if (!secretCompound) startNewGame('easy');

    const { target, value, operator } = req.body;
    turnCount++;

    // 元々の値を取得
    let actualValue = secretCompound[target] || 0;

    // ★修正ポイント：化学的なルールの補正
    // 「二重結合」について聞かれた場合、ベンゼン環があれば「+3個」としてカウントする
    if (target === 'double_bond') {
        const explicitDouble = secretCompound.double_bond || 0; // 側鎖の二重結合（スチレンなど）
        const benzeneCount = secretCompound.ring_benzene || 0;  // ベンゼン環の数
        
        // 合計 = 側鎖の分 + (ベンゼン環 × 3)
        actualValue = explicitDouble + (benzeneCount * 3);
    }

    const userValue = Number(value);
    let isYes = false;

    // 判定ロジック
    switch (operator) {
        case 'equal': isYes = (actualValue === userValue); break;
        case 'gte':   isYes = (actualValue >= userValue); break;
        case 'lte':   isYes = (actualValue <= userValue); break;
    }

    res.json({ answer: isYes ? "はい" : "いいえ", currentTurn: turnCount });
});

// 回答API
app.post('/api/guess', (req, res) => {
    if (!secretCompound) startNewGame('easy');

    const { name } = req.body;
    turnCount++;

    if (secretCompound.name === name) {
        res.json({ 
            correct: true, 
            finalTurn: turnCount,
            image: secretCompound.image,
            formula: secretCompound.formula
        });
    } else {
        res.json({ correct: false, currentTurn: turnCount });
    }
});

// ギブアップAPI
app.post('/api/giveup', (req, res) => {
    if (!secretCompound) startNewGame('easy');
    
    res.json({
        name: secretCompound.name,
        image: secretCompound.image,
        formula: secretCompound.formula,
        turnCount: turnCount
    });
});

// リセットAPI
app.post('/api/reset', (req, res) => {
    // ★修正: 難易度(difficulty)を受け取らず、単にスタートする
    startNewGame();
    res.json({ message: "OK" });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});