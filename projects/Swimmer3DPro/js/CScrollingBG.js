function CScrollingBg(oContainer) {
    var _aScrollingBg = new Array();

    var _aTurnPosition;
    var _aArrivalPosition;
    var _aShape = new Array();
    var _aShapeArrival = new Array();

    var _vDirection = new CVector2(0, 1);

    var _oContainer = oContainer;

    this._init = function() {

        var oSpriteTile = s_oSpriteLibrary.getSprite('pool_0');
        _aScrollingBg[0] = createBitmap(oSpriteTile);
        _aScrollingBg[0].y = -CANVAS_HEIGHT;
        _aScrollingBg[0].scaleX = _aScrollingBg[0].scaleY = 2;
        _oContainer.addChild(_aScrollingBg[0]);

        oSpriteTile = s_oSpriteLibrary.getSprite('pool_1');
        _aScrollingBg[1] = createBitmap(oSpriteTile);
        _aScrollingBg[1].x = CANVAS_WIDTH;
        _aScrollingBg[1].y = -CANVAS_HEIGHT;
        _aScrollingBg[1].scaleX = _aScrollingBg[1].scaleY = 2;
        _oContainer.addChild(_aScrollingBg[1]);

        oSpriteTile = s_oSpriteLibrary.getSprite('pool_2');
        _aScrollingBg[2] = createBitmap(oSpriteTile);
        _aScrollingBg[2].scaleX = _aScrollingBg[2].scaleY = 2;
        _oContainer.addChild(_aScrollingBg[2]);

        oSpriteTile = s_oSpriteLibrary.getSprite('pool_3');
        _aScrollingBg[3] = createBitmap(oSpriteTile);
        _aScrollingBg[3].x = CANVAS_WIDTH;
        _aScrollingBg[3].scaleX = _aScrollingBg[3].scaleY = 2;
        _oContainer.addChild(_aScrollingBg[3]);

        var iAngle = (-76) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);
    };

    this.setArrivalPositions = function(aArrivalPositions) {
        _aArrivalPosition = aArrivalPositions;
        /*
                for(var i=0; i < _aArrivalPosition.length; i++){
                    _aShapeArrival.push(new createjs.Shape());
                    _aShapeArrival[i].graphics.beginFill("#000000").drawRect(_aArrivalPosition[i].x, _aArrivalPosition[i].y, 10, 10);
                    _aShapeArrival[i].alpha = 0.5;
                    s_oStage.addChild(_aShapeArrival[i]);
                }*/
    };

    this.setEndPositions = function(aTurnPositions) {
        _aTurnPosition = aTurnPositions;
        /*
                for(var i=0; i < _aTurnPosition.length; i++){
                    _aShape.push(new createjs.Shape());
                    _aShape[i].graphics.beginFill("#000000").drawRect(_aTurnPosition[i].x, _aTurnPosition[i].y, 10, 10);
                    _aShape[i].alpha = 0.5;
                    s_oStage.addChild(_aShape[i]);
                }*/
    };

    this.changeDir = function() {
        var iAngle = (180) * (Math.PI / 180);
        rotateVector2D(iAngle, _vDirection);
    };

    this.move = function(iSpeed) {
        for (var i = 0; i < _aScrollingBg.length; i++) {
            _aScrollingBg[i].x += (iSpeed * _vDirection.getX());
            _aScrollingBg[i].y += (iSpeed * _vDirection.getY());
        }

        for (var i = 0; i < _aArrivalPosition.length; i++) {
            _aArrivalPosition[i].x += (iSpeed * _vDirection.getX());
            _aArrivalPosition[i].y += (iSpeed * _vDirection.getY());
            /*s_oStage.removeChild(_aShapeArrival[i]);
            _aShapeArrival[i] = new createjs.Shape();
            _aShapeArrival[i].graphics.beginFill("#000000").drawRect(_aArrivalPosition[i].x, _aArrivalPosition[i].y, 10, 10);
            _aShapeArrival[i].alpha = 0.5;
            s_oStage.addChild(_aShapeArrival[i]);*/
        }

        for (var i = 0; i < _aTurnPosition.length; i++) {
            _aTurnPosition[i].x += (iSpeed * _vDirection.getX());
            _aTurnPosition[i].y += (iSpeed * _vDirection.getY());
            /*s_oStage.removeChild(_aShape[i]);
            _aShape[i] = new createjs.Shape();
            _aShape[i].graphics.beginFill("#000000").drawRect(_aTurnPosition[i].x, _aTurnPosition[i].y, 10, 10);
            _aShape[i].alpha = 0.5;
            s_oStage.addChild(_aShape[i]);*/
        }
    };

    this.getArrivalPositions = function(i) {
        var vVectorApp = new CVector2(_aArrivalPosition[i].x, _aArrivalPosition[i].y)
        return vVectorApp;
    };

    this.getEndPositions = function(i) {
        var vVectorApp = new CVector2(_aTurnPosition[i].x, _aTurnPosition[i].y)
        return vVectorApp;
    };

    this.getDirectionVector = function() {
        return _vDirection;
    };

    this._init();
}