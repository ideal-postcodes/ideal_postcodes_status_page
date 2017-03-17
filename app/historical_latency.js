const _ = require("lodash");
const React = require("react");
const Chart = require("chart.js");
const ReactDOM = require("react-dom");

class LineChart extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		const el = ReactDOM.findDOMNode(this);
		const ctx = el.getContext("2d");
		const chart = new Chart(ctx, {type: "line", data: this.props.data, options: this.props.options || {}});
	}

	render() {
		return <canvas />;
	}
}

class HistoricalLatency extends React.Component {
	constructor() {
		super();
	}

	render() {
		const responseCharts = _.toArray(this.props.monitors)
			.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))
			.map(monitor => {
				const responseData = {
					labels: monitor.response_times
						.reverse()
						.map(elem => new Date(elem.datetime * 1000)),
					datasets: [{
						label: "Latency (ms)",
						data: monitor.response_times.reverse().map(elem => parseInt(elem.value, 10))
					}]
				}
				const options = {
					title: {
						display: true,
						position: "top",
						text: `${monitor.friendly_name}, Global Probe Latency (ms)`
					},
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
					<div className="box-body" key={monitor.id}>
						<LineChart data={responseData}
							options={options} />
					</div>
				);
			});
		return (
			<div className="box box-success">
				<div className="box-header with-border">
					<h3 className="box-title">Global Latency Statistics</h3>
					<p>Statistics displayed are average latency numbers from probes based around the world</p>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				{responseCharts}
				<div className="box-footer clearfix">
						
				</div>
			</div>
		);
	}
};

HistoricalLatency.propTypes = {
	monitors: React.PropTypes.object.isRequired
};

module.exports = HistoricalLatency;
