import React, { Component } from 'react';
import ReactDOM from "react-dom";

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alphabetArray: this.props.location.state.alphabet,
            alphabetArrayList: [],
            selectedWordArray: [],
            searchedWord: "",
            message: "",
            isAdded: false,
            timeLeft: 120,
            disable: false
        };
        this.shuffleAlphabet = this.shuffleAlphabet.bind(this);
        this.onClickShuffle = this.onClickShuffle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateWord = this.validateWord.bind(this);
        this.renderSelectedWord = this.renderSelectedWord.bind(this);
        this.getAlphabetBoard = this.getAlphabetBoard.bind(this);
        this.format = this.format.bind(this);
        this.setTime = this.setTime.bind(this);
        this.onClickRestart = this.onClickRestart.bind(this);
        this.getTotalScore = this.getTotalScore.bind(this);
        this.getChunkArray = this.getChunkArray.bind(this);
        this.isInValidPattern = this.isInValidPattern.bind(this);
        this.getTransposeArray = this.getTransposeArray.bind(this);
        this.isInDiagonal = this.isInDiagonal.bind(this);
    }

    componentDidMount() {
        let seond = this.state.timeLeft;
        this.shuffleAlphabet();
        this.interval = setInterval(() => {
            this.setTime()
        }, 1000);
    }

    setTime() {
        if (this.state.timeLeft <= 0) {
            this.setState({ disable: true });
        }
        else {
            this.setState(state => ({
                timeLeft: state.timeLeft - 1
            }));
        }
    }

    //shuffle the alphabet array randomly
    shuffleAlphabet() {
        var array = this.state.alphabetArray;
        let i = array.length - 1;
        for (i; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        this.setState({ alphabetArray: array });
    }

    //shuffle alphabet on click
    onClickShuffle() {
        this.shuffleAlphabet();
    }

    async onClickRestart() {
        this.shuffleAlphabet();
        await this.setState({ timeLeft: 120, disable: false, selectedWordArray: [] });
        this.setTime();
    }

    //handle text change on input box
    handleChange(e) {
        let value = e.target.value;
        this.setState({ searchedWord: value });
    }

    //validate typed word
    validateWord() {
        let wordArray = this.state.selectedWordArray;
        let word = this.state.searchedWord;
        if (word === '') {
            this.setState({ message: '', isAdded: false });
            return;
        }
        let isValidPattern = this.isInValidPattern();
        if (isValidPattern) {
            let point = word.length;
            let wordIndex = this.state.selectedWordArray.findIndex(obj => obj.word === word);;

            if (wordIndex == -1 && point > 0) {
                let url = "https://api.dictionaryapi.dev/api/v1/entries/en//" + word;
                fetch(url, {
                    "method": "GET"
                })
                    .then(response => {
                        var responseCode = response.status;
                        debugger;
                        if (responseCode === 200) {
                            wordArray.push({ word: this.state.searchedWord, point: point });
                            this.setState({ selectedWordArray: wordArray, searchedWord: '', });
                            this.setState({ message: "Word added successfully", isAdded: true });
                        }
                        else {
                            this.setState({ message: "Invalid word", isAdded: false })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });

            } else {
                this.setState({ message: "Already Added", isAdded: false });
            }
        } else {
            this.setState({ message: "Invalid Pattern", isAdded: false });
        }


    }

    //get index of word
    getIndex(value) {
        if (this.state.selectedWordArray.length > 0)
            return this.state.selectedWordArray.findIndex(obj => obj.word === value);
        return -1;
    }

    //validate pattern of the alphabet as vertical, horizontal and diagonal
    isInValidPattern() {
        let chunkArray = this.getChunkArray();
        var word = this.state.searchedWord;
        let isMatched = false;
        let diagonalArray1 = [];
        let diagonalArray2 = [];
        chunkArray.map((array, index) => {
            let arr = array.join('');
            let arrReverse = array.reverse().join('');
            if (arr.includes(word) || arrReverse.includes(word))
                isMatched = true;
            let d1 = chunkArray[index][index];
            diagonalArray1.push(d1)
            let d2 = chunkArray[index][chunkArray.length - index - 1];
            diagonalArray2.push(d2);
        });

        let transposeArray = this.getTransposeArray(chunkArray);
        transposeArray.map((array, index) => {
            let arr = array.join('');
            let arrReverse = array.reverse().join('');
            if (arr.includes(word) || arrReverse.includes(word))
                isMatched = true;
        });
        if (!isMatched)
            return this.isInDiagonal(diagonalArray1, diagonalArray2);
        return isMatched;
    }

    //generate alphabet board
    getAlphabetBoard() {
        var array = this.state.alphabetArray;
        let chunkArray = this.getChunkArray();
        const alphabetList = chunkArray.map((array, index) => {
            return (
                <tr key={index} className={index + " rows"}>
                    {
                        array.map((alpha, i) => {
                            return (
                                <td id={alpha} className={i} key={alpha}>{alpha}</td>
                            )
                        })
                    }
                </tr>
            )
        });

        return (alphabetList);
    }

    //get chunk array from array
    getChunkArray() {
        var array = this.state.alphabetArray;
        let chunkArray = [];
        let i, j, tempArray, chunk = 4;
        for (i = 0, j = array.length; i < j; i += chunk) {
            tempArray = array.slice(i, i + chunk);
            chunkArray.push(tempArray);
        }
        return chunkArray;
    }

    //get transpose array
    getTransposeArray(array) {
        // Calculate the width and height of the Array
        var w = array.length || 0;
        var h = array[0] instanceof Array ? array[0].length : 0;

        // In case it is a zero matrix, no transpose routine needed.
        if (h === 0 || w === 0) { return []; }

        var i, j, t = [];
        for (i = 0; i < h; i++) {
            t[i] = [];
            for (j = 0; j < w; j++) {
                t[i][j] = array[j][i];
            }
        }
        return t;
    }

    //validate against diagonal
    isInDiagonal(array1, array2) {
        let ar1 = array1.join('');
        let reverseAr1 = array1.reverse().join('');
        let arr2 = array2.join('');
        let reverseArr2 = array2.reverse().join('');
        let word = this.state.searchedWord;
        if (ar1.includes(word) || reverseAr1.includes(word))
            return true;
        if (array2.includes(word) || reverseArr2.includes(word))
            return true;
        return false;
    }

    //format timer with minute and second
    format(second) {
        let seconds = second % 60;
        let minutes = Math.floor(second / 60);
        minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
        seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
        return minutes + ':' + seconds;
    }

    //get total score of the valid word
    getTotalScore() {
        let array = this.state.selectedWordArray;
        const total = array.reduce((total, word) => total + word.point, 0);
        return total;
    }

    //render selected valid word
    renderSelectedWord() {
        let selectedArray = this.state.selectedWordArray;
        if (selectedArray.length > 0) {
            const wordList = selectedArray.map((obj, index) => {
                return (
                    <tr key={index}>
                        <td key={obj.word}>{obj.word}</td>
                        <td key={index}>{obj.point}</td>
                    </tr>
                )
            });
            return (wordList);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4">
                    <h3 className="ml-3 text-center">Board</h3>
                    <table id="board" className="table table-bordered">
                        <tbody>
                            {this.getAlphabetBoard()}
                        </tbody>
                    </table>
                    <div className="row">
                        <div className="input-group mb-3 ml-3">
                            <div className="input-group-prepend btn-group">
                                <button onClick={this.onClickShuffle} className="btn btn-primary text-center mr-2">Rotate</button>
                                <button onClick={this.onClickRestart} className="btn btn-primary text-center mr-3">Restart</button>
                                <button type="button" className="btn btn-info">
                                    Time Left <span className="badge badge-light">{this.format(this.state.timeLeft)}</span>
                                    <span className="sr-only"></span>
                                </button>
                            </div>
                        </div>
                        <div className="input-group mb-3 ml-3">
                            <input disabled={this.state.disable} type="text" onChange={this.handleChange} className="form-control" placeholder="Type Word" />
                            <div className="input-group-append">
                                <button disabled={this.state.disable} className="btn btn-primary" onClick={this.validateWord}>Submit</button>
                            </div>

                        </div>
                        {this.state.message !== '' &&
                            <div className={this.state.isAdded === true ? "input-group mb-3 ml-3 alert alert-success" : "input-group mb-3 ml-3 alert alert-danger"} role="alert">
                                {this.state.message}
                            </div>
                        }
                    </div>
                </div>
                <div>

                </div>
                <div className="col-sm-4">
                    <div className="col-sm-12">
                        <h3>Choosen Word</h3>
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
                            <tfoot>
                                <tr>
                                    <th >Total Score:</th>
                                    <th>{this.getTotalScore()} </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
