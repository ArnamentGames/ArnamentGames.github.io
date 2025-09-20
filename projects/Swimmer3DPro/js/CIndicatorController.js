function CIndicatorController(iRange) {
    var _bShow = true;

    var _iScaleValue;
    var _iCntFrames;
    var _iCursorSpeed;
    var _iRange;
    var _pStartingPoint;
    var _pEndingPoint;

    var _oMcContainer;
    var _oStartOffset;
    var _oEndOffset;

    var _oBar;
    var _oCursor;
    var _iRightCursorX = 40;
    var _iRightCursorY = 0;

    var _bLeft = true;

    this.init = function() {
        _iRange = iRange;
        _oMcContainer = new createjs.Container();
        s_oStage.addChild(_oMcContainer);
        _oMcContainer.alpha = 0;

        var oRightBar = s_oSpriteLibrary.getSprite("right_bar");
        _oBar = createBitmap(oRightBar);
        _oMcContainer.addChild(_oBar);
        _oMcContainer.x = CANVAS_WIDTH / 2;
        _oMcContainer.y = CANVAS_HEIGHT / 2 - 130;

        var oCursor = s_oSpriteLibrary.getSprite("arrow_bar");
        _oCursor = createBitmap(oCursor);
        _oCursor.x = _iRightCursorX;
        _oCursor.y = _iRightCursorY;
        _oCursor.rotation = 90;
        _oMcContainer.addChild(_oCursor);

        _oStartOffset = {
            x: CANVAS_WIDTH / 2,
            y: 0
        };
        _oEndOffset = {
            x: CANVAS_WIDTH / 2,
            y: BARY - 50
        };

        this.reset();
        createjs.Tween.get(_oMcContainer).to({
            alpha: 1
        }, 500, createjs.Ease.quadInOut).call(function() {});
    };

    this.scaleBar = function(iScaleValue) {
        _iScaleValue = iScaleValue;
        _oBar.scaleX = _iScaleValue;
        _oBar.scaleY = _iScaleValue;
        _oCursor.scaleX = _iScaleValue;
        _oCursor.scaleY = _iScaleValue;
        _oEndOffset.x *= iScaleValue;
        _oEndOffset.y *= iScaleValue;
    };

    this.reset = function() {
        _iCntFrames = 0;
        _iCursorSpeed = SHOT_INDICATOR_SPEED;
        _pStartingPoint = new CVector2();
        _pStartingPoint.set(_oStartOffset.x, _oStartOffset.y);
        _pEndingPoint = new CVector2();
        _pEndingPoint.set(_oEndOffset.x, _oEndOffset.y);
    };

    this.increaseSpeed = function() {
        _iCursorSpeed -= DECREASE_SHOT_INDICATOR_SPEED;
    };

    this.show = function() {
        _bShow = true;
        _oMcContainer.visible = _bShow;
    };

    this.hide = function() {
        _bShow = false;
        _oMcContainer.visible = _bShow;
    };

    this.getPosition = function() {
        var iRes;
        iRes = Math.floor(_oCursor.y / _iRange);
        return iRes;
    };

    this.startAnimation = function() {
        var oParent = this;

        if (_bLeft) {
            createjs.Tween.get(_oCursor, {
                override: true
            }).to({
                y: _oEndOffset.y
            }, _iCursorSpeed, createjs.Ease.quadInOut).call(function() {
                _bLeft = !_bLeft;
                oParent.startAnimation();
            });
        } else {
            createjs.Tween.get(_oCursor, {
                override: true
            }).to({
                y: _oStartOffset.y
            }, _iCursorSpeed, createjs.Ease.quadInOut).call(function() {
                _bLeft = !_bLeft;
                oParent.startAnimation();
            });
        }
    };

    this.endAnimation = function() {
        createjs.Tween.get(_oCursor, {
            override: true
        }).to({
            y: _oCursor.y
        }, 0).call(function() {});
    };

    this.unload = function() {
        createjs.Tween.get(_oMcContainer).to({
            alpha: 0
        }, 500, createjs.Ease.quadInOut).call(function() {
            s_oStage.removeChild(_oMcContainer);
        });
    };

    this.init();
}