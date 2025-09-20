function CEndPanel(aInfos, iLevel) {

    var _iLevel = iLevel;
    var _iScore = 0;
    var _iPlayerSwimmer;

    var _oScoreMode;
    var _oScoreModePos = {
        x: CANVAS_WIDTH / 2 - 180,
        y: CANVAS_HEIGHT / 2 - 163
    };
    var _oScoreText;
    var _oScoreTextPos = {
        x: CANVAS_WIDTH / 2 - 180,
        y: CANVAS_HEIGHT / 2 - 134
    };

    var _oBg;
    var _oGroup;
    var _oButRestart;
    var _oButRestartPos;

    var _aInfos = aInfos;
    var _aPlayersArrivals = s_oCityInfos.getPlayersArrivals();
    var _aSwimmersInLane = new Array();
    var _aPlacePoints = [100, 50, 25, 10, 9, 8, 7, 6];

    this._init = function() {

        var oSprite = s_oSpriteLibrary.getSprite('result_panel');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH / 2;
        _oBg.y = CANVAS_HEIGHT / 2;
        _oBg.regX = oSprite.width / 2;
        _oBg.regY = oSprite.height / 2;
        s_oStage.addChild(_oBg);

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible = false;

        _oGroup.addChild(_oBg);

        _oScoreMode = new createjs.Text("MEN'S " + ((s_iModeSelected) * 100) + "M FREESTYLE", " 20px " + FONT, "#ffffff");
        _oScoreMode.x = _oScoreModePos.x;
        _oScoreMode.y = _oScoreModePos.y;
        _oScoreMode.textAlign = "left";
        _oScoreMode.textBaseline = "alphabetic";
        _oGroup.addChild(_oScoreMode);

        _oScoreText = new createjs.Text("Result", " 22px " + FONT, "#ffffff");
        _oScoreText.x = _oScoreTextPos.x;
        _oScoreText.y = _oScoreTextPos.y;
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oGroup.addChild(_oScoreText);

        s_oStage.addChild(_oGroup);
        var oSprite = s_oSpriteLibrary.getSprite('but_continue_small');
        _oButRestartPos = {
            x: (CANVAS_WIDTH / 2 + 340),
            y: CANVAS_HEIGHT - 178
        };
        _oButRestart = new CGfxButton(_oButRestartPos.x, _oButRestartPos.y, oSprite);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onContinue, this);

        this.getSwimmerInLane();
        this.addScoreToPlayers();
    };

    this.show = function() {

        var iX = 460;
        var iY = 207;
        for (var i = 0; i < _aPlayersArrivals[_iLevel].length; i++) {
            var oSprite = createBitmap(s_oSpriteLibrary.getSprite("flag_swimmer_" + _aPlayersArrivals[_iLevel][i].player + "_game"));
            oSprite.x = iX;
            oSprite.y = iY;
            oSprite.scaleX = oSprite.scaleY = 0.3;
            _oGroup.addChild(oSprite);

            iX += 110;
            iY += 17;

            var oTeamText = new createjs.Text(_aInfos[i].name, " 20px " + FONT, "#ffffff");
            oTeamText.x = iX;
            oTeamText.y = iY;
            oTeamText.textAlign = "left";
            oTeamText.textBaseline = "alphabetic";
            _oGroup.addChild(oTeamText);

            iX += 305;

            var oTimeText = new createjs.Text(_aInfos[i].time, " 20px " + FONT, "#ffffff");
            oTimeText.x = iX;
            oTimeText.y = iY;
            oTimeText.textAlign = "left";
            oTimeText.textBaseline = "alphabetic";
            _oGroup.addChild(oTimeText);

            iX = 460;
            iY += 21;
        }

        _oGroup.visible = true;

        createjs.Tween.get(_oGroup).to({
            alpha: 1
        }, 500).call(function() {});

        $(s_oMain).trigger("share_event", _iScore);
        $(s_oMain).trigger("save_score", [_iScore]);

        //LOCAL STORAGE        
        localStorage.setItem("SPro_Mode", s_iMode);
        localStorage.setItem("SPro_LevelReached", s_iLevelReached);
        localStorage.setItem("SPro_ModeSelected", s_iModeSelected);
        localStorage.setItem("SPro_Money", s_iPlayerMoney);
        localStorage.setItem("SPro_SpeedBought", s_iSpeedBought);
        localStorage.setItem("SPro_EnergyBought", s_iEnergyBought);
        localStorage.setItem("SPro_SpeedAdder", s_iSpeedAdder);
        localStorage.setItem("SPro_EnergyAdder", s_iEnergyAdder);
        localStorage.setItem("SPro_TeamSelected", s_iTeamSelected);
        localStorage.setItem("SPro_TeamSelectedSprite", s_szTeamSelectedSprite);
        localStorage.setItem("SPro_Scores", JSON.stringify(s_aSwimmersScore));

        s_oCityInfos.addCitiesStorage();
    };

    this.getSwimmerInLane = function() {
        for (var i = 0; i < _aPlayersArrivals[0].length; i++) {
            _aSwimmersInLane.push(PLAYER_NAME_AND_SPRITE[_aPlayersArrivals[_iLevel][i].player].sprite);
            if (_aSwimmersInLane[i] === s_iTeamSelected) {
                _iPlayerSwimmer = i;
            }
        }
    };

    this.addScoreToPlayers = function() {

        for (var j = 0; j < _aPlayersArrivals[_iLevel].length; j++) {
            s_aSwimmersScore[_aPlayersArrivals[_iLevel][j].player] += _aPlacePoints[_aPlayersArrivals[_iLevel][j].position];
        }

        _iScore = s_aSwimmersScore[_aPlayersArrivals[_iLevel][_iPlayerSwimmer].player];
    };

    this._onContinue = function() {
        playSound("click", 0.5, 0);
        s_oStage.removeChild(_oGroup);
        _oButRestart.unload();

        s_oGame.onContinue();
    };

    this._init();

    return this;
}