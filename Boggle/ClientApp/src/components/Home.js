import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Board } from './Board';

let alphabetArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.getAlphabetArray = this.getAlphabetArray.bind(this);
    }
    getAlphabetArray() {
        let alpha = alphabetArray;
        let boardAlphabet = [];
        for (let i = 0; i < 16; i++) {
            boardAlphabet.push(alpha[i]);
        }
        return boardAlphabet;
    }

    componentDidMount() {
        this.getAlphabetArray();
    }
  render () {
      return (
          <div className="jumbotron">
              <h1 className="display-4">Welcome to Boggle Game</h1>
              <p className="lead">This is boggle game </p>
              <hr />
                  <p>You can play boggle game by clicking on Start Game!</p>
              <p className="lead">
                  <Link className="btn btn-primary" to={{
                      pathname: '/board',
                      state: {
                          alphabet: this.getAlphabetArray()
                      }
                  }}>Start Game</Link>
                  </p>
        </div>
    );
  }
}
