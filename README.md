# gulpベーステンプレート
## タスク
### config
* 各タスクの設定をまとめる

### browsersync
* brwsersync起動タスク
* config.ejs.src以下のディレクトリに変更があった場合はejsをコンパイル
* config.sass.src以下のディレクトリに変更があった場合はsassをコンパイル
* config.copy.src以下のディレクトリに変更があった場合はdest/imagesへコピー
* src/js以下のディレクトリに変更があった場合はdest/jsへコピー

### build
* cleanタスクを実行後、並列でejs / sass / copyタスクを実行する

### clean
* destディレクトリを削除する

### copy
* config.copy.srcをdestへコピーする

### default
* build / browsersyncを並行で実行する

### ejs
* ejsをhtmlへコンパイルする
* plumberでエラーは無視する

### sass
* scssをcssへコンパイルする
* plumberでエラーは無視する

### sprite
* スプライト画像を生成する
* どのタスクにも属さないため単独で実行させる

## node
* 未確認
* 5以降であれば動作するはず


