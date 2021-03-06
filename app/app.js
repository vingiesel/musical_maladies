import React from 'react';
import Bootstrap from 'react-bootstrap';
var {Grid, Col, Row, Input, Button, ButtonGroup, ProgressBar} = Bootstrap;

import $ from 'jquery';
import _ from 'lodash';
import store from 'store2';

import QuestionPanel from 'app/QuestionPanel';
import AnswerPanel from 'app/AnswerPanel';
import DiagnosisPanel from 'app/DiagnosisPanel';

import Question from 'app/questions';
import Diagnosis from 'app/diagnosis';

class Base extends React.Component{
	constructor (props) {
		super(props)

		// var default_answers = store.get('history_answers', []);
		// var default_start = store.get('history_start', Question.first) || Question.first;

		// console.log(default_start)

		this.state = {current_question: Question.list[Question.first], answers: [], saved_answer:null};
	}


	componentDidUpdate (){
		// store.set('history_answers', this.state.answers);
		// store.set('history_start', this.getQuestionName(this.state.current_question));

		// console.log(this.getQuestionName(this.state.current_question));
	}


	onAnswer = (answer, question) => {
		var answers = this.state.answers;
		answers.push({answer:answer, question: question});

		var answers_dict = this.makeAnswerDict(answers);

		var next = question.next(answer, answers_dict);
		while (next !== "DONE"){
			var current_question = Question.list[next];
			if(current_question.mandatory || current_question.condition(answers_dict)){
				break;
			}else{
				var next = Question.list[next].next(null, answers, true);
			}
		}

		if (next === "DONE"){
			this.setState({current_question: "DONE", answers:answers, saved_answer:null});
		}else{
			this.setState({current_question: Question.list[next], answers:answers, saved_answer:null});
		}
	}
	onRestart = () => {
		this.setState({current_question: Question.list[Question.first], answers: [], saved_answer:null});
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
		var answers = this.state.answers;
		if(!this.state.current_question.mandatory){
			var next = this.state.current_question.next(null, this.state.answers, true);
			this.setState({current_question: Question.list[next], answers:answers, saved_answer:null});
		}
	}
	// you want answers?
	// I WANT THE TRUTH!
	makeAnswerDict = (answers) => {
		var answers_dict = {}
		_.forEach(Question.list, function (q, name){
			_.forEach(answers, function(answer){
				if (answer.question === q){
					answers_dict[name] = answer.answer;
				}
			}, this);
		}, this);

		return answers_dict;
	}

	getQuestionName = (question) => {
		return Object.keys(Question.list).filter(function(key) {return Question.list[key] === question})[0]
	}

	getProgress = () =>{
		var current_name = _.findKey(Question.list, (item)=>{
			return _.isEqual(item, this.state.current_question);
		});
		var key_list = _.keys(Question.list);
		var total = key_list.length;

		var at = _.indexOf(key_list, current_name);
		return (at / total) * 100;
	}

	render () {
		var counter = 0;
		var history_links = this.state.answers.map(function (item) {
			counter += 1; // basically, order isn't important.
			return <AnswerPanel key={counter} question={item.question} answer={item.answer} revert={this.onGoto}/>
		}, this);

		var answers_dict = this.makeAnswerDict(this.state.answers);

		var diag_list = Diagnosis.filter(function (item){
			if (item.custom){
				return (item.custom(answers_dict) !== false);
			}else{
				return item.check(answers_dict);
			}
		}).map(function (item){
			var data = item.custom?item.custom(answers_dict):item;
			return <DiagnosisPanel key={JSON.stringify(data)} data={data} />
		});

		var progress = this.getProgress();

		console.log(progress);

		return (
			<Grid className="background" fluid>
				<Row className="header">
					<Col xs={4}>Painless Musician Quiz</Col>

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
									<Col xs={12}>
										<ProgressBar now={progress}></ProgressBar>
									</Col>

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
									<Col xs={12} onClick={this.onToggleHistory} className="centered">
										<a href="javascript:void(0)"><i className="fa fa-chevron-left"/> Back</a>
									</Col>
									<Col xs={12} className="history_stuff">
										{history_links}
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<Col xs={12} sm={5}>
								{this.state.current_question !== "DONE"?<QuestionPanel key={this.state.current_question} ref="question" q={this.state.current_question} saved={this.state.saved_answer} submit={this.onAnswer}/>
								:
								<Row className="card">All Done!</Row>}
								{(this.state.current_question !== "DONE" && this.state.current_question.section === Question.sections.MUSCULAR)?
								<Row className="card seperate">
									<strong>Pain Scale:</strong>
									<ul>
										<li>Tier 1 - pain at one spot - while playing (regularly)</li>
										<li>Tier 2 - pain at several spots while playing (regularly)</li>
										<li>Tier 3 - Pain continues during Activities of Daily Living or rest</li>
										<li>Tier 4 - All of the above but includes night, change in physical appearance and loss of motor function</li>
										<li>Tier 5 - Activities of Daily Living add to pain and little ability to complete tasks, continuous pain, obvious physical changes</li>
									</ul>
									<p className="credits">
									Adapted From: Fry, Hunter J. H. “Overuse Syndrome of the Upper Limb in Musicians.” The Medical Journal of Australia 144, no. 4 (1986): 182-185; Fry, Hunter J. H, “Overuse Syndrome in Musicians: Prevention and Management.” The Lancet 328, Issue 8509 (1986): 728-731; and Fry, H. J. H. “The Treatment of Overuse Syndrome in Musicians.” Journal of The Royal Society of Medicine 81 no. 10 (1988): 572-575.
									</p>
								</Row>:undefined}
								{(this.state.current_question.image_url)?
									<Row className="card seperate">
										<img className="shrink_image" src={this.state.current_question.image_url}/>
									</Row>
								:undefined}
							</Col>
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
