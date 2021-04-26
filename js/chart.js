Highcharts.setOptions({
  time: {
    useUTC: false
  }
})

const defaultOptions = {
  credits: {
    enabled: false
  },
  legend: {
    enabled: true,
    align: 'right',
    verticalAlign: 'top',
  },
  tooltip: {
    useHTML:true,
    formatter() {
      if (this.series && this.series.options.type === 'arearange') {
        return `${moment(this.x).format('MM/DD HH:mm')} <br/>
          max: ${this.point.high.toFixed(0)}<br/>
          min: ${this.point.low.toFixed(0)}`
      }

      const suffix = this.series && this.series.options.tooltip && this.series.options.tooltip.valueSuffix ? this.series.options.tooltip.valueSuffix : ''
      return `${moment(this.x).format('MM/DD HH:mm')} <br/>
        ${this.series.name}: ${this.y.toFixed(0)} ${suffix}`
    },
    split: false
  },
  navigator: {
    xAxis: {
      labels: {
        formatter() {
          return null
        }
      }
    }
  },
  scrollbar: {
    enabled: false
  },
  navigator: {
    enabled: false
  },
  rangeSelector: {
    enabled: false
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      millisecond: '%H:%M:%S',
      second: '%H:%M:%S',
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%m/%d %H:%M'
    }
  },
  yAxis: {
    opposite: false
  }
}

window.chart = {
  stockChart: (id, options) => {
    return Highcharts.stockChart(id, {
      ...defaultOptions,
      ...options
    });
  },
  pieChart: (id, options) => {
    return Highcharts.chart(id, {
      ...defaultOptions,
      ...options
    });
  }
}