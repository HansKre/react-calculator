import React from 'react';
import './Display.css';

export default class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    }
  }

  render() {
    return (
      <div className='display'>
        <p className='formula'>
          {this.props.formula}
        </p>
        <p className='current' id='display'>
          {this.props.current}
        </p>
      </div>
    );
  }
};