function CCreditsPanel() {

    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oCreditsText;

    var _oFade;
    var _oHitArea;

    var _oLink;

    var _pStartPosExit;

    this._init = function() {

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("#000").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        s_oStage.addChild(_oFade);

        var oSprite = s_oSpriteLibrary.getSprite('select_challenge');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH / 2;
        _oBg.y = CANVAS_HEIGHT / 2;
        _oBg.regX = oSprite.width / 2;
        _oBg.regY = oSprite.height / 2;
        s_oStage.addChild(_oBg);

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        s_oStage.addChild(_oHitArea);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 395,
            y: 215
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        _oCreditsText = new createjs.Text(TEXT_CREDITS, " 20px " + FONT, "#ffffff");
        _oCreditsText.x = CANVAS_WIDTH / 2 - 180;
        _oCreditsText.y = 126;
        _oCreditsText.textAlign = "left";
        _oCreditsText.textBaseline = "alphabetic";
        _oCreditsText.lineWidth = 1000;
        s_oStage.addChild(_oCreditsText);

        _oMsgText = new CFormatText(CANVAS_WIDTH / 2, 250, TEXT_CREDITS_DEVELOPED, "#ffffff", s_oStage, "#410701", 40);

        oSprite = s_oSpriteLibrary.getSprite('logo_credits');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width / 2;
        _oButLogo.regY = oSprite.height / 2;
        _oButLogo.x = CANVAS_WIDTH / 2;
        _oButLogo.y = 350;
        s_oStage.addChild(_oButLogo);

        _oLink = new CFormatText(CANVAS_WIDTH / 2, 450, TEXT_LINK1, "#ffffff", s_oStage, "#410701", 40);

    };

    this.unload = function() {
        _oHitArea.off("click", this._onLogoButRelease);

        _oButExit.unload();
        _oButExit = null;

        _oMsgText.unload();

        _oLink.unload();

        s_oStage.removeChild(_oBg);
        s_oStage.removeChild(_oButLogo);
        s_oStage.removeChild(_oHitArea);
        s_oStage.removeChild(_oCreditsText);
        s_oStage.removeChild(_oFade);
    };

    this._onLogoButRelease = function() {
        window.open("http://www.codethislab.com/index.php?&l=en");
    };

    this._init();


};