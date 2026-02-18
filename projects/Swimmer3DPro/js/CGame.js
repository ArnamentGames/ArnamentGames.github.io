function CGame(oData, iModeSelected, iLevel) {
    var _iLevel = iLevel;
    var _iTimeMaxToMove = 200;
    var _iTimeBetweenPress = 0;
    var _iRaceTime = 0;
    var _iPlayerLane = 3;
    var _iModeSelected = iModeSelected;
    var _iNationalitySelected = s_iTeamSelected;
    var _iPlayerPositionArrive = 0;

    var _bCanStart = false;
    var _bUpdate = false;
    var _bLeft = false;
    var _bRight = false;
    var _bSwitchedIndex = false;

    var _oLevelInfos;
    var _oInterface;
    var _oEnergyBar;
    var _oMobileControls;
    var _CVariousHelp = null;
    var _oEndPanel = null;
    var _oParent;

    var _oWater;
    var _oWaterContainer;
    var _oBackgrounds;
    var _oBGContainer;
    var _oShapeKeyListener;
    var _oBar = null;
    var _aSwimmer = new Array();
    var _aSwimmerContainer = new Array();

    var _aSwimmerTeam = [TEAM_0, TEAM_1, TEAM_2, TEAM_3, TEAM_4, TEAM_5, TEAM_6, TEAM_7];
    var _aSwimmerPosition = [{
        x: 245,
        y: 165
    }, {
        x: 329,
        y: 203
    }, {
        x: 407,
        y: 240
    }, {
        x: 487,
        y: 280
    }, {
        x: 568,
        y: 317
    }, {
        x: 650,
        y: 353
    }, {
        x: 730,
        y: 393
    }, {
        x: 813,
        y: 431
    }];
    var _aSwimmerTurnPosition = [{
        x: 1545,
        y: -140
    }, {
        x: 1628,
        y: -102
    }, {
        x: 1712,
        y: -61
    }, {
        x: 1796,
        y: -22
    }, {
        x: 1880,
        y: 22
    }, {
        x: 1949,
        y: 58
    }, {
        x: 2041,
        y: 100
    }, {
        x: 2125,
        y: 122
    }];
    var _aSwimmerArrivalPosition = [{
        x: 267,
        y: 190
    }, {
        x: 352,
        y: 230
    }, {
        x: 435,
        y: 268
    }, {
        x: 520,
        y: 308
    }, {
        x: 605,
        y: 348
    }, {
        x: 689,
        y: 388
    }, {
        x: 773,
        y: 428
    }, {
        x: 858,
        y: 468
    }];
    var _aSwimmerHaveTurned = [false, false, false, false, false, false, false, false];
    var _aSwimmerArrived = new Array();
    var _aSwimmerArrivalOrder = new Array();
    var _aTeamPerLane = new Array();

    this._init = function() {
        $(s_oMain).trigger("start_level", _iLevel);
        playSound("crowd", 0.5, -1);
        setVolume(s_oSoundtrack, 0.2);

        _oWaterContainer = new createjs.Container();
        s_oStage.addChild(_oWaterContainer);

        _oWater = new CWater(_oWaterContainer);

        _oBGContainer = new createjs.Container();
        s_oStage.addChild(_oBGContainer);

        _oBackgrounds = new CScrollingBg(_oBGContainer);
        _oBackgrounds.setEndPositions(_aSwimmerTurnPosition);
        _oBackgrounds.setArrivalPositions(_aSwimmerArrivalPosition);

        var _oValuesToAdd = s_oCityInfos.getValuesToAdd(_iLevel);

        var _oPlayerNationality = _aSwimmerTeam[_iNationalitySelected];
        _aSwimmerTeam[_iNationalitySelected] = null;

        for (var i = 0; i < NUM_SWIMMERS; i++) {
            if (i !== _iPlayerLane) {

                if (_aSwimmerTeam[i] !== null) {
                    _aTeamPerLane.push(_aSwimmerTeam[i]);
                    _aSwimmerTeam[i] = null;
                } else {
                    if (i === NUM_SWIMMERS - 1) {
                        _aTeamPerLane.push(_aSwimmerTeam[_iPlayerLane]);
                        _aSwimmerTeam[_iPlayerLane] = null;
                    } else {
                        _aTeamPerLane.push(_aSwimmerTeam[i + 1]);
                        _aSwimmerTeam[i + 1] = null;
                    }
                }

                var iMaxSpeed = ENEMY_MAX_SPEED[i] + _oValuesToAdd.speed;
                var iMinSpeed = ENEMY_MIN_SPEED[i];
                var iEnergy = ENEMY_ENERGY[i] + _oValuesToAdd.energy;
                var iResistenceStep = ENEMY_RESISTENCE_STEP[i];
                var iOccurrenceSwim = ENEMY_OCCURRENCE_SWIM[i];

                _aSwimmerContainer.push(new createjs.Container());
                s_oStage.addChild(_aSwimmerContainer[i]);

                _aSwimmer.push(new CSwimmer(_aSwimmerPosition[i].x, _aSwimmerPosition[i].y, _aSwimmerContainer[i], i, false, PLAYER_NAME_AND_SPRITE[_aTeamPerLane[_aTeamPerLane.length - 1]], _iModeSelected, iMaxSpeed, iMinSpeed, iEnergy, iResistenceStep, iOccurrenceSwim));
            } else { // THIS IS THE PLAYER
                _aTeamPerLane.push(_oPlayerNationality);

                var iMaxSpeed = PLAYER_MAX_SPEED + s_iSpeedAdder;
                var iMinSpeed = PLAYER_MIN_SPEED;
                var iEnergy = PLAYER_ENERGY + s_iEnergyAdder;
                var iResistenceStep = PLAYER_RESISTENCE_STEP;
                var iOccurrenceSwim = 0;

                _aSwimmerContainer.push(new createjs.Container());
                s_oStage.addChild(_aSwimmerContainer[i]);

                _aSwimmer.push(new CSwimmer(_aSwimmerPosition[i].x, _aSwimmerPosition[i].y, _aSwimmerContainer[i], i, true, PLAYER_NAME_AND_SPRITE[_aTeamPerLane[_aTeamPerLane.length - 1]], _iModeSelected, iMaxSpeed, iMinSpeed, iEnergy, iResistenceStep, iOccurrenceSwim));
            }
        }

        _oInterface = new CInterface();
        _oEnergyBar = new CHealtBar();

        if (!s_bMobile) {
            document.onkeydown = this.onKeyDown;
        } else {
            _oMobileControls = new CMobileControls();
        }

        this.enableMovement();
    };

    this.enableMovement = function() {

        var aPlayerInfos = new Array();
        for (var i = 0; i < NUM_SWIMMERS; i++) {
            aPlayerInfos.push(_aSwimmer[i].getInfos());
        }

        _oLevelInfos = new CShowNationalityInLane(aPlayerInfos);
        _CVariousHelp = new CVariousHelp(TEXT_START_MOVEMENT, WAIT_FOR_GAME_START);
    };

    this.onKeyDown = function(evt) {

        if (_CVariousHelp !== null) {
            _oParent.unloadVariousHelp();
            if (_oLevelInfos) {
                _oLevelInfos.unload();
                _oLevelInfos = null;
            }
            _bCanStart = true;
            _oInterface.setGUIClickable();
        }

        if (!_bCanStart) {
            return;
        }

        if (!evt) {
            evt = window.event;
        }

        if (evt.keyCode === LEFT_DIR && _oBar === null) { //left
            _bLeft = true;
            if (!_bUpdate) {
                _oParent.startGame();
                _bUpdate = true;
            }
        } else if (evt.keyCode === RIGHT_DIR && _oBar === null) { //right
            _bRight = true;
            if (!_bUpdate) {
                _oParent.startGame();
                _bUpdate = true;
            }
        } else if (evt.keyCode === SPACEBAR && _oBar !== null) { //right
            _oParent.turnPlayer();
        }

        if (_bLeft && _bRight) {
            _aSwimmer[_iPlayerLane].addSpeed();
            _bLeft = false;
            _bRight = true;
        } else {
            _aSwimmer[_iPlayerLane].decreaseSpeed();
        }

        evt.preventDefault();
        return false;
    };

    this.onButtonDown = function(iButtonPressed) {

        if (_CVariousHelp !== null) {
            _oParent.unloadVariousHelp();
            _oLevelInfos.unload();
            _oLevelInfos = null;
            _bCanStart = true;
            _oInterface.setGUIClickable();
        }

        if (!_bCanStart) {
            return;
        }

        if (iButtonPressed === LEFT_DIR) { //left
            _bLeft = true;
            if (!_bUpdate) {
                _oParent.startGame();
                _bUpdate = true;
            }
        } else if (iButtonPressed === RIGHT_DIR) { //right
            _bRight = true;
            if (!_bUpdate) {
                _oParent.startGame();
                _bUpdate = true;
            }
        }

        if (_bLeft && _bRight) {
            _aSwimmer[_iPlayerLane].addSpeed();
            _bLeft = false;
            _bRight = true;
        } else {
            _aSwimmer[_iPlayerLane].decreaseSpeed();
        }

    };

    this.startGame = function() {
        for (var i = 0; i < NUM_SWIMMERS; i++) {
            _aSwimmer[i].playAnimation();
        }
    };

    this.halfAnimationDive = function() {
        if (_bSwitchedIndex) {
            return;
        }
        playSound("dive", 0.5, 0);
        s_oStage.setChildIndex(_oWaterContainer, 0);

        for (var i = 1; i <= NUM_SWIMMERS; i++) {
            s_oStage.setChildIndex(_aSwimmerContainer[i - 1], i);
        }

        s_oStage.setChildIndex(_oBackgrounds, i);
        _bSwitchedIndex = true;

    };

    this.spawnBar = function() {
        _bUpdate = false;
        var iRange = BARY / RANGE_HEIGHT;
        _oBar = new CIndicatorController(iRange);
        _oBar.scaleBar(0.5);
        _oBar.startAnimation();

        _oShapeKeyListener = new createjs.Shape();
        _oShapeKeyListener.graphics.beginFill("Black").drawRect(0, 160, CANVAS_WIDTH, CANVAS_HEIGHT - 160);
        _oShapeKeyListener.alpha = 0.01;
        s_oStage.addChild(_oShapeKeyListener);
        if (s_bMobile) {
            _oMobileControls.spawnButtonForBar();
        }

        for (var i = 0; i < NUM_SWIMMERS; i++) {
            _aSwimmer[i].stopAnimation();
        }
    };

    this.turnPlayer = function() {
        _oBar.endAnimation();
        var iPositionInBar = _oBar.getPosition();
        if (!_aSwimmerHaveTurned[_iPlayerLane]) {
            _aSwimmer[_iPlayerLane].showAnimationTurn(iPositionInBar);
        } else {
            _aSwimmer[_iPlayerLane].showFrontAnimationTurn(iPositionInBar);
        }
        _bUpdate = true;

        if (!s_bMobile) {
            _oShapeKeyListener.off("mousedown", this.handleClick, this);
            _oBar.unload();
            s_oStage.removeChild(_oShapeKeyListener);
        } else {
            _oMobileControls.hideButtonForBar();
            _oBar.unload();
        }

        for (var i = 0; i < NUM_SWIMMERS; i++) {
            _aSwimmer[i].playAnimation();
        }
        _oBar = null;
    };

    this.moveSwimmersWithBG = function(iPlayerSpeed) {
        var iPlayerDirection = _oBackgrounds.getDirectionVector();
        _oBackgrounds.move(iPlayerSpeed); //player selected movement
        _oWater.move(iPlayerSpeed);

        for (var i = 0; i < NUM_SWIMMERS; i++) {
            _aSwimmer[i].movementAffectedByPlayer(iPlayerSpeed, iPlayerDirection);
            _aSwimmer[i].update();
        }
    };

    this.moveEnemies = function() {
        for (var i = 0; i < NUM_SWIMMERS; i++) {
            if (i !== _iPlayerLane) {
                var iRand = Math.random();
                if (iRand < _aSwimmer[i].getOccurrenceSwim() * _aSwimmer[i].getEnergyProportion()) {
                    _aSwimmer[i].addSpeed();
                } else {
                    _aSwimmer[i].decreaseSpeed();
                }
                _aSwimmer[i].move();
            }
            _aSwimmer[i].increaseEnergy();
        }
    };

    this.checkIfIsElapsedTooMuchTimeBetweenPress = function() {
        if (_bLeft || _bRight) {
            _iTimeBetweenPress += s_iTimeElaps;
            if (_iTimeBetweenPress > _iTimeMaxToMove) {
                _iTimeBetweenPress = 0;
                _bLeft = false;
                _bRight = false;
            }
        } else {
            _aSwimmer[_iPlayerLane].decreaseSpeed();
        }
    };

    this.checkDistanceFromArrivalPoint = function() {
        for (var i = 0; i < NUM_SWIMMERS; i++) {
            if (!_aSwimmerHaveTurned[i]) {
                _aSwimmer[i].checkDistance(_oBackgrounds.getEndPositions(i));
            } else {
                _aSwimmer[i].checkDistance(_oBackgrounds.getArrivalPositions(i));
            }
        }
    };

    this.addInArrayPlayerArrived = function(iLane, szName) {
        _aSwimmerArrived.push({
            lane: iLane,
            name: szName,
            time: formatTime(_iRaceTime)
        });
        if (_aSwimmerArrived.length === 1) {
            playSound("crowd_cheers", 0.5, 0);
        }
        var aSwimmerArrivedLength = _aSwimmerArrived.length - 1;
        _aSwimmerArrivalOrder.push({
            player: _aTeamPerLane[iLane],
            position: aSwimmerArrivedLength
        });

        _oInterface.addArrivalPanel(_aSwimmerArrived[aSwimmerArrivedLength]);
        if (iLane === _iPlayerLane && aSwimmerArrivedLength + 1 <= 3) {
            _iPlayerPositionArrive = aSwimmerArrivedLength;
            s_oCityInfos.setRewardTaken(_iLevel, _iPlayerPositionArrive);
        } else if (iLane === _iPlayerLane) {
            _iPlayerPositionArrive = aSwimmerArrivedLength;
        }

        if (iLane === _iPlayerLane && s_oCityInfos.getTimeSpent(_iLevel) !== null) {
            if (s_oCityInfos.getTimeSpent(_iLevel) > _iRaceTime) {
                s_oCityInfos.setTimeSpent(_iLevel, _iRaceTime);
            }
        } else if (iLane === _iPlayerLane) {
            s_oCityInfos.setTimeSpent(_iLevel, _iRaceTime);
        }

        if (_aSwimmerArrived.length === NUM_SWIMMERS) {

            for (var i = 0; i < _aSwimmerArrivalOrder.length; i++) {}
            s_oCityInfos.setPlayersArrivals(_iLevel, _aSwimmerArrivalOrder);
            setTimeout(this.gameOver(), 1000);
        }
    };

    this.haveTurned = function(iLane) {
        _aSwimmerHaveTurned[iLane] = !_aSwimmerHaveTurned[iLane];
    };

    this.changeBGsDirection = function() {
        _oBackgrounds.changeDir();
        _oWater.changeDir();
    };

    this.unloadVariousHelp = function(iHelpType) {
        _CVariousHelp.unload();
        _CVariousHelp = null;
        if (iHelpType === CONFIRMATION_ON_EXIT) {
            _bCanStart = true;
            if (!_oBar) {
                _bUpdate = true;

                for (var i = 0; i < NUM_SWIMMERS; i++) {
                    _aSwimmer[i].playAnimation();
                }
            }
        }
        if (_oLevelInfos) {
            _oLevelInfos.unload();
            _oLevelInfos = null;
        }
        _oInterface.setGUIClickable();
    };

    this.unload = function() {
        _oInterface.unload();

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    this.onInfo = function() {
        _CVariousHelp = new CVariousHelp(TEXT_START_MOVEMENT, WAIT_FOR_GAME_START);
        _bUpdate = false;
        for (var i = 0; i < NUM_SWIMMERS; i++) {
            _aSwimmer[i].stopAnimation();
        }
    };

    this.onInfoExit = function() {
        _CVariousHelp.unload();
        _CVariousHelp = null;
        if (_bCanStart) {
            _bUpdate = true;

            for (var i = 0; i < NUM_SWIMMERS; i++) {
                _aSwimmer[i].playAnimation();
            }
        }
    };

    this.onExitMessage = function() {
        if (_CVariousHelp === null) {
            _CVariousHelp = new CVariousHelp(TEXT_ON_EXIT, CONFIRMATION_ON_EXIT);
            _bUpdate = false;
            _bCanStart = false;
            for (var i = 0; i < NUM_SWIMMERS; i++) {
                _aSwimmer[i].stopAnimation();
            }
        }
    };

    this.onExit = function() {
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");

        this.unload();
        s_oMain.gotoMenu();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            s_oSoundtrack.volume = 1;
        }
        $(s_oMain).trigger("restart");
    };

    this.onContinue = function() {
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");

        this.unload();
        s_oMain.gotoPlayerProgress();
    };

    this.gameOver = function() {
        if (_iPlayerPositionArrive < 3) {
            if (s_iLevelReached < _iLevel + 2) {
                s_iLevelReached = _iLevel + 2;
            }
        }
        playSound("applauses", 0.5, 0);
        setTimeout(function() {
            if (_oMobileControls) {
                _oMobileControls.hideButtons();
            }
            _oInterface.unloadArrivalPanel();
            _bUpdate = false;
            _bCanStart = false;
        }, 500);
        if (_iLevel < s_oCityInfos.getNumLevels() - 1) {
            _oEndPanel = CEndPanel(_aSwimmerArrived, _iLevel);
            _oEndPanel.show();
        } else {
            _oEndPanel = new CPodiumScreen(_iLevel);
            _oEndPanel.show();
        }
    };

    this.update = function() {
        if (_bUpdate) {
            var iPlayerSpeed = _aSwimmer[_iPlayerLane].getSpeed();

            _iRaceTime += s_iTimeElaps;
            _oInterface.refreshTime(formatTime(_iRaceTime));

            if (!s_bMobile || s_bIsIphone) {
                _oWater.update();
            }

            this.moveSwimmersWithBG(iPlayerSpeed);

            this.moveEnemies();

            _oEnergyBar.refreshMask(_aSwimmer[_iPlayerLane].getEnergy());

            this.checkIfIsElapsedTooMuchTimeBetweenPress();

            this.checkDistanceFromArrivalPoint();
        }

    };


    SHOT_INDICATOR_SPEED = oData.shot_indicator_spd;
    NUM_ROUNDS = oData.num_rounds;
    PLAYER_MAX_SPEED = oData.player_max_speed;
    PLAYER_MIN_SPEED = oData.player_min_speed;
    PLAYER_ENERGY = oData.player_energy;
    PLAYER_RESISTENCE_STEP = oData.player_resistence_step;
    PLAYER_MAX_SPEED_ADDER = oData.player_max_speed_adder;
    PLAYER_ENERGY_ADDER = oData.player_energy_adder;
    PLAYER_NAME_AND_SPRITE = [{
            name: TEXT_TEAM_0,
            sprite: 0
        }, {
            name: TEXT_TEAM_1,
            sprite: 1
        },
        {
            name: TEXT_TEAM_2,
            sprite: 2
        }, {
            name: TEXT_TEAM_3,
            sprite: 3
        },
        {
            name: TEXT_TEAM_4,
            sprite: 4
        }, {
            name: TEXT_TEAM_5,
            sprite: 5
        },
        {
            name: TEXT_TEAM_6,
            sprite: 6
        }, {
            name: TEXT_TEAM_7,
            sprite: 7
        }
    ];

    s_oGame = this;

    _oParent = this;
    this._init();
}

var s_oGame;