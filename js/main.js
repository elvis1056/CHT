(async () => {

  let chartPieOrLine = false

  if ($('.date-time-picker')[0]) {
    $('.date-time-picker').datetimepicker({ format: 'YYYY/MM/DD hh:mm:ss' });
  }

  // $("input[value='error']").prop("checked", true);
  // $("input[value='error']").removeAttr("checked");

  const data = await Promise.all([
    // request.$get('/data/224e54a3d9b34c74ab56902de829b82d_2021-01-06.json'),
    // request.$get('/data/69944d592ad941bd84c28d2ec662b6fe_2021-01-06.json'),
    // request.$get('/data/device3.json'),
    request.$get('/data/success.json'),
    request.$get('/data/error1.json'),
    request.$get('/data/error2.json'),
    request.$get('/data/successA.json'),
    request.$get('/data/successB.json'),
    request.$get('/data/stopped.json'),
  ])

  const mockData = data.map(item => {
    if (item[0]._type === 'success' || item[0]._type === 'stopped') {
      return item[0]
    }
    const res = {
      ...item[0],
      values: {
        tx: item[0].values.tx ? item[0].values.tx.map(([time, val]) => {
          if (time > 1609914846 && time < 1609921446) return [time, val * (Math.random() + 1.2)]
          return [time, val]
        }) : [],
        rx: item[0].values.rx ? item[0].values.rx.map(([time, val]) => {
          if (time > 1609914846 && time < 1609921446) return [time, val * (Math.random() + 1.2)]
          return [time, val]
        }) : []
      }
    }

    return res
  })

  const times1000 = item => {
    return item.map((v, idx) => {
      if(idx === 0) return v * 1000;
      return v
    })
  }

  const calcRange = item => item.reduce((acc, [time, val]) => {
    const low = val * 0.8;
    const high = val * 1.2;
    return [...acc, [time * 1000, low, high]]
  }, [])

  const chartData = mockData.map((item, idx) => {
    const res = {
      ...item,
      values: {
        tx: item.values.tx ? item.values.tx.map(times1000) : [],
        txRange: item.values.tx ? calcRange(data[idx][0].values.tx) : [],
        rx: item.values.rx ? item.values.rx.map(times1000) : [],
        rxRange: item.values.rx ? calcRange(data[idx][0].values.rx) : [],
      }
    }
    return res
  })

  function createChartByRadioChecked(domValue, chartData, chart) {

    function creatChart(newChartData) {
      newChartData.forEach(data => {
        $('.container > #main-content').append('<div id="'+ data.host +'" class="col-md-3 chart-card" onclick="location.href=\'/detail.html\'"><div class="card"><div class="card-header"><h2>' + data.host + '</h2></div><div id="' + data.host + '-chart" class="card-body"></div></div></div>')
        chart.stockChart(data.host + '-chart', {
          chart: {
            zoomType: 'x',
            height: 200,
            events: {
              selection(e) {
                e.preventDefault();
              }
            }
          },
          xAxis: {
            plotBands: (data._type === 'success' || data._type === 'stopped') ? [] : [{
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
          series: [
            {
              name: 'tx',
              data: data.values.tx,
              color: '#7CB5EC'
            },
            {
              name: 'tx range',
              data: data.values.txRange,
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
              name: 'rx',
              data: data.values.rx,
              color:'#4CAF50'
            },
            {
              name: 'rx range',
              data: data.values.rxRange,
              type: 'arearange',
              marker: {
                enabled: false
              },
              fillOpacity: 0.3,
              lineWidth: 0,
              color:'#4CAF50',
              zIndex: 0
            },
          ]
        })
      })
    }

    switch(domValue) {
      case "success":
        $('.container > #main-content').empty()
        const successChartData = chartData.filter(item => item._type === "success")
        creatChart(successChartData)
        return
      case "error":
        $('.container > #main-content').empty()
        const errorChartData = chartData.filter(item => item._type === "error")
        creatChart(errorChartData)
        return
      case "stopped":
        $('.container > #main-content').empty()
        const stoppedChartData = chartData.filter(item => item._type === "stopped")
        creatChart(stoppedChartData)
        return
      default:
        $('.container > #main-content').empty()
        creatChart(chartData)
        return
    }
  }

  function createPieChartByRadioChecked(domValue, chartData, chart) {

    function creatChart(newChartData) {
      console.log(newChartData)
      newChartData.forEach(data => {
        $('.container > #main-content').append('<div id="'+ data.host +'" class="col-md-3 chart-card" onclick="location.href=\'/detail.html\'"><div class="card"><div class="card-header"><h2>' + data.host + '</h2></div><div id="' + data.host + '-chart" class="card-body"></div></div></div>')
        chart.pieChart(data.host + '-chart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            type: 'pie'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                size: 100,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Normal',
                y: (data._type === 'success' || data._type === 'stopped') ? 100 : 61.41,
                // sliced: true,
                // selected: true
                color: '#7CB5EC'
            }, {
                name: 'Ａbnormal',
                y: (data._type === 'success' || data._type === 'stopped') ? 0 : 100-61.41,
                color: '#FF0000'
            }]
          }]
        })
      })
    }

    switch(domValue) {
      case "success":
        $('.container > #main-content').empty()
        const successChartData = chartData.filter(item => item._type === "success")
        creatChart(successChartData)
        return
      case "error":
        $('.container > #main-content').empty()
        const errorChartData = chartData.filter(item => item._type === "error")
        creatChart(errorChartData)
        return
      case "stopped":
        $('.container > #main-content').empty()
        const stoppedChartData = chartData.filter(item => item._type === "stopped")
        creatChart(stoppedChartData)
        return
      default:
        $('.container > #main-content').empty()
        creatChart(chartData)
        return
    }
  }

  createChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)

  $('#myRadio input').on('change', function() {
    createChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)
  });

  $('#changeToPieChart').on('click', function() {
    $('#myRadio input').unbind()
    $('#myRadio input').on('change', function() {
      createPieChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)
    })
    createPieChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)
  })

  $('#changeToLineChart').on('click', function() {
    $('#myRadio input').unbind()
    $('#myRadio input').on('change', function() {
      createChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)
    })
    createChartByRadioChecked($('input[name=inlineRadioOptions]:checked', '#myRadio').val(), chartData, chart)
  })

})()

function searchDevice() {
  const text = $('#nameSearchBox').val();

  $.each($('.chart-card'), function(idx, el) {
    if ($(el).attr('id').includes(text)) {
      $(el).removeClass('hidden');
    } else {
      $(el).addClass('hidden');
    }
  })
}
