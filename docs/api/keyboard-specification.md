# キーボード操作仕様書

## 1. 概要
電卓アプリケーションのキーボード操作機能の詳細仕様を定義する。

## 2. 対応キー一覧

### 2.1 数字キー
#### 2.1.1 基本数字
| キー | 機能 | 内部処理 |
|------|------|----------|
| 0 | 数字0入力 | inputNumber('0') |
| 1 | 数字1入力 | inputNumber('1') |
| 2 | 数字2入力 | inputNumber('2') |
| 3 | 数字3入力 | inputNumber('3') |
| 4 | 数字4入力 | inputNumber('4') |
| 5 | 数字5入力 | inputNumber('5') |
| 6 | 数字6入力 | inputNumber('6') |
| 7 | 数字7入力 | inputNumber('7') |
| 8 | 数字8入力 | inputNumber('8') |
| 9 | 数字9入力 | inputNumber('9') |

#### 2.1.2 小数点
| キー | 機能 | 内部処理 | 制約 |
|------|------|----------|------|
| . | 小数点入力 | inputNumber('.') | 1つの数値に1回まで |

### 2.2 演算子キー
#### 2.2.1 基本演算子
| キー | 機能 | 内部処理 | 表示 |
|------|------|----------|------|
| + | 加算 | inputOperator('+') | + |
| - | 減算 | inputOperator('-') | - |
| * | 乗算 | inputOperator('×') | × |
| / | 除算 | inputOperator('÷') | ÷ |

#### 2.2.2 実行キー
| キー | 機能 | 内部処理 | 備考 |
|------|------|----------|------|
| Enter | 計算実行 | calculate() | イコール機能 |
| = | 計算実行 | calculate() | 物理キーボードでの入力 |

### 2.3 制御キー
#### 2.3.1 クリア・削除
| キー | 機能 | 内部処理 | 備考 |
|------|------|----------|------|
| Escape | 全クリア | clearAll() | C機能 |
| Backspace | 一文字削除 | deleteLast() | ←機能 |
| Delete | 一文字削除 | deleteLast() | Backspaceと同等 |

## 3. キーボードイベント処理

### 3.1 イベントリスナー設定
#### 3.1.1 基本実装
```javascript
setupKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
        this.handleKeyPress(event);
    });
}
```

### 3.2 キー判定処理
#### 3.2.1 メインハンドラー
```javascript
handleKeyPress(event) {
    const key = event.key;
    
    // 数字キーの処理
    if (key >= '0' && key <= '9') {
        this.inputNumber(key);
        return;
    }
    
    // 小数点の処理
    if (key === '.') {
        if (this.currentInput.indexOf('.') === -1) {
            this.inputNumber('.');
        }
        return;
    }
    
    // 演算子キーの処理
    switch (key) {
        case '+':
            this.inputOperator('+');
            break;
        case '-':
            this.inputOperator('-');
            break;
        case '*':
            this.inputOperator('×');
            break;
        case '/':
            event.preventDefault(); // ブラウザの検索を防ぐ
            this.inputOperator('÷');
            break;
        case 'Enter':
        case '=':
            event.preventDefault();
            this.calculate();
            break;
        case 'Escape':
            this.clearAll();
            break;
        case 'Backspace':
        case 'Delete':
            event.preventDefault();
            this.deleteLast();
            break;
    }
}
```

## 4. 特殊キー処理

### 4.1 デフォルト動作の制御
#### 4.1.1 preventDefault()が必要なキー
- **/** : ブラウザの検索機能を防ぐ
- **Enter**: フォーム送信を防ぐ
- **Backspace**: ブラウザの戻る動作を防ぐ
- **Delete**: 特定のブラウザでの特殊動作を防ぐ

### 4.2 修飾キーの処理
#### 4.2.1 修飾キー組み合わせ
```javascript
handleKeyPress(event) {
    // 修飾キーが押されている場合は無視
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }
    
    // 通常のキー処理
    this.processNormalKey(event);
}
```

## 5. テンキー対応

### 5.1 テンキー入力
#### 5.1.1 テンキー数字
| キー | KeyCode | 機能 |
|------|---------|------|
| Numpad0 | 96 | 数字0入力 |
| Numpad1 | 97 | 数字1入力 |
| Numpad2 | 98 | 数字2入力 |
| Numpad3 | 99 | 数字3入力 |
| Numpad4 | 100 | 数字4入力 |
| Numpad5 | 101 | 数字5入力 |
| Numpad6 | 102 | 数字6入力 |
| Numpad7 | 103 | 数字7入力 |
| Numpad8 | 104 | 数字8入力 |
| Numpad9 | 105 | 数字9入力 |

#### 5.1.2 テンキー演算子
| キー | KeyCode | 機能 |
|------|---------|------|
| NumpadAdd | 107 | 加算 |
| NumpadSubtract | 109 | 減算 |
| NumpadMultiply | 106 | 乗算 |
| NumpadDivide | 111 | 除算 |
| NumpadEnter | 13 | 計算実行 |
| NumpadDecimal | 110 | 小数点 |

### 5.2 テンキー実装
#### 5.2.1 拡張キー処理
```javascript
handleKeyPress(event) {
    const key = event.key;
    const code = event.code;
    
    // テンキー数字の処理
    if (code >= 'Numpad0' && code <= 'Numpad9') {
        const digit = code.slice(-1);
        this.inputNumber(digit);
        return;
    }
    
    // テンキー演算子の処理
    switch (code) {
        case 'NumpadAdd':
            this.inputOperator('+');
            break;
        case 'NumpadSubtract':
            this.inputOperator('-');
            break;
        case 'NumpadMultiply':
            this.inputOperator('×');
            break;
        case 'NumpadDivide':
            event.preventDefault();
            this.inputOperator('÷');
            break;
        case 'NumpadEnter':
            event.preventDefault();
            this.calculate();
            break;
        case 'NumpadDecimal':
            if (this.currentInput.indexOf('.') === -1) {
                this.inputNumber('.');
            }
            break;
    }
}
```

## 6. 国際化対応

### 6.1 キーボードレイアウト
#### 6.1.1 レイアウト別対応
- **QWERTY**: 標準対応
- **AZERTY**: 数字キー配置の違いに対応
- **QWERTZ**: 記号キー配置の違いに対応

### 6.2 入力方式
#### 6.2.1 IME対応
```javascript
handleKeyPress(event) {
    // IME入力中は処理をスキップ
    if (event.isComposing) {
        return;
    }
    
    this.processKey(event);
}
```

## 7. アクセシビリティ

### 7.1 スクリーンリーダー対応
#### 7.1.1 キー入力の音声フィードバック
```javascript
announceKeyPress(key) {
    const announcement = this.getKeyAnnouncement(key);
    this.screenReader.announce(announcement);
}

getKeyAnnouncement(key) {
    const announcements = {
        '+': 'プラス',
        '-': 'マイナス',
        '×': 'かける',
        '÷': 'わる',
        'Enter': 'イコール',
        'Escape': 'クリア',
        'Backspace': '削除'
    };
    return announcements[key] || key;
}
```

### 7.2 キーボードナビゲーション
#### 7.2.1 フォーカス管理
- **Tab**: 次のボタンへフォーカス移動
- **Shift+Tab**: 前のボタンへフォーカス移動
- **Spacebar**: フォーカスされたボタンの実行

## 8. エラーハンドリング

### 8.1 無効なキー入力
#### 8.1.1 無効キーの処理
```javascript
handleInvalidKey(event) {
    // 無効なキーは無視
    console.log(`Invalid key pressed: ${event.key}`);
    // 必要に応じて音声フィードバック
    this.playErrorSound();
}
```

### 8.2 キーの重複処理
#### 8.2.1 連続入力の制御
```javascript
handleKeyPress(event) {
    // 短時間での重複入力を防ぐ
    if (this.isKeyRepeating(event.key)) {
        return;
    }
    
    this.lastKeyTime = Date.now();
    this.processKey(event);
}

isKeyRepeating(key) {
    const now = Date.now();
    const timeSinceLastKey = now - this.lastKeyTime;
    return timeSinceLastKey < 150; // 150ms以内の重複を無視
}
```

## 9. デバッグ支援

### 9.1 キー入力ログ
#### 9.1.1 デバッグログ
```javascript
logKeyPress(event) {
    if (this.debugMode) {
        console.log('Key pressed:', {
            key: event.key,
            code: event.code,
            keyCode: event.keyCode,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey
        });
    }
}
```

### 9.2 キーバインドの確認
#### 9.2.1 対応キー一覧表示
```javascript
showKeyBindings() {
    const bindings = {
        '数字 0-9': '数値入力',
        '.': '小数点',
        '+': '加算',
        '-': '減算',
        '*': '乗算',
        '/': '除算',
        'Enter': '計算実行',
        'Escape': '全クリア',
        'Backspace': '一文字削除'
    };
    
    console.table(bindings);
}
```

## 10. パフォーマンス最適化

### 10.1 イベント処理の最適化
#### 10.1.1 効率的なイベント処理
```javascript
setupKeyboardEvents() {
    // パッシブリスナーの使用
    document.addEventListener('keydown', this.handleKeyPress.bind(this), {
        passive: false
    });
}
```

### 10.2 メモリ管理
#### 10.2.1 イベントリスナーの適切な削除
```javascript
destroy() {
    document.removeEventListener('keydown', this.handleKeyPress);
}
```

## 11. テスト仕様

### 11.1 単体テスト
#### 11.1.1 テストケース
- 各数字キーの入力テスト
- 演算子キーの入力テスト
- 制御キーの動作テスト
- 無効なキーの処理テスト

### 11.2 統合テスト
#### 11.2.1 シナリオテスト
- 複数キーの組み合わせ
- 連続入力の動作
- エラー状態での入力

### 11.3 アクセシビリティテスト
#### 11.3.1 キーボードナビゲーション
- Tab順序の確認
- フォーカス表示の確認
- スクリーンリーダー対応の確認

## 12. ブラウザ対応

### 12.1 ブラウザ別差異
#### 12.1.1 主要ブラウザ対応
- **Chrome**: 完全対応
- **Firefox**: 完全対応
- **Safari**: 完全対応
- **Edge**: 完全対応

### 12.2 互換性対応
#### 12.2.1 レガシーブラウザ
```javascript
// event.key非対応ブラウザ用フォールバック
getKeyFromEvent(event) {
    if (event.key) {
        return event.key;
    }
    
    // keyCodeからkeyへの変換
    return this.keyCodeToKey(event.keyCode);
}
```

## 13. 設定とカスタマイズ

### 13.1 キーバインドの設定
#### 13.1.1 カスタムキーバインド
```javascript
const defaultKeyBindings = {
    'Clear': ['Escape', 'KeyC'],
    'Delete': ['Backspace', 'Delete'],
    'Calculate': ['Enter', 'Equal']
};

setKeyBinding(action, keys) {
    this.keyBindings[action] = keys;
}
```

### 13.2 無効化オプション
#### 13.2.1 キーボード入力の無効化
```javascript
setKeyboardEnabled(enabled) {
    this.keyboardEnabled = enabled;
    if (!enabled) {
        this.removeKeyboardListeners();
    } else {
        this.setupKeyboardEvents();
    }
}
```