/**
 * stringのtrue / false をbooleanに変換する
 * @param {any} value 変換する値
 */
export function toBoolean(value) {
  return value.toLowerCase() === 'true';
}

/**
 * <input>を判定する
 * @param {object} node 判定するnode
 */
export function isInput(node) {
  return node.nodeName.toLowerCase() === 'input' ? true : false;
}

/**
 * type="text"かを判定する
 * @param {object} node 判定するnode
 */
export function isInputText(node) {
  const input = isInput(node);
  if (!input) return false;
  return node.type.toLowerCase() === 'text' ? true : false;
}

/**
 * type="file"かを判定する
 * @param {object} node 判定するnode
 */
export function isInputFile(node) {
  const input = isInput(node);
  if (!input) return false;
  return node.type.toLowerCase() === 'file' ? true : false;
}

/**
 * type="checkbox"かを判定する
 * @param {object} node 判定するnode
 */
export function isInputCheckbox(node) {
  const input = isInput(node);
  if (!input) return false;
  return node.type.toLowerCase() === 'checkbox' ? true : false;
}

/**
 * type="radio"かを判定する
 * @param {object} node 判定するnode
 */
export function isInputRadio(node) {
  const input = isInput(node);
  if (!input) return false;
  return node.type.toLowerCase() === 'radio' ? true : false;
}

/**
 * <textarea>を判定する
 * @param {object} node 判定するnode
 */
export function isTextarea(node) {
  return node.nodeName.toLowerCase() === 'textarea' ? true : false;
}

/**
 * <select>を判定する
 * @param {object} node 判定するnode
 */
export function isSelect(node) {
  return node.nodeName.toLowerCase() === 'select' ? true : false;
}
