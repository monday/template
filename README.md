# npmベーステンプレート
## タスク
### config
* 各タスクのパスや名前をまとめる

### browserify
* browserify起動タスク
* src/js/以下のjsファイルを監視し、変更があった場合はコンパイル
* watchfyで差分管理、babelifyでES2016対応を行う

### build
* ベースタスク
* cleanを実行後、ejs / sass / copyタスクを実行し、監視する

### copy
* ファイルコピーを行うタスク
* destメソッドにファイルパスを渡せば個別でコピーできる

### delete
* ファイル / ディレクトリ削除を行うタスク
* コマンドからも実行可能 `npm run del`

### ejs
* ejs起動タスク
* src/ejs/以下のejsファイルを監視し、変更があった場合はコンパイル
* 頭に_アンダースコアがついたファイルはコピーの対象外

### image
* 画像圧縮タスク
* pngとjpgを圧縮する
* コマンドから起動する `npm run image`

### sass
* sass起動タスク
* src/css/以下のsassファイルを監視し、変更があった場合はコンパイル
* 頭に_アンダースコアがついたファイルはコピーの対象外
