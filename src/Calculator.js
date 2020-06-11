import React from 'react';
import './Calculator.css';
import Button from './Button';
import Display from './Display';

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '0',
      formula: '',
      evaluated: false
    }
    this.handleButtonPressed = this.handleButtonPressed.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.lastOperand = this.lastOperand.bind(this);
    this.isOperator = /[*/+-]/;
    this.endsWithOperator = /[*/+-]$/;
    this.endsWithOperatorAndMinus = /[*/+-][-]$/;
  }

  handleButtonPressed(key) {
    this.setState(function (prevState) {
      let current;
      let formula;
      const isOperator = this.isOperator.test(key);
      const endsWithOperator = this.endsWithOperator.test(prevState.formula);
      if (key === 'AC') {
        current = '0';
        formula = '';
      } else if (key === '=') {
        return this.evaluate(prevState, key);
      } else if (isOperator) {
        if (!prevState.formula.endsWith('.')) {
          const endsWithOperatorAndMinus = this.endsWithOperatorAndMinus.test(prevState.formula);
          if (endsWithOperatorAndMinus) {
            if (key === '-') {
              // ignore
              current = prevState.current;
              formula = prevState.formula;
            } else {
              // replace both last with new operator
              current = key;
              const formulaCopyWithoutBothLastOperators = prevState.formula.slice(0, -2);
              formula = formulaCopyWithoutBothLastOperators + key;
            }
          }
          else if (endsWithOperator && !endsWithOperatorAndMinus) {
            if (key === '-') {
              // formula already ends with an operator, we append the minus to it
              current = key;
              formula = prevState.formula + key;
            } else {
              // formula already ends with an operator, hence we shall replace it, but only if it's not a minus
              current = key;
              const formulaCopyWithoutOperator = prevState.formula.slice(0, -1);
              formula = formulaCopyWithoutOperator + key;
            }
          } else if (prevState.evaluated) {
            // start new operation that operates on the result of the previous calculation
            current = key;
            const previousResult = prevState.current;
            formula = previousResult + key;
          } else {
            // first operator to add
            current = key;
            formula = prevState.formula + key;
          }
        } else {
          // ignore case
          current = prevState.current;
          formula = prevState.formula;
        }
      } else if (key === '.') {
        // todo: check for max-length of 15
        if (!prevState.evaluated) {
          // handle multiple decimals, example: 0.0000.
          const lastOperand = this.lastOperand(prevState);
          if (!lastOperand.includes('.') && !endsWithOperator) {
            current = prevState.current !== undefined ? prevState.current + key : key;
            formula = prevState.formula + key;
          } else {
            current = prevState.current;
            formula = prevState.formula;
          }
        } else {
          current = '.';
          formula = '.';
        }
        // number-key pressed
      } else {
        // number pressed
        if (prevState.evaluated) {
          // re-init with new calculation
          current = key;
          formula = key;
        } else {
          // most basic case
          // check max size and ignore if too long
          if (prevState.current.length > 15) {
            current = 'LIMIT REACHED';
            formula = prevState.formula;
            // setup callback with actual update
            const _current = prevState.current,
              _formula = prevState.formula,
              _self = this;
            setTimeout(function () {
              _self.setState({
                current: _current,
                formula: _formula
              });
            }, 1000);
          } else {
            const lastOperand = this.lastOperand(prevState);
            // don't allow: 00
            if (key === '0' && lastOperand === '0') {
              current = key;
              formula = prevState.formula;
            } else {
              current = prevState.current === '0' ? key : prevState.current + key;
              formula = prevState.formula + key;
            }
          }
        }
      }

      return {
        current: current,
        formula: formula,
        evaluated: false
      }
    });
  }

  lastOperand(prevState) {
    const splitArr = prevState.formula.split(new RegExp(this.isOperator, 'g'));
    const notEmptySplitarr = splitArr.filter(entry => entry !== '');
    const lastElem = notEmptySplitarr.pop();
    return lastElem || [];
  }

  evaluate(prevState, current) {
    if (!prevState.formula.includes("=") && !prevState.evaluate) {
      let f = this.state.formula;
      // remove operators at end of formula
      while (this.endsWithOperator.test(f)) {
        f = f.slice(0, -1);
      }
      // test f to match only operators and digits to avoid potentially dangerous injections
      if (/[a-zA-Z]/.test(f)) {
        f = f.replace(/[a-zA-Z]/g, '');
      }
      // Number.MAX_SAFE_INTEGER = 9007199254740991 which is 16 digits
      const MAX_DIGITS = 1000000000000000;
      let answer;
      try {
        // eslint-disable-next-line no-eval
        answer = Math.round(MAX_DIGITS * eval(f)) / MAX_DIGITS;
      } catch (error) {
        answer = 'NAN';
      }
      let formula = f + '=' + answer;
      if (formula.length > 34) {
        formula = 'OUT OF LIMIT';
        answer = formula;
      }
      return {
        current: answer.toString(),
        formula: formula,
        evaluated: true
      }
    }
    return prevState;
  }

  render() {
    return (
      <div className='calculator-grid-container'>
        <Display current={this.state.current} formula={this.state.formula}></Display>

        <Button name='AC' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='/' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='*' handleButtonPressed={this.handleButtonPressed}></Button>

        <Button name='1' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='2' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='3' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='-' handleButtonPressed={this.handleButtonPressed}></Button>

        <Button name='4' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='5' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='6' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='+' handleButtonPressed={this.handleButtonPressed}></Button>

        <Button name='7' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='8' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='9' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='=' handleButtonPressed={this.handleButtonPressed}></Button>

        <Button name='0' handleButtonPressed={this.handleButtonPressed}></Button>
        <Button name='.' handleButtonPressed={this.handleButtonPressed}></Button>
      </div>
    );
  }
};