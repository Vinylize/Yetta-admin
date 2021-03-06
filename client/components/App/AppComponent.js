import React from 'react';
import 'normalize.css/normalize.css';
import 'react-mdl/extra/css/material.cyan-red.min.css';
import Navbar from '../Navbar/NavbarComponent';
import styles from './App.scss';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={styles.root}>
        {/* <div style={{marginTop:50}}><h1>{this.props.viewer.id}</h1></div>*/}
        <Navbar />
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
