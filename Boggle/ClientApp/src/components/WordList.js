import React, { Component } from 'react';

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alphabetArray: [],
        };
    }

    render() {
        return (
                <div className="column row">
                    <div className="col-sm-12">
                        <h3>Choosen word</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Word</th>
                                    <th>Point</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderSelectedWord()}
                            </tbody>
                        </table>
                    </div>
                </div>
        );
    }
}