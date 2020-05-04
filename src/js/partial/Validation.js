import * as util from './Util';
// TODO: maxの実装
// TODO: minの実装
// TODO: 指定文字数の実装
// TODO: 半角の実装
// TODO: 全角の実装
// TODO: 日付の実装
// TODO: validationUnitの動的追加削除
// TODO: input以外の要素のバリデーション
// TODO: 初期値ありのパターンを実装
// TODO: テストの実装
// TODO: コメントの追加
// TODO: ステップ表示とのエラー表示連携

// TODO: API
// TODO: 制御クラス(入力制限)
// TODO: カレンダー
// TODO: removeできるイベントインターフェースを作る

//{
//  text1: [
//    {
//      node: validation-unit,
//      type: 'require',
//      result: false,
//    },
//    {
//      node: validation-unit,
//      type: 'ormore',
//      result: false,
//    },
//    {
//      node: validation-unit,
//      type: 'orless',
//      result: false,
//    },
//  ]
//}

/**
 * validationの親クラス
 */
export class Validation {
  constructor() {
    this.validationList = document.querySelector('.validation-list.-js');
    this.validationListError = document.querySelector('.validation-list.-js > .error.-js');
    this.checkGroup = {};

    // 各validationからcheckGroupを作成する
    this.validationList.addEventListener('addCheckGroup', (e) => {
      e.stopPropagation();

      const { node, type } = e.detail;
      if (this.checkGroup[node.name] === void 0) {
        this.checkGroup[node.name] = [];
      }
      const hasSameType = this.checkGroup[node.name].some((checkUnit) => {
        return checkUnit.type === type;
      });
      if (hasSameType) return;

      this.checkGroup[node.name].push(e.detail);
    });

    // 各validationの結果を受けてcheckGroupに保持する
    this.validationList.addEventListener('check', (e) => {
      e.stopPropagation();

      const { node, type } = e.detail;
      const name = node.name;
      const checkList = this.checkGroup[name];
      const index = checkList.findIndex((_checkUnit) => {
        return _checkUnit.type === type;
      });
      checkList[index] = e.detail;
      // 実行される回数が多いのでdebounceをかける
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.check(checkList);
      }, 10);
    });

    // 一括チェックを行う
    this.validationList.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.checkAll();
    });

    this.require = new Require(this.validationList);
    this.ormore = new OrMore(this.validationList);
    this.morethan = new MoreThan(this.validationList);
    this.orless = new OrLess(this.validationList);
    this.lessthan = new LessThan(this.validationList);
    console.log(this.checkGroup);

    // 初期値チェックを行う
    //Object.values(this.checkGroup).forEach((checkList) => {
    //  this.check(checkList);
    //});
  }

  /**
   * 同じnodeに設定されているvalidationを全てチェックする
   * @param {array} checkList
   */
  check(checkList) {
    const result = checkList.every((checkUnit) => {
      return checkUnit.result;
    });
    if (result) {
      this.hideCheckError(checkList);
    } else {
      this.showCheckError(checkList);
    }
  }

  /**
   * 全てのvalidationを通過するかチェックする
   */
  checkAll() {
    const checkGroupResult = Object.values(this.checkGroup).reduce((acc, checkList) => {
      const checkUnitResult = checkList.filter((checkUnit) => {
        return !checkUnit.result;
      });
      return [...acc, ...checkUnitResult];
    }, []);
    this.validationListError.innerHTML = '';
    this.validationListError.insertAdjacentHTML(
      'beforeend',
      checkGroupResult
        .map((checkUnit) => {
          return this.template(checkUnit);
        })
        .join('')
    );
  }

  /**
   * エラーを表示する
   * @param {array} checkList
   */
  showCheckError(checkList) {
    checkList[0].node.closest('.validation-unit.-js').classList.add('-active');
  }

  /**
   * エラーを非表示にする
   * @param {array} checkList
   */
  hideCheckError(checkList) {
    checkList[0].node.closest('.validation-unit.-js').classList.remove('-active');
  }

  /**
   * エラーのテンプレート
   * @param {array} checkList
   */
  template(checkUnit) {
    const { type, node } = checkUnit;
    const wrapper = node.closest('.validation-unit.-js');
    const label = wrapper.querySelector('.label.-js').textContent;
    const errorMessage = wrapper.querySelector(`.error-${type}.-js`).textContent;

    return `<div class="">${label}は${errorMessage}</div>`;
  }
}

class ValidationError {
  constructor() {
    //
  }

  // バリデーションのエラーを表示する
  show(node, type) {
    node.closest('.error.-js').querySelector(`.error-${type}.-js`).classList.add('-active');
  }

  // バリデーションのエラーを隠す
  hide(node, type) {
    node.closest('.error.-js').querySelector(`.error-${type}.-js`).classList.remove('-active');
  }

  template(type, errorMessage) {
    return `<div class="error-${type} -js">${errorMessage}</div>`;
  }
}

/**
 * 必須入力チェック
 */
class Require {
  constructor(validationList) {
    this.wrapper = validationList;
    this.type = this.constructor.name.toLowerCase();
    this.target = this.wrapper.querySelectorAll('.require.-js');
    this.errorMessage = '必須項目です。';
    this.validationError = new ValidationError();

    this.target.forEach((node) => {
      this.appendError(node);
      const event = new CustomEvent('addCheckGroup', {
        bubbles: true,
        detail: {
          node: node,
          type: this.type,
          result: this.validate(node),
        },
      });
      node.dispatchEvent(event);
    });

    this.wrapper.addEventListener('input', (e) => {
      e.stopPropagation();

      const regExp = new RegExp('require');
      if (!regExp.test(e.target.classList)) return;

      const result = this.validate(e.target);
      if (result) {
        this.validationError.hide(e.target, this.type);
      } else {
        this.validationError.show(e.target, this.type);
      }

      const event = new CustomEvent('check', {
        bubbles: true,
        detail: {
          node: e.target,
          type: this.type,
          result: result,
        },
      });
      e.target.dispatchEvent(event);
    });
  }

  appendError(node) {
    const errorNode = this.validationError.template(this.type, this.errorMessage);
    node.closest('.error.-js').insertAdjacentHTML('beforeend', errorNode);
  }

  validate(node) {
    let result = false;

    if (util.isInputText(node)) {
      result = node.value.length ? true : false;
    } else if (util.isInputFile(node)) {
      result = node.value.length ? true : false;
    } else if (util.isInputCheckbox(node)) {
      const checkbox = this.wrapper.querySelectorAll(`[name="${node.name}"]`);
      result = [...checkbox].some((node) => {
        return node.checked;
      });
    } else if (util.isInputRadio(node)) {
      const radio = this.wrapper.querySelectorAll(`[name="${node.name}"]`);
      result = [...radio].some((node) => {
        return node.checked;
      });
    } else if (util.isTextarea(node)) {
      result = node.value.length ? true : false;
    } else if (util.isSelect(node)) {
      result = node.selectedIndex ? true : false;
    } else {
      result = false;
    }

    return result;
  }
}

/**
 * 比較チェックのベースクラス
 */
class Compare {
  constructor(validationList) {
    this.wrapper = validationList;
    this.type = this.constructor.name.toLowerCase();
    this.target = this.wrapper.querySelectorAll(`[class*="${this.type}"].-js`);
    this.validationError = new ValidationError();
    this.regExp = '';
    this.errorMessage = '';
  }

  init() {
    this.target.forEach((node) => {
      this.appendError(node);
      const event = new CustomEvent('addCheckGroup', {
        bubbles: true,
        detail: {
          node: node,
          type: this.type,
          result: this.validate(node),
        },
      });
      node.dispatchEvent(event);
    });

    this.wrapper.addEventListener('input', (e) => {
      e.stopPropagation();
      if (!this.regExp.test(e.target.classList)) return;

      const result = this.validate(e.target);
      if (result) {
        this.validationError.hide(e.target, this.type);
      } else {
        this.validationError.show(e.target, this.type);
      }

      const event = new CustomEvent('check', {
        bubbles: true,
        detail: {
          node: e.target,
          type: this.type,
          result: result,
        },
      });
      e.target.dispatchEvent(event);
    });
  }

  appendError(node) {
    const length = this.getLength(node);
    const errorNode = this.validationError.template(this.type, `${length}${this.errorMessage}`);
    node.closest('.error.-js').insertAdjacentHTML('beforeend', errorNode);
  }

  validate(node) {
    const length = this.getLength(node);
    if (!('value' in node) || node.value.length === 0) return true;
    // evalの代替方法としてFunctionを使う
    return window.Function(`return ${node.value.length} ${this.operator} ${length}`)();
  }

  /**
   * 制限文字数を取得する
   * @param {object} node 制限文字数を設定しているnode
   */
  getLength(node) {
    return Number(this.regExp.exec(node.classList)[1]);
  }
}

/**
 * 〜より上のバリデーション
 * @param {object} validationList イベントバインド用のnode
 */
class OrMore extends Compare {
  constructor(validationList) {
    super(validationList);
    this.regExp = new RegExp('ormore([0-9]*)');
    this.operator = '>';
    this.errorMessage = '文字より多く入力してください。';
    this.init();
  }
}

/**
 * 〜以上のバリデーション
 * @param {object} validationList イベントバインド用のnode
 */
class MoreThan extends Compare {
  constructor(validationList) {
    super(validationList);
    this.regExp = new RegExp('morethan([0-9]*)');
    this.operator = '>=';
    this.errorMessage = '文字以上で入力してください。';
    this.init();
  }
}

/**
 * 〜より下のバリデーション
 * @param {object} validationList イベントバインド用のnode
 */
class OrLess extends Compare {
  constructor(validationList) {
    super(validationList);
    this.regExp = new RegExp('orless([0-9]*)');
    this.operator = '<';
    this.errorMessage = '文字より少なく入力してください。';
    this.init();
  }
}

/**
 * 〜以下のバリデーション
 * @param {object} validationList イベントバインド用のnode
 */
class LessThan extends Compare {
  constructor(validationList) {
    super(validationList);
    this.regExp = new RegExp('lessthan([0-9]*)');
    this.operator = '<=';
    this.errorMessage = '文字以下で入力してください。';
    this.init();
  }
}
// Minimu
// Max
