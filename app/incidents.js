const React = require("react");
const PropTypes = require("prop-types");
const history = require("/config").incidentHistory;

const dateId = d => {
	return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};

const timelineDate = d => {
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	})
};

class NoIncidentLine extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<i className="fa fa-check bg-green"></i>
				<div className="timeline-item">
					<h3 className="timeline-header">{timelineDate(this.props.date)}</h3>
					<div className="timeline-body">
						 No incidents reported
					</div>
				</div>
			</li>
		);
	}
};

NoIncidentLine.propTypes = {
	date: PropTypes.object.isRequired
};

class IncidentLine extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<i className="fa fa-exclamation bg-yellow"></i>
				<div className="timeline-item">
					<h3 className="timeline-header">{timelineDate(this.props.date)}</h3>
					<div className="timeline-body" dangerouslySetInnerHTML={{__html: this.props.message}}>
					</div>
				</div>
			</li>
		);
	}
};

IncidentLine.propTypes = {
	date: PropTypes.object.isRequired,
	message: PropTypes.string.isRequired
};

const subtractDays = (currentDay, offset) => {
	const d = new Date(currentDay.getTime());
	d.setDate(currentDay.getDate() - offset);
	return d;
};

class Incidents extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const today = new Date();
		const dates = [today];
		for (let i = 1; i < 21; i++) {
			dates.push(subtractDays(today, i));
		}
		const incidents = dates.map(d => {
			let id = dateId(d);
			if (history[id]) {
				return <IncidentLine date={d} message={history[id]} key={d.toJSON()}/>
			} else {
				return <NoIncidentLine date={d} key={d.toJSON()}/>	
			}
		});
		return (
			<div className="box box-success">
				<div className="box-header with-border">
					<h3 className="box-title">Past Incidents</h3>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				<div className="box-body">
					<ul className="timeline">
						{incidents}
					</ul>
				</div>
				<div className="box-footer clearfix">
						
				</div>
			</div>
		);
	}
};

module.exports = Incidents;
