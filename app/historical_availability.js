const _ = require("lodash");
const React = require("react");

class HistoricalAvailability extends React.Component {
	constructor() {
		super();
	}

	render() {
		const rows = _.toArray(this.props.monitors)
			.sort((a, b) => a.friendlyname.localeCompare(b.friendlyname))
			.map(monitor => {
				let uptimes = monitor.customuptimeratio.split("-").map((uptime, i) => {
					return <td key={i}>{uptime}%</td> 
				});
				return (
					<tr key={monitor.id}>
						<td>{monitor.friendlyname}</td>
						{uptimes}
					</tr>
				);
			});
		return (
			<div className="box box-success">
				<div className="box-header with-border">
					<h3 className="box-title">Availability Dashboard</h3>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				<div className="box-body">
					<div className="table-responsive">
						<table className="table no-margin">
							<thead>
								<tr>
									<th>Service</th>
									<th>24 Hours</th>
									<th>7 Day</th>
									<th>30 Day</th>
									<th>180 Day</th>
									<th>1 Year</th>
								</tr>
							</thead>
							<tbody>
								{rows}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
};

HistoricalAvailability.propTypes = {
	monitors: React.PropTypes.object.isRequired
};

module.exports = HistoricalAvailability;
