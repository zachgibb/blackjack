class window.Round extends Backbone.Model

  initialize: (params) ->
    @set
      round: params.round
      winner: params.winner
    console.log 'Round Initialized'
