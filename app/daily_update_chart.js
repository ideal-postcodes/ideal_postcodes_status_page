const React = require("react");
const PropTypes = require("prop-types");
const Chart = require("chart.js");

class GroupedBarChart extends React.Component {
	constructor(props) {
		super(props);
		
		this.options = {
			title:{ display: false },
			tooltips: {
				mode: "index",
				intersect: false
			},
			legend: { display: false },
			responsive: true,
			scales: {
				xAxes: [{
					stacked: true,
				}],
				yAxes: [{
					stacked: true
				}]
			}
		};
	}
	
	componentDidMount() {
		const ctx = this.node.getContext("2d");
		new Chart(ctx, {type: "bar", data: this.props.data || {}, options: this.options});
	}
	
	render() { 
		return <canvas height="100" ref={node => this.node = node} />;
	}
}

class DailyUpdateChart extends React.Component {
	constructor(props) {
		super(props);  
	}
	
	isErrored() {
		return !!this.props.pafData.error;
	}

	isUnitialised() {
		return Object.keys(this.props.pafData).length === 0;
	}

	renderChart() {
		const dates = Object.keys(this.props.pafData).sort().slice(-7);
			
		const labels = dates.map(date => new Date(date).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short"
		}));

		const pafStats = parameter => dates.map(date => this.props.pafData[date][parameter]);
		
		const responseData = {
			labels: labels,
			datasets: [{
				label: "Addresses updated",
				stack: "Stack 1",
				backgroundColor: "rgba(5,50,109,0.3)",
				data: pafStats("updated")
			},
			{
				label: "Addresses deleted",
				stack: "Stack 2",
				backgroundColor: "rgba(0,166,90,0.5)",
				data: pafStats("deleted")
			}	,
			{
				label: "Addresses inserted",
				stack: "Stack 3",
				backgroundColor: "rgba(5,50,109,0.7)",
				data: pafStats("inserted")
			}]
		};

		return <GroupedBarChart data={responseData}/>;	
	}
	
	renderStatus() {
		if (this.isUnitialised()) {
			return <p>Loading...</p>;
		} else if (this.isErrored()) {
			return (
				<p>
					An error occurred when retrieving this data &nbsp;
					<button className="btn btn-xs btn-info" onClick={this.props.refresh}>
						<i className="fa fa-refresh"></i> Try again
					</button>
				</p>
			);
		} else {
			return this.renderChart();
		}
	}

	render() {
		return (
			<div className="box box-primary">
				<div className="box-header with-border">
					<h3 className="box-title">Address Data Currency</h3>
					<p>Most recent Postcode Address File updates (addresses changes per day)</p>
					<div className="box-tools pull-right">
						<button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
					</div>
				</div>
				<div className="box-body">
					{this.renderStatus()}
				</div> 
				<div className="box-footer clearfix">
					<p><small>Ideal-Postcodes.co.uk updates it's main address file from Royal Mail daily</small></p>
				</div>
			</div>
		);
	}
}

GroupedBarChart.propTypes = {
	data: PropTypes.shape({
		labels: PropTypes.array,
		datasets: PropTypes.arrayOf(PropTypes.object)
	})
};

DailyUpdateChart.propTypes = {
	refresh: PropTypes.func,
	pafData: PropTypes.object.isRequired
};
		
module.exports = DailyUpdateChart;
