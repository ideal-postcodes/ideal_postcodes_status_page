const _ = require("lodash");
const React = require("react");
const PropTypes = require("prop-types");

class HistoricalAvailability extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const rows = _.toArray(this.props.probes)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(probe => {
				const monitor = probe.uptimeRobotMonitor;
				let uptimes;
				if (!monitor) {
					uptimes = [<td key={probe.name} colSpan={5} className="text-center">Loading...</td>];
				} else {
					uptimes = monitor.custom_uptime_ratio.split("-").map((uptime, i) => {
						return <td key={i} className="text-right number-font">{uptime}</td>;
					});
				}
				return (
					<tr key={probe.name}>
						<td>{probe.name}</td>
						{uptimes}
					</tr>
				);
			});
		return (
			<div className="box box-primary">
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
									<th className="text-right">24 Hours</th>
									<th className="text-right">7 Day</th>
									<th className="text-right">30 Day</th>
									<th className="text-right">180 Day</th>
									<th className="text-right">1 Year</th>
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
}

HistoricalAvailability.propTypes = {
	probes: PropTypes.object.isRequired
};

module.exports = HistoricalAvailability;
