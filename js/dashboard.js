const normalData = [
	[
		1553607000000,
		99
	],
	[
		1553693400000,
		98
	],
	[
		1553779800000,
		100
	],
	[
		1553866200000,
		83
	],
	[
		1554125400000,
		96
	],
]
const errorData = [
	[
		1553607000000,
		1
	],
	[
		1553693400000,
		24
	],
	[
		1553779800000,
		0
	],
	[
		1553866200000,
		17
	],
	[
		1554125400000,
		4
	],
]

const barData = [
	[
		1553607000000,
		40
	],
	[
		1553693400000,
		24
	],
	[
		1553779800000,
		39
	],
	[
		1553866200000,
		83
	],
	[
		1554125400000,
		8
	],
]


const mainChart = chart.stockChart('main-chart', {
	chart: {
		height: 300
	},
	title: {
		text: 'Area Chart'
	},
	series: [{
		name: 'Normal',
		data: normalData,
		type: 'area',
		threshold: null,
		color: '#8BC34A'
	},
	{
		name: 'Error',
		data: errorData,
		type: 'area',
		threshold: null,
		color: '#F44336'
	}],
	responsive: {
		rules: [{
			condition: {
				maxWidth: 500
			},
			chartOptions: {
				chart: {
					height: 300
				},
				subtitle: {
					text: null
				},
				navigator: {
					enabled: false
				}
			}
		}]
	}
});

const barChart = chart.stockChart('bar-chart', {
	chart: {
		height: 365
	},
	title: {
		text: 'Transfer data'
	},
	series: [{
		name: 'Trasfer data',
		data: barData,
		type: 'column',
	},],
});