/**
 * --------------------------------------------------------------------------
 * Calculator calculator.js
 * Licensed under MIT (https://github.com/yannickbrocart/calculator/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const KEYBOARD_KEYS_CONFIG =
    [
        { id: 'clear', display: 'AC' },
        { id: 'reverse', key_icon: 'plus-minus', key_disabled: true },
        { id: 'backspace', key_icon: 'delete-left', key_disabled: true },
        { id: 'divide', key_icon: 'divide', display: '&#247', key_disabled: true },
        { id: '7', key_icon: '7' },
        { id: '8', key_icon: '8' },
        { id: '9', key_icon: '9' },
        { id: 'multiply', key_icon: 'xmark', display: 'x', key_disabled: true },
        { id: '4', key_icon: '4' },
        { id: '5', key_icon: '5' },
        { id: '6', key_icon: '6' },
        { id: 'minus', key_icon: 'minus', display: '-' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: 'add', key_icon: 'plus', display: '+' },
        { id: '000' },
        { id: '0' },
        { id: 'decimal', display: '&#8226;' },
        { id: 'equals', key_icon: 'equals', display: '=' }
    ];

const ALERT_MESSAGES = {
    start: 'Please enter...',
    error: 'Error',
    zerosAtStart: 'Can\'t start with multiple zero',
    oneDecimal: 'One decimal point by number',
    oneOperator: 'One operator only',
    endDecimal: 'Need digit after decimal point'
};
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '000'];
const OPERATORS = ['add', 'minus', 'multiply', 'divide'];
const MANIPULATORS = ['clear', 'reverse', 'parentheses', 'backspace', 'square-root', 'exposant', 'percent', 'decimal', 'equals'];

/**
 * Class definition
 */

class Calculator {
    // Fields
    calculatorComponent;
    calculatorDisplay;
    keyboardComponent;
    calculusComponent;
    resultComponent;
    alertComponent;
    previousKeyType;
    alert;
    calculus = '';
    numberCache = '';
    result = '0';

    // Constructor
    constructor(calculatorDivId) {
        this.calculatorComponent = document.getElementById(calculatorDivId);
        this._initCalculatorComponents(KEYBOARD_KEYS_CONFIG);
    }

    // Private
    _initCalculatorComponents(keyboardKeysConfig) {
        // calculator display component creation
        this.calculatorDisplay = document.createElement('div');
        this.calculatorDisplay.id = 'calculator-display';
        this.calculatorDisplay.classList.add('display');
        this.alertComponent = document.createElement('div');
        this.alertComponent.id = 'display-alert';
        this.alertComponent.classList.add('alert');
        this.calculusComponent = document.createElement('div');
        this.calculusComponent.id = 'display-calculus';
        this.calculusComponent.classList.add('calculus');
        this.resultComponent = document.createElement('div');
        this.resultComponent.id = 'display-result';
        this.resultComponent.classList.add('result');
        this.calculatorDisplay.appendChild(this.alertComponent);
        this.alert = ALERT_MESSAGES.start;
        this.calculatorDisplay.appendChild(this.calculusComponent);
        this.calculatorDisplay.appendChild(this.resultComponent);

        // calculator keyboard component creation
        this.keyboardComponent = document.createElement('div');
        this.keyboardComponent.id = 'calculator-keyboard';
        this.keyboardComponent.classList.add('keyboard');

        // calculator component creation
        this.calculatorComponent.appendChild(this.calculatorDisplay);
        this.calculatorComponent.appendChild(this.keyboardComponent);

        // calculator display component initialisation
        this.alertComponent.innerHTML = this.alert;
        this.calculusComponent.innerHTML = this.calculus;
        this.resultComponent.innerHTML = this.result;

        // calculator keyboard component keys creation 
        keyboardKeysConfig.forEach(keyConfig => {
            const key = this._initKey(keyConfig);
            this.keyboardComponent.appendChild(key);
        });
    }

    _initKey(keyConfig) {
        const key = document.createElement('div');

        key.setAttribute('id', keyConfig.id);
        if (keyConfig.display != undefined) key.setAttribute('data-display', keyConfig.display);
        if (NUMBERS.includes(key.id)) {
            key.classList.add('key', 'key-number');
            if (key.id === '000') key.classList.add('triplezero');
        } else if (OPERATORS.includes(key.id)) {
            key.classList.add('key', 'key-operator');
            key.setAttribute('data-display', keyConfig.display);
            key.innerHTML = '<i class="fa-solid fa-' + keyConfig.key_icon + '"></i>';
        } else if (MANIPULATORS.includes(key.id))
            key.classList.add('key', 'key-manipulator');
        if (keyConfig.key_disabled == true) key.classList.add('key-disabled');
        if (keyConfig.key_icon != undefined)
            key.innerHTML = '<i class="fa-solid fa-' + keyConfig.key_icon + '"></i>';
        else {
            if (keyConfig.display != undefined) {
                key.innerHTML = keyConfig.display;
            } else key.innerHTML = key.id;
        }
        if (keyConfig.key_disabled != true) 
            key.addEventListener('click', (event) => { this._handleKeyEvent(key); });
        return key;
    }

    _handleKeyEvent(key) {
        this._clearAlert();

        // test key content
        if (MANIPULATORS.includes(key.id)) this._handleManipulator(key.id);
        else if (NUMBERS.includes(key.id)) this._handleNumber(key.id);
        else if (OPERATORS.includes(key.id)) this._handleOperator(key.dataset.display);

        // update display components
        this._displayAlert();
        this._displayCalculus();
        this._displayResult();
    }

    _handleNumber(keyContent) {
        if (keyContent === '000' &&
           (this.calculus.length == 0 || this.previousKeyType == 'operator')) {
            this.alert = ALERT_MESSAGES.zerosAtStart;
            return;
        }
        if (this.numberCache === '0') {
            this.numberCache = keyContent;
            this.calculus = this.calculus.slice(0, -1);
            this.calculus += keyContent;
        } else {
            this.numberCache += keyContent;
            this.calculus += keyContent;
        }
        this.previousKeyType = 'number';
    }

    _handleOperator(keyContent) {
        if (this.previousKeyType !== 'number' && this.previousKeyType !== 'equals') {
            this.alert = ALERT_MESSAGES.oneOperator;
            return;
        } else if (this.calculus.slice(-1) === '.') {
            this.alert = ALERT_MESSAGES.endDecimal;
            return;
        } else {
            if (this.previousKeyType !== 'equals') parseTree.addItem(this.numberCache, 'number');
            this.calculus += keyContent;
            this.numberCache = '';
            parseTree.addItem(keyContent, 'operator');
            this.previousKeyType = 'operator';
        }
    }

    _handleManipulator(keyContent) {
        if (keyContent === 'decimal') this._handleDecimal();
        else if (keyContent === 'clear') this._clearCalculus();
        else if (keyContent === 'equals') this._handleEquals();
    }

    _handleDecimal() {
        if (this.numberCache.includes('.')) {
            this.alert = ALERT_MESSAGES.oneDecimal;
            return;
        }
        if (this.calculus.length == 0 ||
            this.previousKeyType === 'operator') {
            this.numberCache = this.calculus += '0.';
            return;
        }
        this.numberCache += '.';
        this.calculus += '.';
        this.previousKeyType = 'number';
    }

    _handleEquals() {
        if (this.previousKeyType != 'equals') {
            parseTree.addItem(this.numberCache, 'number');
            this.numberCache = '';
            this.previousKeyType = 'equals';
            this.result = parseTree.calculate()
        }
    }

    _clearAlert() {
        this.alert = '';
    }

    _clearCalculus() {
        this.alert = ALERT_MESSAGES.start;
        this.calculus = '';
        this.result = '0';
        this._clearNumberCache();
        parseTree.reset();
    }

    _clearNumberCache() {
        this.numberCache = '';
    }

    _displayAlert() {
        this.alertComponent.innerHTML = this.alert;
    }

    _displayCalculus() {
        // frame lenght
        let calculusFrame;
        this.calculusComponent.innerHTML = '';
        if (this.calculus.length > 16)
            calculusFrame = this.calculus.slice(this.calculus.length - 16);
        else calculusFrame = this.calculus;
        // result style
        for (let index = 0; index < calculusFrame.length; index++) {
            if (!NUMBERS.includes(calculusFrame.charAt(index))) {
                this.calculusComponent.innerHTML +=
                    '<span class="strong">' + calculusFrame.charAt(index) + '</span>';
            } else this.calculusComponent.innerHTML += calculusFrame.charAt(index);
        }
    }

    _displayResult() {
        this.resultComponent.innerHTML = '';
        if (this.result.toString().length > 7) this.resultComponent.innerHTML = this._convertResultInscientificNotation(this.result);
        else this.resultComponent.innerHTML = this.result;
    }

    _convertResultInscientificNotation(result) {
        let decimal = 4;
        let scientificResult = result.toExponential(decimal);
        let posExponent = scientificResult.indexOf('e');
        let baseResult = scientificResult.slice(0, posExponent);
        let exponentResult = scientificResult.slice(posExponent);
        return '<span class="scientifique-notation">' 
               + baseResult
               + '<span class="exponent">' 
               + exponentResult
               + '</span>'
               + '</span>';
    }
}