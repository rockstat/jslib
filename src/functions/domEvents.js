import {doc, win} from '../Browser';
import createLogger from './createLogger';

const log = createLogger('DomEvents');
const checkPassiveSupport = () => {
  let result = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function () {
        result = true;
      }
    });

    window.addEventListener('test', null, options);
  } catch (err) {
  }
  return result;
};


const useAddEL = !!win.addEventListener;
const passiveSupport = checkPassiveSupport();

/**
 * @return {boolean}
 */
const stateIsComplete = () => {
  return doc.readyState === 'loaded';
};

/**
 * @return {boolean}
 */
const stateIsInteractive = () => {
  return doc.readyState === 'interactive';
};

/**
 * @type {Boolean}
 */
export const useCaptureSupport = useAddEL;

/**
 * @param elem {Element}
 * @param type {string}
 * @param handler {function}
 * @param useCapture {boolean}
 * @return {*}
 */
export function addHandler(elem, type, handler, useCapture = false) {
  if (useAddEL) {
    elem.addEventListener(type, handler, useCapture);
  } else {
    log('.addEventListener not supported');
  }
}

/**
 * @param elem Element
 * @param type string
 * @param handler
 * @param useCapture
 * @return {*}
 */
export function removeHandler(elem, type, handler, useCapture = false) {
  if (useAddEL) {
    elem.removeEventListener(type, handler, useCapture);
  }
}

/**
 *
 * @param cb function Callback function
 */
export function documentReady(cb) {

  if (stateIsInteractive() || stateIsComplete()) {
    cb();
  }

  function loadedHandler() {
    removeHandler(doc, 'DOMContentLoaded', loadedHandler);
    cb();
  }

  addHandler(doc, 'DOMContentLoaded', loadedHandler);
}
