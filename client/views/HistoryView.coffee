class window.HistoryView extends Backbone.View

  className: 'history'

  #todo: switch to mustache
  template: _.template '<h2>History</h2><ul></ul>'

  initialize: ->
    @collection.on 'add remove change', => 
      @render()
    @render()

  render: ->
    @$el.children().detach()
    @$el.html @template @collection
    @$('ul').append @collection.map (round) -> new RoundView(model: round).$el
    

