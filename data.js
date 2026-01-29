const compounds = [
    /* =========================
       Level 1: 基礎・脂肪族 (Easy)
       ========================= */
    { 
        id: 1, name: "メタン", difficulty: "easy", 
        C: 1, H: 4, O: 0, formula: "CH4", image: "methane.png" 
    },
    { 
        id: 2, name: "エチレン", difficulty: "easy", 
        C: 2, H: 4, O: 0, double_bond: 1, formula: "C2H4", image: "ethylene.png",
        reaction_bromine: 1 // 臭素水の脱色
    },
    { 
        id: 3, name: "アセチレン", difficulty: "easy", 
        C: 2, H: 2, O: 0, triple_bond: 1, formula: "C2H2", image: "acetylene.png",
        reaction_bromine: 1
    },
    { 
        id: 4, name: "エタノール", difficulty: "easy", 
        C: 2, H: 6, O: 1, group_oh: 1, formula: "C2H5OH", image: "ethanol.png",
        reaction_iodoform: 1, reaction_sodium: 1
    },
    { 
        id: 5, name: "酢酸", difficulty: "easy", 
        C: 2, H: 4, O: 2, group_cooh: 1, double_bond_total: 1, formula: "CH3COOH", image: "acetic_acid.png",
        reaction_acid: 1 // 酸性を示す
    },
    { 
        id: 6, name: "アセトン", difficulty: "easy", 
        C: 3, H: 6, O: 1, group_co: 1, double_bond_total: 1, formula: "CH3COCH3", image: "acetone.png",
        reaction_iodoform: 1
    },

    /* =========================
       Level 2: 応用・芳香族 (Hard)
       ========================= */
    
    // --- アルデヒド・エーテル ---
    { 
        id: 7, name: "ホルムアルデヒド", difficulty: "hard", 
        C: 1, H: 2, O: 1, group_cho: 1, double_bond_total: 1, formula: "HCHO", image: "formaldehyde.png",
        reaction_silver: 1 // 銀鏡反応（還元性）
    },
    { 
        id: 8, name: "アセトアルデヒド", difficulty: "hard", 
        C: 2, H: 4, O: 1, group_cho: 1, double_bond_total: 1, formula: "CH3CHO", image: "acetaldehyde.png",
        reaction_silver: 1, reaction_iodoform: 1
    },
    { 
        id: 9, name: "ジメチルエーテル", difficulty: "hard", 
        C: 2, H: 6, O: 1, group_ether: 1, formula: "CH3OCH3", image: "dimethyl_ether.png"
    },
    { 
        id: 10, name: "ジエチルエーテル", difficulty: "hard", 
        C: 4, H: 10, O: 1, group_ether: 1, formula: "(C2H5)2O", image: "diethyl_ether.png"
    },

    // --- カルボン酸・エステル ---
    { 
        id: 11, name: "ギ酸", difficulty: "hard", 
        C: 1, H: 2, O: 2, group_cooh: 1, group_cho: 1, double_bond_total: 1, formula: "HCOOH", image: "formic_acid.png",
        reaction_acid: 1, reaction_silver: 1
    },
    { 
        id: 12, name: "酢酸エチル", difficulty: "hard", 
        C: 4, H: 8, O: 2, group_ester: 1, double_bond_total: 1, formula: "CH3COOC2H5", image: "ethyl_acetate.png"
    },
    { 
        id: 13, name: "無水酢酸", difficulty: "hard", 
        C: 4, H: 6, O: 3, group_ester: 2, double_bond_total: 2, formula: "(CH3CO)2O", image: "acetic_anhydride.png"
    },
    { 
        id: 14, name: "シュウ酸", difficulty: "hard", 
        C: 2, H: 2, O: 4, group_cooh: 2, double_bond_total: 2, formula: "(COOH)2", image: "oxalic_acid.png",
        reaction_acid: 1, reaction_silver: 1
    },

    // --- 立体異性体 ---
    { 
        id: 15, name: "マレイン酸", difficulty: "hard", 
        C: 4, H: 4, O: 4, group_cooh: 2, double_bond: 1, double_bond_total: 3, formula: "C4H4O4 (cis)", image: "maleic_acid.png",
        reaction_acid: 1, reaction_dehydrate: 1
    },
    { 
        id: 16, name: "フマル酸", difficulty: "hard", 
        C: 4, H: 4, O: 4, group_cooh: 2, double_bond: 1, double_bond_total: 3, formula: "C4H4O4 (trans)", image: "fumaric_acid.png",
        reaction_acid: 1
    },
    { 
        id: 17, name: "乳酸", difficulty: "hard", 
        C: 3, H: 6, O: 3, group_oh: 1, group_cooh: 1, double_bond_total: 1, formula: "CH3CH(OH)COOH", image: "lactic_acid.png",
        reaction_acid: 1, is_chiral: 1
    },

    // --- 芳香族（基礎） ---
    { 
        id: 18, name: "ベンゼン", difficulty: "hard", 
        C: 6, H: 6, O: 0, ring_benzene: 1, double_bond_total: 3, formula: "C6H6", image: "benzene.png"
    },
    { 
        id: 19, name: "トルエン", difficulty: "hard", 
        C: 7, H: 8, O: 0, ring_benzene: 1, double_bond_total: 3, formula: "C6H5CH3", image: "toluene.png"
    },
    { 
        id: 20, name: "スチレン", difficulty: "hard", 
        C: 8, H: 8, O: 0, ring_benzene: 1, double_bond: 1, double_bond_total: 4, formula: "C6H5CH=CH2", image: "styrene.png",
        reaction_bromine: 1
    },
    { 
        id: 21, name: "p-キシレン", difficulty: "hard", 
        C: 8, H: 10, O: 0, ring_benzene: 1, double_bond_total: 3, formula: "C6H4(CH3)2", image: "p-xylene.png"
    },
    { 
        id: 22, name: "ベンズアルデヒド", difficulty: "hard", 
        C: 7, H: 6, O: 1, ring_benzene: 1, group_cho: 1, double_bond_total: 4, formula: "C6H5CHO", image: "benzaldehyde.png",
        reaction_silver: 1
    },
    { 
        id: 23, name: "ピクリン酸", difficulty: "hard", 
        C: 6, H: 3, N: 3, O: 7, ring_benzene: 1, group_oh: 1, double_bond_total: 9, formula: "C6H2(OH)(NO2)3", image: "picric_acid.png",
        reaction_acid: 1
    },

    // --- 芳香族（応用・医薬品） ---
    { 
        id: 24, name: "フェノール", difficulty: "hard", 
        C: 6, H: 6, O: 1, ring_benzene: 1, group_oh: 1, double_bond_total: 3, formula: "C6H5OH", image: "phenol.png",
        reaction_fe: 1, reaction_sodium: 1, reaction_acid: 1
    },
    { 
        id: 25, name: "安息香酸", difficulty: "hard", 
        C: 7, H: 6, O: 2, ring_benzene: 1, group_cooh: 1, double_bond_total: 4, formula: "C6H5COOH", image: "benzoic_acid.png",
        reaction_acid: 1
    },
    { 
        id: 26, name: "アニリン", difficulty: "hard", 
        C: 6, H: 7, N: 1, ring_benzene: 1, group_nh2: 1, double_bond_total: 3, formula: "C6H5NH2", image: "aniline.png"
    },
    { 
        id: 27, name: "アセチルサリチル酸", difficulty: "hard", 
        C: 9, H: 8, O: 4, ring_benzene: 1, group_cooh: 1, group_ester: 1, double_bond_total: 5, formula: "C6H4(OCOCH3)COOH", image: "aspirin.png",
        reaction_acid: 1
    },
    { 
        id: 28, name: "サリチル酸メチル", difficulty: "hard", 
        C: 8, H: 8, O: 3, ring_benzene: 1, group_oh: 1, group_ester: 1, double_bond_total: 4, formula: "C6H4(OH)COOCH3", image: "methyl_salicylate.png",
        reaction_fe: 1
    },
    { 
        id: 29, name: "テレフタル酸", difficulty: "hard", 
        C: 8, H: 6, O: 4, ring_benzene: 1, group_cooh: 2, double_bond_total: 5, formula: "C6H4(COOH)2", image: "terephthalic_acid.png",
        reaction_acid: 1
    },
    { 
        id: 30, name: "ニトロベンゼン", difficulty: "hard", 
        C: 6, H: 5, N: 1, O: 2, ring_benzene: 1, double_bond_total: 4, formula: "C6H5NO2", image: "nitrobenzene.png"
    },
    // ★追加したサリチル酸
    { 
        id: 31, name: "サリチル酸", difficulty: "hard", 
        C: 7, H: 6, O: 3, ring_benzene: 1, group_oh: 1, group_cooh: 1, double_bond_total: 4, formula: "C6H4(OH)COOH", image: "salicylic_acid.png",
        reaction_fe: 1, reaction_acid: 1, reaction_sodium: 1
    }
];

module.exports = compounds;