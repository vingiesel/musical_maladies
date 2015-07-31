import React from 'react';
import Bootstrap from 'react-bootstrap';
var {Grid, Col, Row, Input, Button, ButtonGroup} = Bootstrap;

export default class DiagnosisPanel extends React.Component {
	render() {
		return (
			<Row className="card seperate">
				<Col xs={12}><strong>{this.props.data.name}</strong></Col>
				<Col className="question_text" xs={12}>
					{this.props.data.desc}
				</Col>
				<Col xs={12}><a href={this.props.data.link} target="_blank">Read More</a></Col>
			</Row>
		);
	}
}
