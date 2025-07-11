class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.display = document.getElementById('result');
        this.setupKeyboardEvents();
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
    }

    inputNumber(number) {
        if (this.waitingForOperand) {
            this.currentInput = number;
            this.waitingForOperand = false;
        } else {
            if (this.currentInput === '0') {
                this.currentInput = number;
            } else {
                if (this.currentInput.length < 15) {
                    this.currentInput += number;
                }
            }
        }
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const previousValue = parseFloat(this.previousInput);
            const currentValue = parseFloat(this.currentInput);
            const result = this.performCalculation(previousValue, currentValue, this.operator);

            if (result === null) {
                this.showError();
                return;
            }

            this.currentInput = String(result);
            this.previousInput = result;
            this.updateDisplay();
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                if (secondOperand === 0) {
                    return null;
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    calculate() {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== '' && this.operator) {
            const previousValue = parseFloat(this.previousInput);
            const result = this.performCalculation(previousValue, inputValue, this.operator);

            if (result === null) {
                this.showError();
                return;
            }

            this.currentInput = String(result);
            this.previousInput = '';
            this.operator = '';
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    }

    clearAll() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    deleteLast() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    showError() {
        this.currentInput = 'Error';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                this.inputNumber(key);
            } else if (key === '.') {
                if (this.currentInput.indexOf('.') === -1) {
                    this.inputNumber('.');
                }
            } else if (key === '+') {
                this.inputOperator('+');
            } else if (key === '-') {
                this.inputOperator('-');
            } else if (key === '*') {
                this.inputOperator('×');
            } else if (key === '/') {
                event.preventDefault();
                this.inputOperator('÷');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                this.calculate();
            } else if (key === 'Escape') {
                this.clearAll();
            } else if (key === 'Backspace') {
                event.preventDefault();
                this.deleteLast();
            }
        });
    }
}

const calculator = new Calculator();

function inputNumber(number) {
    if (number === '.' && calculator.currentInput.indexOf('.') !== -1) {
        return;
    }
    calculator.inputNumber(number);
}

function inputOperator(operator) {
    calculator.inputOperator(operator);
}

function calculate() {
    calculator.calculate();
}

function clearAll() {
    calculator.clearAll();
}

function deleteLast() {
    calculator.deleteLast();
}