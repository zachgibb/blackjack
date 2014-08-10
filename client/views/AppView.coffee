class window.AppView extends Backbone.View

  template: _.template '
    <div class="buttons">
      <button class="hit-button">Hit</button>
      <button class="stand-button">Stand</button>
      <button class="deck-button">New Deck</button>
    </div>
    <div class="player-hand-container"></div>
    <div class="dealer-hand-container"></div>
    <div class="history-container"></div>
  '

  events:
    "click .hit-button": -> 

      @model.get('playerHand').hit()
      if @model.get('playerHand').scores() > 21
        @model.get('dealerHand').at(0).flip()
        @_alert('you lost!')

      else if @model.get('dealerHand').hiddenScores() < 17 then @model.get('dealerHand').hit()
    
    "click .stand-button": -> 
      dealer = @model.get('dealerHand')
      player = @model.get('playerHand')

      dealer.hit() while dealer.hiddenScores() < 17
      dealer.at(0).flip()

      dealerScore = dealer.scores()
      dealerUnder = dealerScore <= 21

      playerScore = player.scores()
      playerUnder = playerScore <= 21

      if playerUnder 
        if dealerUnder
          if dealerScore > playerScore
            @_alert('you lost!') 
          else if dealerScore is playerScore
            @_alert('push') 
          else @_alert('you won!')
        else @_alert('you won!')
      else @_alert('you lost!')

    "click .deck-button": -> 
      @model.set 'deck', deck = new Deck()
      @model.set 'playerHand', deck.dealPlayer()
      @model.set 'dealerHand', deck.dealDealer()
      @render()

  _alert: (text)->
    setTimeout => 
      alert text 
      @_newHand if text is 'you won!' 
        'Player' 
      else if text is 'push' 
        'PUSH'
      else
        'Dealer'
    , 50
  _round: 1
  _newHand: (winner)-> 
    @model.set 'playerHand', @model.get('deck').dealPlayer()
    @model.set 'dealerHand', @model.get('deck').dealDealer()
    @model.get('history').add(new Round({round: @_round, winner:winner}))
    @_round++
    @render()

  initialize: ->
    @render()

  render: ->
    @$el.children().detach()
    @$el.html @template()
    @$('.player-hand-container').html new HandView(collection: @model.get 'playerHand').el
    @$('.dealer-hand-container').html new HandView(collection: @model.get 'dealerHand').el
    @$('.history-container').html new HistoryView(collection: @model.get 'history').el
    
