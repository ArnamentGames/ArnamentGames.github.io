function CWater(oContainer) {
    var _iFramerate = 1000 / 10;

    var _iTimeElapsed = 0;
    var _iBgOn = 0;

    var _aWaterBg = new Array();

    var _vDirection = new CVector2(0, 1);

    var _oContainer = oContainer;

    this._init = function() {

        var oSpriteTile = s_oSpriteLibrary.getSprite('water_0');
        _aWaterBg[0] = createBitmap(oSpriteTile);
        _aWaterBg[0].x = 205;
        _aWaterBg[0].y = -176;
        _oContainer.addChild(_aWaterBg[0]);
        _aWaterBg[0].scaleX = _aWaterBg[0].scaleY = 2;
        _aWaterBg[0].visible = true;

        if (!s_bMobile || s_bIsIphone) {
            oSpriteTile = s_oSpriteLibrary.getSprite('water_1');
            _aWaterBg[1] = createBitmap(oSpriteTile);
            _aWaterBg[1].x = 205;
            _aWaterBg[1].y = -176;
            _oContainer.addChild(_aWaterBg[1]);
            _aWaterBg[1].scaleX = _aWaterBg[1].scaleY = 2;
            _aWaterBg[1].sibile = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_2');
            _aWaterBg[2] = createBitmap(oSpriteTile);
            _aWaterBg[2].x = 205;
            _aWaterBg[2].y = -176;
            _oContainer.addChild(_aWaterBg[2]);
            _aWaterBg[2].scaleX = _aWaterBg[2].scaleY = 2;
            _aWaterBg[2].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_3');
            _aWaterBg[3] = createBitmap(oSpriteTile);
            _aWaterBg[3].x = 205;
            _aWaterBg[3].y = -176;
            _oContainer.addChild(_aWaterBg[3]);
            _aWaterBg[3].scaleX = _aWaterBg[3].scaleY = 2;
            _aWaterBg[3].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_4');
            _aWaterBg[4] = createBitmap(oSpriteTile);
            _aWaterBg[4].x = 205;
            _aWaterBg[4].y = -176;
            _oContainer.addChild(_aWaterBg[4]);
            _aWaterBg[4].scaleX = _aWaterBg[4].scaleY = 2;
            _aWaterBg[4].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_5');
            _aWaterBg[5] = createBitmap(oSpriteTile);
            _aWaterBg[5].x = 205;
            _aWaterBg[5].y = -176;
            _oContainer.addChild(_aWaterBg[5]);
            _aWaterBg[5].scaleX = _aWaterBg[5].scaleY = 2;
            _aWaterBg[5].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_6');
            _aWaterBg[6] = createBitmap(oSpriteTile);
            _aWaterBg[6].x = 205;
            _aWaterBg[6].y = -176;
            _oContainer.addChild(_aWaterBg[6]);
            _aWaterBg[6].scaleX = _aWaterBg[6].scaleY = 2;
            _aWaterBg[6].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_7');
            _aWaterBg[7] = createBitmap(oSpriteTile);
            _aWaterBg[7].x = 205;
            _aWaterBg[7].y = -176;
            _oContainer.addChild(_aWaterBg[7]);
            _aWaterBg[7].scaleX = _aWaterBg[7].scaleY = 2;
            _aWaterBg[7].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_8');
            _aWaterBg[8] = createBitmap(oSpriteTile);
            _aWaterBg[8].x = 205;
            _aWaterBg[8].y = -176;
            _oContainer.addChild(_aWaterBg[8]);
            _aWaterBg[8].scaleX = _aWaterBg[8].scaleY = 2;
            _aWaterBg[8].visible = false;

            oSpriteTile = s_oSpriteLibrary.getSprite('water_9');
            _aWaterBg[9] = createBitmap(oSpriteTile);
            _aWaterBg[9].x = 205;
            _aWaterBg[9].y = -176;
            _oContainer.addChild(_aWaterBg[9]);
            _aWaterBg[9].scaleX = _aWaterBg[9].scaleY = 2;
            _aWaterBg[9].visible = false;
        }

        var iAngle = (-76) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);
    };

    this.update = function() {

        _iTimeElapsed += s_iTimeElaps;

        if (_iTimeElapsed >= _iFramerate) {

            if (_iBgOn < _aWaterBg.length - 1) {
                _aWaterBg[_iBgOn].visible = false;
                _iBgOn++;
                _aWaterBg[_iBgOn].visible = true;
            } else {
                _aWaterBg[_iBgOn].visible = false;
                _iBgOn = 0;
                _aWaterBg[_iBgOn].visible = true;
            }
            _iTimeElapsed = 0;
        }
    };

    this.changeDir = function() {
        var iAngle = (180) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);
    };

    this.move = function(iSpeed) {
        for (var i = 0; i < _aWaterBg.length; i++) {
            _aWaterBg[i].x += (iSpeed * _vDirection.getX());
            _aWaterBg[i].y += (iSpeed * _vDirection.getY());
        }
    };

    this.getDirectionVector = function() {
        return _vDirection;
    };

    this._init();
}