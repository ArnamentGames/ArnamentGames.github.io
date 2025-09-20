function CSwimmer(iX, iY, oParentContainer, iLane, bIsPlayer, oTeamInfos, iModeSelected, iMaxSpeed, iMinSpeed, iEnergy, iResistenceStep, iOccurrenceSwim) {
    var _iSpeed = 0;
    var _iSpeedApp = 0;
    var _iCurrentAnimation = 0; //0: dive, 1: swimming, 2: turn
    var _iPlayerDiveFrames;
    var _iPlayerTurnFrames;
    var _iLane = iLane;
    var _iModeSelected = iModeSelected;
    var _iRounds = (NUM_ROUNDS * _iModeSelected);
    var _iMaxSpeed = iMaxSpeed;
    var _iMinSpeed = iMinSpeed;
    var _iEnergy = iEnergy;
    var _iMaxEnergy = _iEnergy;
    var _iResistenceStep = iResistenceStep;
    var _iOccurrenceSwim = iOccurrenceSwim;

    var _szTeamName = oTeamInfos.name;
    var _iNationalitySprite = oTeamInfos.sprite;

    var _oPlayerSpriteUsed;
    var _oPlayerDive;
    var _oWaterOnDive;
    var _oPlayerSwimming;
    var _oPlayerTurn;
    var _oPlayerFrontSwimming;
    var _oPlayerFrontTurn;
    var _oPlayerIdle;
    var _oRope;
    var _oCursor;

    var _bIsPlayer = bIsPlayer;
    var _bHaveTurned = false;
    var _bTurning = false;
    var _bCanMove = true;
    var _bOverHalfTurnFrames = false;
    var _bPlayerIsInIdle = false;
    var _bPlayerArrived = false;
    var _bOverHalfAnimationDive = false;

    var _vDirection = new CVector2(0, 1);
    var _vPlayerPos = new CVector2();

    var _oContainer = oParentContainer;

    this._init = function() {
        switch (_iLane) {
            case 0:
                this.createSwimmer(s_oSpriteLibrary.getSprite("green_rope"));
                break;
            case 1:
                this.createSwimmer(s_oSpriteLibrary.getSprite("blue_rope"));
                break;
            case 2:
                this.createSwimmer(s_oSpriteLibrary.getSprite("yellow_rope"));
                break;
            case 3:
                this.createSwimmer(s_oSpriteLibrary.getSprite("yellow_rope"));
                break;
            case 4:
                this.createSwimmer(s_oSpriteLibrary.getSprite("yellow_rope"));
                break;
            case 5:
                this.createSwimmer(s_oSpriteLibrary.getSprite("blue_rope"));
                break;
            case 6:
                this.createSwimmer(s_oSpriteLibrary.getSprite("green_rope"));
                break;
            case 7:
                this.createSwimmer(s_oSpriteLibrary.getSprite("edge"));
                break;
        }
    };

    this.createSwimmer = function(oSpriteRope) {
        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_dive");

        var oData = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_DIVE_WIDTH,
                height: PLAYER_DIVE_HEIGHT,
                regX: PLAYER_DIVE_WIDTH / 2,
                regY: PLAYER_DIVE_HEIGHT / 2
            },
            animations: {
                idle: [0, 18, "last_frame"],
                last_frame: [18]
            }
        };
        _oPlayerDive = new createjs.SpriteSheet(oData);
        _iPlayerDiveFrames = _oPlayerDive.getNumFrames("idle");

        var oWaterOnDiveSprite = s_oSpriteLibrary.getSprite("splash_sprite");

        var oData = {
            images: [oWaterOnDiveSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: WATER_DIVE_WIDTH,
                height: WATER_DIVE_HEIGHT,
                regX: WATER_DIVE_WIDTH / 2,
                regY: WATER_DIVE_HEIGHT / 2
            },
            animations: {
                idle: [0, 9, "last_frame"],
                last_frame: [10]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oWaterOnDive = createSprite(oSpriteSheet, "idle", 0, 0, WATER_DIVE_WIDTH, WATER_DIVE_HEIGHT);
        _oWaterOnDive.x = iX;
        _oWaterOnDive.y = iY;
        _oWaterOnDive.currentAnimationFrame = 0;
        _oWaterOnDive.visible = false;
        _oWaterOnDive.stop();
        _oContainer.addChild(_oWaterOnDive);

        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_swimming_back");

        var oDataSwimming = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_SWIMMING_WIDTH,
                height: PLAYER_SWIMMING_HEIGHT,
                regX: PLAYER_SWIMMING_WIDTH / 2,
                regY: PLAYER_SWIMMING_HEIGHT / 2
            },
            animations: {
                swim: [0, 14, "swim"]
            }
        };
        _oPlayerSwimming = new createjs.SpriteSheet(oDataSwimming);

        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_swimming_front");

        var oDataFrontSwimming = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_SWIMMING_FRONT_WIDTH,
                height: PLAYER_SWIMMING_FRONT_HEIGHT,
                regX: PLAYER_SWIMMING_FRONT_WIDTH / 2,
                regY: PLAYER_SWIMMING_FRONT_HEIGHT / 2 + 2
            },
            animations: {
                swim: [0, 14, "swim"]
            }
        };
        _oPlayerFrontSwimming = new createjs.SpriteSheet(oDataFrontSwimming);

        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_turn_back");

        var oDataTurn = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_TURN_WIDTH,
                height: PLAYER_TURN_HEIGHT,
                regX: PLAYER_TURN_WIDTH / 2,
                regY: PLAYER_TURN_HEIGHT / 2
            },
            animations: {
                turn: [0, 14, "turn"]
            }
        };
        _oPlayerTurn = new createjs.SpriteSheet(oDataTurn);
        _iPlayerTurnFrames = _oPlayerTurn.getNumFrames("turn");

        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_turn_front");

        var oDataFrontTurn = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_TURN_WIDTH,
                height: PLAYER_TURN_HEIGHT,
                regX: PLAYER_TURN_WIDTH / 2,
                regY: PLAYER_TURN_HEIGHT / 2
            },
            animations: {
                turn: [0, 14, "turn"]
            }
        };
        _oPlayerFrontTurn = new createjs.SpriteSheet(oDataFrontTurn);

        var oPlayerSprite = s_oSpriteLibrary.getSprite("swimmer_" + _iNationalitySprite + "_idle");

        var oDataIdle = {
            images: [oPlayerSprite],
            framerate: 15,
            // width, height & registration point of each sprite
            frames: {
                width: PLAYER_IDLE_WIDTH,
                height: PLAYER_IDLE_HEIGHT,
                regX: PLAYER_IDLE_WIDTH / 2,
                regY: PLAYER_IDLE_HEIGHT / 3
            },
            animations: {
                idle: [0, 12, "idle"]
            }
        };
        _oPlayerIdle = new createjs.SpriteSheet(oDataIdle);

        _oPlayerSpriteUsed = new createjs.Sprite(_oPlayerDive, "idle");
        _oPlayerSpriteUsed.x = iX;
        _oPlayerSpriteUsed.y = iY;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        _oContainer.addChild(_oPlayerSpriteUsed);

        if (iLane !== NUM_SWIMMERS - 1) {
            _oRope = createBitmap(oSpriteRope);
            _oRope.x = _oPlayerSpriteUsed.x + 80;
            _oRope.y = _oPlayerSpriteUsed.y + 45;
            _oRope.rotation = -14;
            _oContainer.addChild(_oRope);
        }

        _iCurrentAnimation = DIVE_ANIMATION;
        _oPlayerSpriteUsed.stop();
        var iAngle = (104) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);

    };

    this.stopAnimation = function() {
        _oPlayerSpriteUsed.stop();
    };

    this.playAnimation = function() {
        _oPlayerSpriteUsed.play();
    };

    this.checkDistance = function(vPositionToCheck) {
        if (_bTurning) {
            return;
        }
        var iDistance = this.distance2(_vPlayerPos, vPositionToCheck) / 100;
        if (iDistance < 10 && _iCurrentAnimation === SWIMMING_ANIMATION && !_bHaveTurned) {
            if (!_bIsPlayer) {
                this.showAnimationTurn(Math.floor(Math.random() * 4));
            } else {
                s_oGame.spawnBar();
                this.stopAnimation();
            }
        }
        if (iDistance < 10 && _iCurrentAnimation === SWIMMING_FRONT_ANIMATION) {
            if (_iRounds > 1) {
                if (!_bIsPlayer) {
                    this.showFrontAnimationTurn(Math.floor(Math.random() * 4));
                } else {
                    s_oGame.spawnBar();
                    this.stopAnimation();
                    _bTurning = true;
                }
                _iRounds--;
            } else {
                if (_bCanMove) {
                    _bCanMove = false;
                    s_oGame.addInArrayPlayerArrived(_iLane, _szTeamName);
                }
                _iSpeed = 0;
            }
        }
    };

    this.showIdleAnimation = function() {
        if (_oCursor) {
            createjs.Tween.get(_oCursor).to({
                alpha: 0
            }, 500).call(function() {});
        }
        _oPlayerSpriteUsed.spriteSheet = _oPlayerIdle;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        _iCurrentAnimation = SWIMMING_ANIMATION;
        _oPlayerSpriteUsed.gotoAndPlay("idle");
    };

    this.showSwimmingAnimation = function() {
        setTimeout(function() {
            _bHaveTurned = false;
        }, 500);
        _oPlayerSpriteUsed.spriteSheet = _oPlayerSwimming;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        if (_iCurrentAnimation === DIVE_ANIMATION) {
            _oPlayerSpriteUsed.x += 10;
            _oPlayerSpriteUsed.y += 30;
            if (_bIsPlayer) {
                _oCursor = createBitmap(s_oSpriteLibrary.getSprite("arrow_bar"));
                _oCursor.x = _oPlayerSpriteUsed.x;
                _oCursor.y = _oPlayerSpriteUsed.y - 55;
                _oCursor.scaleX = 0.4;
                _oCursor.scaleY = 0.4;
                _oCursor.alpha = 0;
                s_oStage.addChild(_oCursor);
                this.cursorAnimationDown();
            }
        }
        if (_oCursor) {
            _oCursor.x = _oPlayerSpriteUsed.x + 20;
            createjs.Tween.get(_oCursor).to({
                alpha: 1
            }, 500).call(function() {});
        }
        if (_iCurrentAnimation === TURN_FRONT_ANIMATION) {
            _oPlayerSpriteUsed.y -= 10;
        }
        _iCurrentAnimation = SWIMMING_ANIMATION;
        _oPlayerSpriteUsed.gotoAndPlay("swim");
        if (_bIsPlayer) {
            _vPlayerPos.set(_oPlayerSpriteUsed.x, _oPlayerSpriteUsed.y);
        }
    };

    this.cursorAnimationDown = function() {
        createjs.Tween.get(_oCursor).to({
            y: _oCursor.y + 10
        }, 500).call(function() {
            _oParent.cursorAnimationUp();
        });
    };

    this.cursorAnimationUp = function() {
        createjs.Tween.get(_oCursor).to({
            y: _oCursor.y - 10
        }, 500).call(function() {
            _oParent.cursorAnimationDown();
        });
    };

    this.showFrontSwimmingAnimation = function() {
        _oPlayerSpriteUsed.spriteSheet = _oPlayerFrontSwimming;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        _iCurrentAnimation = SWIMMING_FRONT_ANIMATION;
        _oPlayerSpriteUsed.gotoAndPlay("swim");

        if (_oCursor) {
            _oCursor.x = _oPlayerSpriteUsed.x - 30;
            createjs.Tween.get(_oCursor).to({
                alpha: 1
            }, 500).call(function() {});
        }
    };

    this.showAnimationTurn = function(iPositionInBar) {
        if (_oCursor) {
            createjs.Tween.get(_oCursor).to({
                alpha: 0
            }, 500).call(function() {});
        }
        _bHaveTurned = true;
        _bTurning = true;
        _bOverHalfTurnFrames = false;
        if (_iCurrentAnimation === SWIMMING_ANIMATION) {
            _oPlayerSpriteUsed.y += 10;
        }
        _iCurrentAnimation = TURN_ANIMATION;
        _oPlayerSpriteUsed.spriteSheet = _oPlayerTurn;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        _oPlayerSpriteUsed.gotoAndPlay("turn");
        switch (iPositionInBar) {
            case 0:
            case 4:
                _oPlayerSpriteUsed.framerate = 11;
                break;
            case 1:
            case 3:
                _oPlayerSpriteUsed.framerate = 13;
                break;
            case 2:
                _oPlayerSpriteUsed.framerate = 15;
                break;
        }
        _iSpeedApp = _iSpeed * 0.8;
    };

    this.showFrontAnimationTurn = function(iPositionInBar) {
        if (_oCursor) {
            createjs.Tween.get(_oCursor).to({
                alpha: 0
            }, 500).call(function() {});
        }
        _bHaveTurned = true;
        _bTurning = true;
        _bOverHalfTurnFrames = false;
        _iCurrentAnimation = TURN_FRONT_ANIMATION;
        _oPlayerSpriteUsed.spriteSheet = _oPlayerFrontTurn;
        _oPlayerSpriteUsed.currentAnimationFrame = 0;
        _oPlayerSpriteUsed.gotoAndPlay("turn");
        switch (iPositionInBar) {
            case 0:
            case 4:
                _oPlayerSpriteUsed.framerate = 11;
                break;
            case 1:
            case 3:
                _oPlayerSpriteUsed.framerate = 13;
                break;
            case 2:
                _oPlayerSpriteUsed.framerate = 15;
                break;
        }
        _iSpeedApp = _iSpeed * 0.8;
    };

    this.distance2 = function(v1, v2) {
        return ((v2.getX() - v1.getX()) * (v2.getX() - v1.getX())) + ((v2.getY() - v1.getY()) * (v2.getY() - v1.getY()));
    };

    this.move = function() {
        if (!_bCanMove) {
            return;
        }
        _oPlayerSpriteUsed.x += (_iSpeed * _vDirection.getX());
        _oPlayerSpriteUsed.y += (_iSpeed * _vDirection.getY());
        _vPlayerPos.set(_oPlayerSpriteUsed.x, _oPlayerSpriteUsed.y);
    };

    this.movementAffectedByPlayer = function(iSpeed, vDirectionPlayer) {
        if (!_bIsPlayer) {
            _oPlayerSpriteUsed.x += (iSpeed * vDirectionPlayer.getX());
            _oPlayerSpriteUsed.y += (iSpeed * vDirectionPlayer.getY());
        }
        if (iLane !== NUM_SWIMMERS - 1) {
            _oRope.x += (iSpeed * vDirectionPlayer.getX());
            _oRope.y += (iSpeed * vDirectionPlayer.getY());
        }
        _oWaterOnDive.x -= (_iSpeed * _vDirection.getX());
        _oWaterOnDive.y -= (_iSpeed * _vDirection.getY());

    };

    this.addSpeed = function() {
        if (_bTurning) {
            return;
        }
        if (!_bCanMove) {
            return;
        }
        if (_iSpeed >= _iMaxSpeed) {
            _iSpeed = _iMaxSpeed;
        }
        if (_iEnergy >= 0) {
            _iEnergy -= _iResistenceStep;
            _iSpeed += MODIFIER_SPEED_ADDER * (_iEnergy / _iMaxEnergy);
            if (_iSpeed <= _iMinSpeed) {
                _iSpeed = _iMinSpeed;
            }
        }
    };

    this.changeDirection = function() {
        var iAngle = (180) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);
    };

    this.decreaseSpeed = function() {
        if (_bTurning) {
            return;
        }
        if (!_bCanMove) {
            return;
        }
        _iSpeed -= SPEED_DECELERATION;
        if (_iSpeed <= _iMinSpeed) {
            _iSpeed = _iMinSpeed;
        }
    };

    this.increaseEnergy = function() {
        if (_iEnergy < _iMaxEnergy) {
            _iEnergy += 0.14;
        }
    };

    this.getEnergyProportion = function() {
        return _iEnergy / _iMaxEnergy;
    };

    this.getOccurrenceSwim = function() {
        return _iOccurrenceSwim;
    };

    this.getInfos = function() {
        return {
            sprite: _iNationalitySprite,
            nationality: _szTeamName
        };
    };

    this.getSpeed = function() {
        return _iSpeed;
    };

    this.getEnergy = function() {
        return _iEnergy;
    };

    this.unload = function() {
        _oPlayerSpriteUsed = null;
        _oContainer.removeAllChildren();
    };

    this.update = function() {
        if (!_bPlayerArrived) {
            if (_iCurrentAnimation === DIVE_ANIMATION && _oPlayerSpriteUsed.currentFrame >= SWIMMING_FRONT_ANIMATION) {
                _iSpeed = SPEED_ON_DIVE;
                if (_oPlayerSpriteUsed.currentFrame === _iPlayerDiveFrames - 1) {
                    this.showSwimmingAnimation();
                    _oWaterOnDive.stop();
                    _oWaterOnDive.visible = false;
                }
                if (_oPlayerSpriteUsed.currentFrame >= HALF_DIVE_ANIMATION_FRAME && !_bOverHalfAnimationDive) {
                    if (_bIsPlayer) {
                        s_oGame.halfAnimationDive();
                    }
                    _oWaterOnDive.x = _oPlayerSpriteUsed.x + 35;
                    _oWaterOnDive.y = _oPlayerSpriteUsed.y;
                    _oWaterOnDive.play();
                    _oWaterOnDive.visible = true;
                    _bOverHalfAnimationDive = true;
                }
            }
            if (_iCurrentAnimation === TURN_ANIMATION || _iCurrentAnimation === TURN_FRONT_ANIMATION) {
                if (_oPlayerSpriteUsed.currentFrame === _iPlayerTurnFrames - 1) {
                    if (_iCurrentAnimation === TURN_ANIMATION) {
                        this.showFrontSwimmingAnimation();
                    } else {
                        this.showSwimmingAnimation();
                    }
                    s_oGame.haveTurned(_iLane);
                }
                if (_oPlayerSpriteUsed.currentFrame >= HALF_TURN_ANIMATION_FRAME && !_bOverHalfTurnFrames) {
                    _bOverHalfTurnFrames = true;
                    if (!_bIsPlayer) {
                        _oParent.changeDirection();
                    } else {
                        s_oGame.changeBGsDirection();
                    }
                    _iSpeed = _iSpeedApp;
                    _bTurning = false;
                }
                if (!_bOverHalfTurnFrames) {
                    _iSpeed *= DECELERATION_ON_TURN;
                    if (_iSpeed <= SPEED_MIN_ON_TURN) {
                        _iSpeed = SPEED_MIN_ON_TURN;
                    }
                }
            }
        }

        if (_iSpeed <= SPEED_MIN_FOR_IDLE && !_bPlayerIsInIdle && (_iCurrentAnimation > DIVE_ANIMATION)) {

            this.showIdleAnimation();
            _bPlayerIsInIdle = true;
        }

    };

    var _oParent = this;
    s_oPlayer = this;

    this._init();

}
s_oPlayer = null;