import React from 'react';
import Bootstrap from 'react-bootstrap';
var {Grid, Col, Row, Input, Button, ButtonGroup} = Bootstrap;

import $ from 'jquery';
import _ from 'lodash';

import QuestionPanel from 'app/QuestionPanel';
import AnswerPanel from 'app/AnswerPanel';
import DiagnosisPanel from 'app/DiagnosisPanel';

import Question from 'app/questions';
import Diagnosis from 'app/diagnosis';

class Base extends React.Component{
	constructor (props) {
		super(props)
		this.state = {current_question: Question.list.g1, answers: [], saved_answer:null};
	}
	onAnswer = (answer, question) => {
		var answers = this.state.answers;
		answers.push({answer:answer, question: question});
		var next = question.next(answer, answers);
		this.setState({current_question: Question.list[next], answers:answers, saved_answer:null});
	}
	onRestart = () => {
		this.setState({current_question: Question.list.g1, answers: [], saved_answer:null});
	}
	onToggleHistory = () => {
		var history = React.findDOMNode(this.refs.history);
		$(history).slideToggle();
		var controls = React.findDOMNode(this.refs.controls);
		$(controls).slideToggle();
	}
	onGoto = (q, a) => {
		var answers = this.state.answers;
		while (answers.length > 0){
			var answer = answers.pop();
			if(answer.question === q){
				this.setState({current_question:q, saved_answer:a, answers:answers});
				this.onToggleHistory()
				return;
			}
		}
	}
	onBack = () => {
		if(this.state.answers && this.state.answers.length > 0){
			var answers = this.state.answers;
			var answer = answers.pop();
			this.setState({current_question:answer.question, saved_answer:answer.answer, answers:answers});
		}
	}
	onSkip = () => {
		// var answers = this.state.answers;
		if(!this.state.current_question.mandatory){
			var next = this.state.current_question.next(null, this.state.answers, true);
			this.setState({current_question: Question.list[next], answers:answers, saved_answer:null});
		}
	}
	render () {

		var history_links = this.state.answers.map(function (item) {
			return <AnswerPanel key={item.question.text} question={item.question} answer={item.answer} revert={this.onGoto}/>
		}, this);

		var answers_dict = {}
		_.forEach(Question.list, function (q, name){
			_.forEach(this.state.answers, function(answer){
				if (answer.question === q){
					answers_dict[name] = answer.answer;
				}
			}, this);
		}, this);

		var diag_list = Diagnosis.filter(function (item){
			return item.check(answers_dict);
		}).map(function (item){
			return <DiagnosisPanel data={item} />
		})

		console.log(answers_dict);

		return (
			<Grid className="background" fluid>
				<Row className="header">
					<Col xs={4}>Musical Maladies</Col>

					<Col className="hidden-xs centered" sm={4}>
						<a className="home_link" href="//google.com"><i className="fa fa-home"/> Home</a>
					</Col>
					<Col className="visible-xs centered" xs={4}><a className="home_link" href="//google.com">Home</a></Col>

					<Col className="hidden-xs centered" xsOffset={2} sm={2}>
						<a className="home_link" onClick={this.onRestart} href="javscript:void(0)"><i className="fa fa-repeat"/> Restart</a>
					</Col>
					<Col className="visible-xs centered" xs={4}><a className="home_link" onClick={this.onRestart} href="javscript:void(0)">Restart</a></Col>
				</Row>
				<Row className="content">
					<Col xsOffset={0} xs={12} smOffset={1} sm={10} fluid>
						<Row>
							<Col className='card commands'>
								<Row ref="controls">
									<Col className="centered visible-xs" xs={4}>
									<a className="home_link" onClick={this.onBack} href="javascript:void(0)">Previous</a>
									</Col>
									<Col className="centered hidden-xs" sm={4}>
									<a className="home_link" onClick={this.onBack} href="javascript:void(0)"><i className="fa fa-backward"/> Previous</a>
									</Col>

									<Col className="centered" xs={4}>
									<a className="home_link" href="javascript:void(0)" onClick={this.onToggleHistory}>History</a>
									</Col>

									<Col className="centered visible-xs" xs={4}>Skip!</Col>
									<Col className="centered hidden-xs" sm={4}>
										<a className="home_link" onClick={this.onSkip} href="javascript:void(0)">Skip! <i className="fa fa-forward"/></a>
									</Col>
								</Row>
								<Row ref="history" className="start_hidden">
									<Col xsOffset={4} xs={4} onClick={this.onToggleHistory} className="centered">
										<a href="javascript:void(0)"><i className="fa fa-chevron-left"/> Back</a>
									</Col>
									<Col xs={12}>
										{history_links}
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<QuestionPanel ref="question" q={this.state.current_question} saved={this.state.saved_answer} submit={this.onAnswer}/>
							<Col className="row_spacer visible-xs" xs={12}/>
							<Col xs={12} smOffset={2} sm={5}>
								<Row className="card" >
									<Col xs={10}><strong>Possible Diagnosis:</strong></Col>
									<Col xs={2}>
										<span className="fa-stack fa-1x">
										  <i className="fa fa-square fa-stack-2x"></i>
										  <strong className="fa-stack-1x fa-stack-text white">{diag_list.length}</strong>
										</span>
									</Col>
								</Row>
								{diag_list}
							</Col>
						</Row>
					</Col>
					<Col className="hidden-xs hidden-" sm={1} hidden-xs fluid/>
				</Row>
			</Grid>
		);
	}
}

React.render(<Base/>, document.body);