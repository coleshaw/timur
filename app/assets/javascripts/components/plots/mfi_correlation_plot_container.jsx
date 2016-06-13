MfiCorrelationPlotContainer = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  componentWillMount: function() {
    var store = this.context.store;
    store.dispatch(
      plotActions.updateRequestedMappings(
        this.props.plot.plot_id, Object.keys(this.props.mfi_default_mappings)
      )
    );
  },
  render: function() {
    var self = this;

    var all_series = [];
    var plot = this.props.plot;
    
    if (plot.results && plot.results.correlation) {
      all_series = plot.results.correlation.series.map(function(series) {
        var series_def = self.props.saves.series[series.key];
        var matrix = new Matrix( series.matrix.rows, series.matrix.row_names, series.matrix.col_names );
        return {
          matrix: matrix,
          name: series_def.name,
          color: series_def.color
        };
      });
    }

    return <div className="plot">
      <PlotHeader mode={ this.state.mode } 
        name="Mfi Correlation"
        plot={ plot }
        newMode={ function(mode) { self.setState({mode: mode}); } }
        onApprove={
          function() {
            if (plot.requested_series.length == 0) {
              alert('You need to select at least one series to plot.');
              return false;
            }

            return true;
          }
        }
        />  
      {
        this.state.mode == 'edit' ?
        <PlotConfig
          plot={plot}
          series_limits={ [ "Series" ] }
          mappings_limits={ [] }
          current_mappings={ [] }
          series={ this.props.saves.series }
          mappings={ {} }
          />
        :
        null
      }
      <MfiCorrelationPlot data_key={ plot.data_key } data={ all_series } plot={{
          width: 3200,
          height: 3200,
          margin: {
            left: 250,
            top: 250,
            bottom: 40,
            right: 250
          }
        }}/>
    </div>;
  },
})

MfiCorrelationPlotContainer.contextTypes = {
  store: React.PropTypes.object
}

module.exports =MfiCorrelationPlotContainer