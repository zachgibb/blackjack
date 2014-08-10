// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.template = _.template('<div class="buttons"> <button class="hit-button">Hit</button> <button class="stand-button">Stand</button> <button class="deck-button">New Deck</button> </div> <div class="player-hand-container"></div> <div class="dealer-hand-container"></div> <div class="history-container"></div>');

    AppView.prototype.events = {
      "click .hit-button": function() {
        this.model.get('playerHand').hit();
        if (this.model.get('playerHand').scores() > 21) {
          this.model.get('dealerHand').at(0).flip();
          return this._alert('you lost!');
        } else if (this.model.get('dealerHand').hiddenScores() < 17) {
          return this.model.get('dealerHand').hit();
        }
      },
      "click .stand-button": function() {
        var dealer, dealerScore, dealerUnder, player, playerScore, playerUnder;
        dealer = this.model.get('dealerHand');
        player = this.model.get('playerHand');
        while (dealer.hiddenScores() < 17) {
          dealer.hit();
        }
        dealer.at(0).flip();
        dealerScore = dealer.scores();
        dealerUnder = dealerScore <= 21;
        playerScore = player.scores();
        playerUnder = playerScore <= 21;
        if (playerUnder) {
          if (dealerUnder) {
            if (dealerScore > playerScore) {
              return this._alert('you lost!');
            } else if (dealerScore === playerScore) {
              return this._alert('push');
            } else {
              return this._alert('you won!');
            }
          } else {
            return this._alert('you won!');
          }
        } else {
          return this._alert('you lost!');
        }
      },
      "click .deck-button": function() {
        var deck;
        this.model.set('deck', deck = new Deck());
        this.model.set('playerHand', deck.dealPlayer());
        this.model.set('dealerHand', deck.dealDealer());
        return this.render();
      }
    };

    AppView.prototype._alert = function(text) {
      return setTimeout((function(_this) {
        return function() {
          alert(text);
          return _this._newHand(text === 'you won!' ? 'Player' : text === 'push' ? 'PUSH' : 'Dealer');
        };
      })(this), 50);
    };

    AppView.prototype._round = 1;

    AppView.prototype._newHand = function(winner) {
      this.model.set('playerHand', this.model.get('deck').dealPlayer());
      this.model.set('dealerHand', this.model.get('deck').dealDealer());
      this.model.get('history').add(new Round({
        round: this._round,
        winner: winner
      }));
      this._round++;
      return this.render();
    };

    AppView.prototype.initialize = function() {
      return this.render();
    };

    AppView.prototype.render = function() {
      this.$el.children().detach();
      this.$el.html(this.template());
      this.$('.player-hand-container').html(new HandView({
        collection: this.model.get('playerHand')
      }).el);
      this.$('.dealer-hand-container').html(new HandView({
        collection: this.model.get('dealerHand')
      }).el);
      return this.$('.history-container').html(new HistoryView({
        collection: this.model.get('history')
      }).el);
    };

    return AppView;

  })(Backbone.View);

}).call(this);
