import React from 'react';
import Bootstrap from 'react-bootstrap';
var {Grid, Col, Row} = Bootstrap;

export default class AnswerPanel extends React.Component {
	handleClick = () => {
		this.props.revert(this.props.question, this.props.answer);
	}
	render() {
		var answer = this.props.answer;
		var text = this.props.question.text;
		if(this.props.answer === true){
			answer = "True";
		}else if(this.props.answer === false){
			answer = "False";
		}
		if(text.length > 102){
			text = text.substr(0, 50) + " ... " + text.substr(text.length-50, text.length)
		}
		return (
			<Col onClick={this.handleClick} className="answer_holder" xs={12} sm={4} md={4}>
				<Col xs={8}>
					{text}?
				</Col>
				<Col xs={4}>
					{answer}
				</Col>
			</Col>
		);
	}
}
