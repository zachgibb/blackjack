class window.RoundView extends Backbone.View

  className: "round"
  tagName: "li"
  template: _.template '<b><%= round %></b> <%= winner %>'

  initialize: ->
    @model.on 'change', => @render
    @render()

  render: ->
    @$el.children().detach().end().html
    @$el.html @template @model.attributes