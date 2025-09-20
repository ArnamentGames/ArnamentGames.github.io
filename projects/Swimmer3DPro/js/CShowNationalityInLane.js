function CShowNationalityInLane(aSwimmersInfo) {

    var _aSwimmersInfo = aSwimmersInfo;

    var _oContainer;

    var _aSwimmerNationalityPos = [{
        x: 90,
        y: 190
    }, {
        x: 170,
        y: 227
    }, {
        x: 250,
        y: 265
    }, {
        x: 330,
        y: 303
    }, {
        x: 410,
        y: 340
    }, {
        x: 490,
        y: 378
    }, {
        x: 575,
        y: 418
    }, {
        x: 665,
        y: 460
    }];
    var _oSwimmerNationality;

    this._init = function() {

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        for (var i = 0; i < _aSwimmersInfo.length; i++) {

            var oSprite = s_oSpriteLibrary.getSprite("flag_swimmer_" + _aSwimmersInfo[i].sprite + "_game")
            _oSwimmerNationality = createBitmap(oSprite);
            _oSwimmerNationality.x = _aSwimmerNationalityPos[i].x;
            _oSwimmerNationality.y = _aSwimmerNationalityPos[i].y;
            _oSwimmerNationality.skewX = -60;
            _oSwimmerNationality.rotation = -14;
            _oContainer.addChild(_oSwimmerNationality);

        }
    };

    this._onButNextRelease = function() {
        s_oGame.enableMovement();
        this.unload();
    };

    this.unload = function() {
        createjs.Tween.get(_oContainer).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(_oContainer);
        });
    };

    s_oShowLevelInfos = this;

    this._init();
}

var s_oShowLevelInfos = null;