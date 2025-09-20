function CHealtBar() {
    var _iMaskWidth;
    var _iMaskHeight;
    var _iPerc = 100;

    var _oHealtBarContainer;
    var _oHealtBar;
    var _oHealtMask;
    var _pHealtBarContainerPos = {
        x: CANVAS_WIDTH / 2 + 170,
        y: CANVAS_HEIGHT - 60
    };
    var _pHealtBarPos = {
        x: CANVAS_WIDTH / 2 + 170,
        y: CANVAS_HEIGHT - 56
    };

    this.init = function() {

        var oHealtSprite = s_oSpriteLibrary.getSprite('healt');
        _oHealtBar = createBitmap(oHealtSprite);
        _oHealtBar.x = _pHealtBarPos.x;
        _oHealtBar.y = _pHealtBarPos.y;
        _oHealtBar.regX = oHealtSprite.width;
        _oHealtBar.alpha = 0.9;
        s_oStage.addChild(_oHealtBar);

        _iMaskWidth = oHealtSprite.width;
        _iMaskHeight = oHealtSprite.height - 6;

        _oHealtMask = new createjs.Shape();
        _oHealtMask.graphics.beginFill("rgba(0,255,255,1)").drawRect(_oHealtBar.x - _iMaskWidth, _oHealtBar.y, _iMaskWidth, _iMaskHeight + 3);
        s_oStage.addChild(_oHealtMask);

        var oHealtSprite = s_oSpriteLibrary.getSprite('energy_bar');
        _oHealtBarContainer = createBitmap(oHealtSprite);
        _oHealtBarContainer.x = _pHealtBarContainerPos.x;
        _oHealtBarContainer.y = _pHealtBarContainerPos.y;
        _oHealtBarContainer.regX = oHealtSprite.width;
        s_oStage.addChild(_oHealtBarContainer);

        _oHealtBar.mask = _oHealtMask;

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshMask = function(iPerc) {
        _iPerc = iPerc;
        _oHealtMask.graphics.clear();
        var iNewMaskWidth = Math.floor((_iPerc * _iMaskWidth) / 100);
        _oHealtMask.graphics.beginFill("rgba(0,255,255,0.01)").drawRect(_oHealtBar.x - _iMaskWidth, _oHealtBar.y + 3, iNewMaskWidth, _iMaskHeight);
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oHealtBar.y = _pHealtBarPos.y - iNewY;
        _oHealtBarContainer.y = _pHealtBarContainerPos.y - iNewY;
        this.refreshMask(_iPerc);
    };

    s_oHealtBar = this;

    this.init();
}

var s_oHealtBar = null;