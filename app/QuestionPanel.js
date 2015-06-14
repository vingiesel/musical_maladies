import React from 'react';

import Bootstrap from 'react-bootstrap';
var {Grid, Col, Row, Input, Button, ButtonGroup, Alert} = Bootstrap;
import Questions from 'app/questions';

class NumberInput extends React.Component{
	constructor (props){
		super(props);
		this.state = {error:null};
	}
	check = (value) => {
		return 
	}
	onChange = (e) => {
		if (isNaN(Number(e.target.value))){
			this.setState({error:"That doesn't look right. Please enter a valid number!"});
		}else{
			this.setState({error:null});
		}
	}
	onSubmit = () => {
		var number = React.findDOMNode(this.refs.number).value.trim();
		if (!this.state.error && number !== ""){
			this.props.submit(Number(number));
		}
	}
	render () {
		return (
			<Row>
				<Col xs={12} className="seperate">
					<input ref="number" onChange={this.onChange} type="text" defaultValue={this.props.default_answer}/>
				</Col>
				<Col xs={12} className="seperate">
					<Button disabled={Boolean(this.state.error)} onClick={this.onSubmit}>Submit</Button>
				</Col>
				{this.state.error?
				<Col xs={12} className="seperate">
					<Alert bsStyle='danger'>
						{this.state.error}
					</Alert>
				</Col>
				:undefined}
			</Row>
		)
	}
}

class ListInput extends React.Component{
	constructor (props){
		super(props);
		this.state = {current:props.default_answer};
	}
	onSelect = (e) => {
		this.setState({current: e});
	}
	onSubmit = () => {
		if (!this.state.current){
			return;
		}
		this.props.submit(this.state.current);
	}
	render () {
		var options = this.props.q.choices.map(function (item){
			return <Input key={item} onChange={this.onSelect.bind(this, item)} type='radio' label={item} checked={item === this.state.current} />
		}.bind(this));
		return (
			<Row>
				<Col xs={12}>
					{options}
				</Col>
				<Col xs={12} className="seperate">
					<Button onClick={this.onSubmit} disabled={!this.state.current}>Submit</Button>
				</Col>
			</Row>
		)
	}
}

class BoolInput extends React.Component{
	yup = () => {
		this.props.submit(true);
	}
	nope = () => {
		this.props.submit(false);
	}
	render () {
		return (
			<Col xs={12}>
				<ButtonGroup>
					<Button onClick={this.yup} primary={this.props.default_answer === true}>True</Button>
					<Button onClick={this.nope} primary={this.props.default_answer === false}>False</Button>
				</ButtonGroup>
			</Col>
		)
	}
}

export default class QuestionPanel extends React.Component {
	onAnswer = (answer) => {
		this.props.submit(answer, this.props.q);
	}
	render() {
		// var input = <NumberInput submit={this.onAnswer}/>;
		var input;
		switch (this.props.q.type){
			case Questions.types.NUMBER: input = <NumberInput submit={this.onAnswer} default_answer={this.props.saved} />;break;
			case Questions.types.LIST: input = <ListInput submit={this.onAnswer} q={this.props.q}  default_answer={this.props.saved} />;break;
			case Questions.types.BOOL: input = <BoolInput submit={this.onAnswer}  default_answer={this.props.saved} />;break;
		}
		return (
			<Col className="card" xs={12} sm={5}>
				<Col xs={12}><strong>Question:</strong></Col>
				<Col className="question_text" xs={12}>
					{this.props.q.text}?
				</Col>
				{input}
				{/*<Col xs={12}>
					<Input type='radio' name='one' label='Radio' />
					<Input type='radio' name='one' label='Radio' checked/>
					<Input type='radio' name='one' label='Radio' />
				</Col>
				
				<Col xs={12}>
					<ButtonGroup>
						<Button>True</Button>
						<Button>False</Button>
					</ButtonGroup>
				</Col>*/}
				
			</Col>
		);
	}
}
