import React from 'react';
import './Button.css';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: this.setKeys(props.name.toUpperCase())
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setKeys(keyCode) {
    switch (keyCode) {
      case 'AC':
        return ['Backspace'];
      case '=':
        return ['=', 'Enter'];
      case '.':
        return ['.', ','];
      default:
        return [keyCode];
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress(event) {
    this.state.keys.forEach(key => {
      if (event.key === key) {
        this.handleClick();
      }
    });
  }

  handleClick = (e) => {
    this.letGlow();
    this.props.handleButtonPressed(this.props.name);
  }

  letGlow() {
    this.setState(prevState => ({
      shouldGlow: true
    }));
    const _this = this;
    setTimeout(function () {
      _this.setState(prevState => ({
        shouldGlow: false
      }));
    }, 100);
  }

  addClasses() {
    switch (this.props.name) {
      case 'AC':
        return ' AC-button';
      case '/':
        return ' divide-button operand'
      case '*':
        return ' multiply-button operand'
      case '-':
        return ' minus-button operand'
      case '+':
        return ' plus-button operand'
      case '=':
        return ' equal-button'
      case '0':
        return ' zero-button'
      default:
        return '';
    }
  }

  mapNamesToIds(name) {
    switch (name) {
      case '=':
        return 'equals'
      case '0':
        return 'zero';
      case '1':
        return 'one';
      case '2':
        return 'two';
      case '3':
        return 'three';
      case '4':
        return 'four';
      case '5':
        return 'five';
      case '6':
        return 'six';
      case '7':
        return 'seven';
      case '8':
        return 'eight';
      case '9':
        return 'nine';
      case '+':
        return 'add';
      case '/':
        return 'divide';
      case '*':
        return 'multiply';
      case '-':
        return 'subtract';
      case '.':
        return 'decimal';
      case 'AC':
        return 'clear';
      default:
        return name;
    }
  }

  render() {
    return (
      <div
        className={`button${this.state.shouldGlow ? ' key-pressed' : ''}${this.addClasses()}`}
        id={this.mapNamesToIds(this.props.name)}
        onClick={this.handleClick}
      >
        <span>{this.props.name}</span>
      </div >
    );
  }
};