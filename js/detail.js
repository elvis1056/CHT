(async () => {

	// let checkedId = []

	let tagsChartData = window.localStorage.getItem('chart') ? JSON.parse(window.localStorage.getItem('chart')).map(item => {
		return { ...item, events: {
			mouseover: function(e) {
					this.svgElem.attr('fill', Highcharts.Color(this.options.color).brighten(0.1).get());
			},
			mouseout: function(e) {
					this.svgElem.attr('fill', this.options.color);
			}
		}}
	}) : []
	let findChartDataId = tagsChartData.length !== 0 ? tagsChartData.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))[tagsChartData.length - 1].id : 1

	let handleChart = () => {}

	if ($('.date-time-picker')[0]) {
		$('.date-time-picker').datetimepicker({ format: 'MM/DD/YYYY hh:mm A' });
	}

	let initTableData = [
		{id: 1, name: 'System', visibleInSelection: false, startTime: moment(1609914846000).format('MM/DD/YYYY HH:mm A'), endTime: moment(1609921446000).format('MM/DD/YYYY HH:mm A'), tags: ['WARNING', 'OTHER']},
		...tagsChartData
	]

	$("#data-table-selection").bootgrid({
		// css: {
		// 		icon: 'zmdi icon',
		// 		iconColumns: 'zmdi-view-module',
		// 		iconDown: 'zmdi-sort-amount-desc',
		// 		iconRefresh: 'zmdi-refresh',
		// 		iconUp: 'zmdi-sort-amount-asc'
		// },
		selection: true,
		multiSelect: true,
		rowSelect: true,
		keepSelection: true,
		navigation: 0,
		sorting: true,
		// columnSelection: false,
		// caseSensitive: false,
		formatters: {
			"tags": function(column, row) {
				let result = [];
				for (let i = 0; i < row.tags.length; i++) {
					if (row.tags[i] === 'WARNING') {
						result.push("<button type='button' class='btn btn-warning btn-xs update'>Warning</button>")
					} else {
						result.push("<button type='button' class='btn btn-info btn-xs update'>"+row.tags[i]+"</button>")
					}
				}
				return result.join('&nbsp');
			},
			"modify": function(column, row) {
				if (row.name === 'System') {
					return "<button disabled id=" + row.id + " type=\"button\" class=\"btn btn-icon command-edit waves-effect waves-circle\"" + row.id + "\"><span class=\"zmdi zmdi-edit\"></span></button>";
				}
				return "<button id=" + row.id + " type=\"button\" class=\"btn btn-icon command-edit waves-effect waves-circle\"" + row.id + "\"><span class=\"zmdi zmdi-edit\"></span></button>";
			},
			"delete": function(column, row) {
				if (row.name === 'System') {
					return "<button disabled id=" + row.id + 'd' + " type=\"button\" class=\"btn btn-icon command-delete waves-effect waves-circle\"" + row.id + "\"><span class=\"zmdi zmdi-delete\"></span></button>";
				}
				return "<button id=" + row.id + 'd' + " type=\"button\" class=\"btn btn-icon command-delete waves-effect waves-circle\"" + row.id + "\"><span class=\"zmdi zmdi-delete\"></span></button>";
			}
		},
		labels: {
      noResults: "where are my results"
    }
	})
	.on("selected.rs.jquery.bootgrid", function(e, array) {
		let arr = $("#data-table-selection").bootgrid("getSelectedRows")
		if (arr.length === 0) {
			handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
				item.hidden = false;
				item.svgElem.show();
			})
		} else {
			handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
				if (!arr.includes(item.id)) {
					item.hidden = true
					item.svgElem.hide();
				} else {
					item.hidden = false;
					item.svgElem.show();
				}
			})
		}

		// console.log($(`[data-row-id="${array[0].id}"]`).find(":checkbox").prop('checked', true))
		// console.log($(`[data-row-id="${array[0].id}"]`).addClass("active"))
		// if (arrNum.includes(array[0].id)) {
		// 	handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
		// 		if (item.id !== array[0].id) {
		// 			item.hidden = true
		// 			item.svgElem.hide();
		// 		} else {
		// 			item.hidden = false;
		// 			item.svgElem.show();
		// 		}
		// 	})
		// } else {
		// 	handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
		// 		item.hidden = false;
		// 		item.svgElem.show();
		// 	})
		// }
		// handleChart.xAxis[0].plotLinesAndBands[array[0].id].svgElem.addClass('backgroundOpacity')
	})
	.on("deselected.rs.jquery.bootgrid", function(e, array) {
		let arr = $("#data-table-selection").bootgrid("getSelectedRows")
		if (arr.length === 0) {
			handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
				item.hidden = false;
				item.svgElem.show();
			})
		} else {
			handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
				if (!arr.includes(item.id)) {
					item.hidden = true
					item.svgElem.hide();
				} else {
					item.hidden = false;
					item.svgElem.show();
				}
			})
		}
		// handleChart.xAxis[0].plotLinesAndBands[array[0].id].svgElem.removeClass('backgroundOpacity')
	})
	.bootgrid("append", initTableData).on("loaded.rs.jquery.bootgrid", function(e, array) {
		let arr = ($("#data-table-selection").bootgrid("getCurrentRows"))
		for(let i = 0; i < arr.length; i++) {
			let id = arr[i].id

			$($(".select-cell > .checkbox")[0]).css({
				display: "none",
				visibility: "hidden"
			})

			$('#'+id+'d').on('click', () => {
				$("#data-table-selection").bootgrid("remove", [id])
				tagsChartData = tagsChartData.filter(item => item.id !== id)
				handleChart.xAxis[0].removePlotBand(id)
				window.localStorage.setItem('chart', JSON.stringify([...tagsChartData.filter(item => item.id !== id)]))
			})

			$('#'+id).on('click', () => {
				$('#updateChartModal').modal('show')
				$('#updateStartDate').val(arr[i].startTime);
				$('#updateEndDate').val(arr[i].endTime);

				// 移除
				// handleChart.xAxis[0].removePlotBand(initTableData[i].id)

				$('#updateChartCloseBtn').on('click', () => {
					// 新增
					// handleChart.xAxis[0].addPlotBand(initTableData[i])
					// window.localStorage.setItem('chart', JSON.stringify([...tagsChartData.filter(item => item.id !== initTableData[i].id)]));
				})
				$('#updateChartSaveBtn').unbind()
				$('#updateChartSaveBtn').on('click', () => {
					let modifyId = arr[i].id
					const color = 'rgba(247,152,4,.5)'
					const findTags = $('#updateChartType').val() === '1' ? [] : ['OTHER']
					const band = {
						id: modifyId,
						name: 'People',
						tags: findTags,
						from: moment($('#updateStartDate').val(), "MM/DD/YYYY h:mma").valueOf(),
						to: moment($('#updateEndDate').val(), "MM/DD/YYYY h:mma").valueOf(),
						startTime: $('#updateStartDate').val(),
						endTime: $('#updateEndDate').val(),
						fillOpacity: 1,
						color,
						zIndex: 3
					}
					$("#data-table-selection").bootgrid("remove", [modifyId])
					handleChart.xAxis[0].removePlotBand(modifyId)
					handleChart.xAxis[0].addPlotBand(band)
					window.localStorage.setItem('chart', JSON.stringify([...tagsChartData.filter(item => item.id !== modifyId), band]));

					$("#data-table-selection").bootgrid("append", [{
						id: modifyId,
						name: 'People',
						startTime: $('#updateStartDate').val(),
						endTime: $('#updateEndDate').val(),
						tags: findTags
					}]).bootgrid("sort", {id: "asc"})
					handleChart.xAxis[0].plotLinesAndBands.forEach((item, i) => {
						item.hidden = false
						item.svgElem.show();
					})
					$('#updateChartModal').modal('hide')
				})
			})
		}
	})



	const data = await request.$get('/data/224e54a3d9b34c74ab56902de829b82d_2021-01-06.json')

	const calcRange = item => item.reduce((acc, [time, val]) => {
		const low = val * (Math.random() * (0.2) + 0.6);
		const high = val * (Math.random() * (0.2) + 1.1);
		return [...acc, [time * 1000, low, high]]
	}, [])

	const calcAmplitute = item => item.reduce((acc, [time, val], idx) => {
		if (idx === 0 || val === 0) return [...acc, [time, 0]]

		const changeRate = (Math.abs(val - item[idx - 1][1])) / item[idx - 1][1] * 100
		return [...acc, [time, changeRate]]
	}, [])

	const tx = data[0].values.tx.map(([time, val]) => {
		if (time > 1609914846 && time < 1609921446) return [time * 1000, val * (Math.random() + 1.2)]
		return [time * 1000, val]
	})
	const rx = data[0].values.rx.map(([time, val]) => {
		if (time > 1609914846 && time < 1609921446) return [time * 1000, val * (Math.random() + 1.2)]
		return [time * 1000, val]
	})
	const rxRange = calcRange(data[0].values.rx);
	const txRange = calcRange(data[0].values.tx)

	const chartData = {
		...data[0],
		values: {
			tx,
			rx,
			rxRange,
			txRange,
			txAmplitute: calcAmplitute(tx),
			rxAmplitute: calcAmplitute(rx),
		}
	}

	const mutipleLineInstance = () => {
		handleChart = chart.stockChart('main-chart', {
			title: {
				text: 'Test Chart Detail'
			},
			chart: {
				zoomType: 'x',
				events: {
					selection(e) {
						e.preventDefault();
						$('#labelModal').modal('show');
						// $('#titleHost').text(`Host: ${data.host}`);
						$('#startDate').val(moment(e.xAxis[0].min).format('MM/DD/YYYY HH:mm A'));
						$('#endDate').val(moment(e.xAxis[0].max).format('MM/DD/YYYY HH:mm A'));
						$('#labelSaveBtn').unbind();
						$('#labelSaveBtn').on('click', () => {
							const type = $('#labelType').val();
							// const result = []
							const color = 'rgba(247,152,4,.5)'
							let id = findChartDataId+=1
							const findTags = $('#labelType').val() === '1' ? [] : ['OTHER']
							const band = {
								id: id,
								name: 'People',
								tags: findTags,
								from: e.xAxis[0].min,
								to: e.xAxis[0].max,
								startTime: moment(e.xAxis[0].min).format('MM/DD/YYYY HH:mm A'),
								endTime: moment(e.xAxis[0].max).format('MM/DD/YYYY HH:mm A'),
								fillOpacity: 1,
								color,
								zIndex: 3,
								events: {
									mouseover: function(e) {
											this.svgElem.attr('fill', Highcharts.Color(this.options.color).brighten(0.1).get());
									},
									mouseout: function(e) {
											this.svgElem.attr('fill', this.options.color);
									}
								}
							}
							window.localStorage.setItem('chart', JSON.stringify([...tagsChartData, band]));
							tagsChartData.push(band)
							console.log(band)
							this.update({
								xAxis: {
									plotBands: this.options.xAxis[0].plotBands ? [
										...this.options.xAxis[0].plotBands,
										{ ...band }
									]
									:
										[{ ...band }]
								}
							})
							$('#labelModal').modal('hide');
							$("#data-table-selection").bootgrid("append", [
								{
									id: id,
									name: 'People',
									startTime: moment(e.xAxis[0].min).format('MM/DD/YYYY HH:mm A'),
									endTime: moment(e.xAxis[0].max).format('MM/DD/YYYY HH:mm A'),
									tags: findTags
								}
							])
						});
					}
				}
			},
			tooltip: {
				useHTML:true,
				formatter() {
					return this.points.reduce((acc, curr, idx) => {
						let str = '';
						if (idx === 0) str += `${moment(this.x).format('MM/DD HH:mm')}<br>`
						if (curr.series.options.type === 'arearange') {
							str += `${curr.series.name} max: ${curr.point.high.toFixed(0)}<br/>
							${curr.series.name} min: ${curr.point.low.toFixed(0)}<br/>`
						} else if (curr.series.options.type === 'column') {
							str += `${curr.series.name}: ${curr.y.toFixed(0)} %<br>`
						} else {
							str += `${curr.series.name}: ${curr.y.toFixed(0)} <br>`
						}
						return acc += str
					}, '')
				}
			},
			xAxis: {
				plotBands: [{
					id: 1,
					from: 1609914846000,
					to: 1609921446000,
					color: 'rgba(255,170,204,.5)',
					zIndex: 3
				}, ...tagsChartData],
				type: 'value',
				dateTimeLabelFormats: {
					millisecond: '%H:%M:%S',
					second: '%H:%M:%S',
					minute: '%H:%M',
					hour: '%H:%M',
					day: '%m/%d %H:%M'
				}
			},
			yAxis: [
				{
					opposite: false
				},
				{
					title: 'txAmplitute',
					labels: {
						format: '{value} %'
					}
				},
			],
			navigator: {
				enabled: true
			},
			series: [
				{
					name: 'tx',
					data: chartData.values.tx,
					color: '#7CB5EC'
				},
				{
					name: 'tx range',
					data: chartData.values.txRange,
					type: 'arearange',
					marker: {
						enabled: false
					},
					fillOpacity: 0.3,
					lineWidth: 0,
					color: '#7CB5EC',
					zIndex: 0
				},
				{
					name: 'tx change',
					data: chartData.values.txAmplitute,
					color: '#00BCD4',
					type: 'column',
					yAxis: 1,
					tooltip: {
						valueSuffix: '%'
					}
				},
				{
					name: 'rx',
					data: chartData.values.rx,
					color: '#4CAF50'
				},
				{
					name: 'rx range',
					data: chartData.values.rxRange,
					type: 'arearange',
					marker: {
						enabled: false
					},
					fillOpacity: 0.3,
					lineWidth: 0,
					color: '#4CAF50',
					zIndex: 0
				},
				{
					name: 'rx change',
					data: chartData.values.rxAmplitute,
					color: '#CDDC39',
					type: 'column',
					yAxis: 1,
					tooltip: {
						valueSuffix: '%',
					}
				},
			]
		})
	}

	const areaInstance = () => { chart.stockChart('main-chart', {
		title: {
			text: 'Test Chart Detail'
		},
		chart: {
			type: 'areaspline',
			zoomType: 'x',
			events: {
				selection(e) {
					e.preventDefault();
					$('#labelModal').modal('show');
					// $('#titleHost').text(`Host: ${data.host}`);
					$('#startDate').val(moment(e.xAxis[0].min).format('MM/DD/YYYY HH:mm A'));
					$('#endDate').val(moment(e.xAxis[0].max).format('MM/DD/YYYY HH:mm A'));
					$('#labelSaveBtn').unbind();
					$('#labelSaveBtn').on('click', () => {
					  const type = $('#labelType').val();
					  const color = 'rgba(247,152,4,.5)'
					  const band = {
					    from: e.xAxis[0].min,
					    to: e.xAxis[0].max,
					    fillOpacity: 1,
					    color,
					    zIndex: 3
					  }
					  this.update({
					    xAxis: {
					      plotBands: this.options.xAxis[0].plotBands ? [
					        ...this.options.xAxis[0].plotBands,
					        { ...band }
					      ]
					      :
					        [{ ...band }]
					    }
					  })
					  $('#labelModal').modal('hide');
					});
				}
			}
		},
		xAxis: {
			plotBands: [{
				from: 1609914846000,
				to: 1609921446000,
				color: 'rgba(255,170,204,.5)',
				zIndex: 3
			}],
			type: 'value',
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%m/%d %H:%M'
			}
		},
		navigator: {
			enabled: true
		},
		series: [
			{
				name: 'tx',
				data: chartData.values.tx,
				color: '#7CB5EC'
			},
			{
				name: 'rx',
				data: chartData.values.rx,
				color: '#4CAF50'
			},
		]
	})
	}

	for (let i = 0; i < 3; i ++) {
		$('#similar-chart').append('<div id="similar-chart-'+ i +'"</div>')
		chart.stockChart('similar-chart-' + i, {
			title: {
				text: 'Device' + i
			},
			chart: {
				height: 150
			},
			legend: {
				enabled: false
			},
			xAxis: {
				visible: false
			},
			yAxis : {
				visible: false
			},
			series: [
				{
					name: 'tx',
					data: chartData.values.tx,
					color: '#7CB5EC'
				},
				{
					name: 'rx',
					data: chartData.values.rx,
					color: '#4CAF50'
				},
			]
		})
	}

	const handleChartTypeChange = () => {
		const val = $('#chart-type').val();
		if (val === '0') mutipleLineInstance();
		else areaInstance();
	}

	handleChartTypeChange();

	$('#chart-type').on('change', handleChartTypeChange)

})()
