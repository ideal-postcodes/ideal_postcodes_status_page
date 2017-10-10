const _ = require("lodash");
const React = require("react");
const PropTypes = require("prop-types");
const Chart = require("chart.js");

class LineChart extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const ctx = this.node.getContext("2d");
		new Chart(ctx, {type: "line", data: this.props.data, options: this.props.options || {}});
	}

	render() {
		return <canvas ref={node => this.node = node} />;
	}
}

class HistoricalLatency extends React.Component {
	constructor(props) {
		super(props);
	}
	
	isErrored(probe) {
		return !!probe.uptimeRobotMonitor.error;
	}
	
	chart(probe) {
		const monitor = probe.uptimeRobotMonitor;
		const times = monitor.response_times.slice().reverse();
		const responseData = {
			labels: times.map(elem => new Date(elem.datetime * 1000)),
			datasets: [{
				label: "Latency (ms)",
				data: times.map(elem => parseInt(elem.value, 10))
			}]
		};
		const options = {
			title: {
				display: true,
				position: "top",
				text: `${probe.name}, Global Probe Latency (ms)`
			},
			responsiveAnimationDuration: 500,
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true,
						suggestedMax: 1000
					}
				}],
				xAxes: [{
					type: "time",
					time: {
						unit: "hour"
					} 
				}]
			}
		};
		return (
			<div className="box-body" key={probe.name}>
				<LineChart data={responseData}
					options={options} />
			</div>
		);
	}
	
	isUnitialised(probe) {
		return probe.uptimeRobotMonitor === undefined;
	}
	
	errorMessage(probe) {
		return (
			<div className="box-body" key={probe.name}>
				<p>
					An error occurred when retrieving this data &nbsp;
					<button className="btn btn-xs btn-info" onClick={() => this.props.refresh(probe)}>
						<i className="fa fa-refresh"></i> Try again
					</button>
				</p>
			</div>
		);
	}
	
	renderSingleChart(probe) {
		if (this.isUnitialised(probe)) {
			return <div className="box-body" key={probe.name}>Loading...</div>;
		} else if (this.isErrored(probe)) {
			return this.errorMessage(probe);
		}
		else {
			return this.chart(probe);
		}
	}
	
	renderCharts() {
		return _.toArray(this.props.probes)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(probe => this.renderSingleChart(probe));
	}

	render() {
		return (
			<div className="box box-primary">
				<div className="box-header with-border">
					<h3 className="box-title">Global Latency Statistics</h3>
					<p>Average end-to-end latency for global availability probes</p>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				{this.renderCharts()}
				<div className="box-footer clearfix">
				
				</div>
			</div>
		);
	}
}

LineChart.propTypes = {
	data: PropTypes.object.isRequired,
	options: PropTypes.object.isRequired
};

HistoricalLatency.propTypes = {
	refresh: PropTypes.func.isRequired,
	probes: PropTypes.object.isRequired
};

module.exports = HistoricalLatency;
