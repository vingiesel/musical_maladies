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

class DropInput extends React.Component{
	constructor (props){
		super(props);
		this.state = {current:props.default_answer};
	}
	onSelect = (e) => {
		if(e.target.value === "..."){
			this.setState({current:null});
		}
		else{
			this.setState({current: e.target.value});
		}
	}
	onSubmit = () => {
		if (!this.state.current){
			return;
		}
		this.props.submit(this.state.current);
	}
	render () {
		var options = this.props.q.choices.map(function (item){
			return <option key={item}>{item}</option>
		}.bind(this));
		return (
			<Row>
				<Col xs={12}>
					<Input className="question_select" type='select' defaultValue={this.state.current} onChange={this.onSelect}>
      					<option>...</option>
						{options}
      				</Input>
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
		console.log(this.props)
		return (
			<Col xs={12}>
				<ButtonGroup>
					<Button onClick={this.yup} primary={this.props.default_answer === true}>{this.props.labels[0]}</Button>
					<Button onClick={this.nope} primary={this.props.default_answer === false}>{this.props.labels[1]}</Button>
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
			case Questions.types.DROP: input = <DropInput submit={this.onAnswer} q={this.props.q}  default_answer={this.props.saved} />;break;
			case Questions.types.BOOL: input = <BoolInput submit={this.onAnswer}  default_answer={this.props.saved} labels={this.props.q.labels}/>;break;
		}
		return (
			<Row key={JSON.stringify(this.props.q)} className="card">
				<Col xs={12}><strong>Question:</strong></Col>
				<Col className="question_text" xs={12}>
					{this.props.q.text}
				</Col>
				{input}
			</Row>
		);
	}
}
