function CVariousHelp(szText, iHelpType) {

    var _iHelpType = iHelpType;
    var _iTextY = -90;
    var _iButtonY = 40;

    var _oParent = this;

    var _oBg;
    var _oContainer;
    var _oContainerPos = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2
    };

    var _szText = szText;
    var _oMsgText;

    var _oShape;

    var _oButNo;
    var _oButYes;

    var _pHealtBarContainerPos = {
        x: 100,
        y: 150
    };
    var _pHealtBarPos = {
        x: 100,
        y: 154
    };

    this._init = function() {
        _oContainer = new createjs.Container();
        _oContainer.x = _oContainerPos.x;
        _oContainer.y = _oContainerPos.y;
        _oContainer.alpha = 0;

        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#000000").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oShape.alpha = 0.7;
        _oShape.on("mousedown", this._onClick);
        s_oStage.addChild(_oShape);

        if (_iHelpType === WAIT_FOR_GAME_START) {

            var oSpriteBg = s_oSpriteLibrary.getSprite('select_challenge');
            _oBg = createBitmap(oSpriteBg);
            _oBg.regX = oSpriteBg.width / 2;
            _oBg.regY = oSpriteBg.height / 2;
            _oContainer.addChild(_oBg);

            _oMsgText = new createjs.Text("HELP", " 20px " + FONT, "#ffffff");
            _oMsgText.x = -155;
            _oMsgText.y = -193;
            _oMsgText.textAlign = "center";
            _oMsgText.textBaseline = "alphabetic";
            _oMsgText.lineWidth = 200;
            _oContainer.addChild(_oMsgText);

            _oMsgText = new createjs.Text(_szText, " 20px " + FONT, "#ffb400");
            _oMsgText.x = -150;
            _oMsgText.y = _iTextY;
            _oMsgText.textAlign = "center";
            _oMsgText.textBaseline = "alphabetic";
            _oMsgText.lineWidth = 200;
            _oContainer.addChild(_oMsgText);

            if (!s_bMobile) {
                var oSprite = createBitmap(s_oSpriteLibrary.getSprite('arrow_keys'));
                oSprite.x = -200;
                oSprite.scaleX = 0.5;
                oSprite.scaleY = 0.5;
                _oContainer.addChild(oSprite);

                var oMsgText = new createjs.Text(HELP_TEXT_BAR, " 20px " + FONT, "#ffb400");
                oMsgText.x = 120;
                oMsgText.y = _iTextY;
                oMsgText.textAlign = "center";
                oMsgText.textBaseline = "alphabetic";
                oMsgText.lineWidth = 200;
                _oContainer.addChild(oMsgText);

            } else {
                _oMsgText.text = TEXT_START_MOVEMENT_MOBILE;

                var oSprite = createBitmap(s_oSpriteLibrary.getSprite('left_button'));
                oSprite.x = -215;
                oSprite.y = 5;
                oSprite.scaleX = oSprite.scaleY = 0.3;
                _oContainer.addChild(oSprite);

                var oSprite = createBitmap(s_oSpriteLibrary.getSprite('right_button'));
                oSprite.x = -130;
                oSprite.y = 5;
                oSprite.scaleX = oSprite.scaleY = 0.3;
                _oContainer.addChild(oSprite);

                var oMsgText = new createjs.Text(HELP_TEXT_BAR_MOBILE, " 15px " + FONT, "#ffb400");
                oMsgText.x = 120;
                oMsgText.y = _iTextY;
                oMsgText.textAlign = "center";
                oMsgText.textBaseline = "alphabetic";
                oMsgText.lineWidth = 200;
                _oContainer.addChild(oMsgText);

                var oSprite = createBitmap(s_oSpriteLibrary.getSprite('but_continue_small'));
                oSprite.x = 100;
                oSprite.y = 5;
                oSprite.scaleX = 0.5;
                oSprite.scaleY = 0.5;
                _oContainer.addChild(oSprite);
            }

            var oSpriteVerticalBar = createBitmap(s_oSpriteLibrary.getSprite('vertical_bar'));
            oSpriteVerticalBar.x = 0;
            oSpriteVerticalBar.y = -90;
            oSpriteVerticalBar.scaleX = 0.5;
            oSpriteVerticalBar.scaleY = 0.5;
            _oContainer.addChild(oSpriteVerticalBar);

            var oRightBar = createBitmap(s_oSpriteLibrary.getSprite("right_bar"));
            oRightBar.x = 250;
            oRightBar.y = -100;
            oRightBar.scaleX = 0.4;
            oRightBar.scaleY = 0.4;
            _oContainer.addChild(oRightBar);
            var oArrowBar = createBitmap(s_oSpriteLibrary.getSprite("arrow_bar"));
            oArrowBar.x = 280;
            oArrowBar.y = -30;
            oArrowBar.scaleX = 0.4;
            oArrowBar.scaleY = 0.4;
            oArrowBar.rotation = 90;
            _oContainer.addChild(oArrowBar);

            var oSpriteHorizontalBar = createBitmap(s_oSpriteLibrary.getSprite('horizontal_bar'));
            oSpriteHorizontalBar.x = -140;
            oSpriteHorizontalBar.y = 60;
            oSpriteHorizontalBar.scaleX = 0.5;
            oSpriteHorizontalBar.scaleY = 0.5;
            _oContainer.addChild(oSpriteHorizontalBar);

            var oMsgText = new createjs.Text(HELP_ENERGY, " 18px " + FONT, "#ffb400");
            oMsgText.x = 0;
            oMsgText.y = _iTextY + 225;
            oMsgText.textAlign = "center";
            oMsgText.textBaseline = "alphabetic";
            oMsgText.lineWidth = 350;
            _oContainer.addChild(oMsgText);

            var oHealtSprite = s_oSpriteLibrary.getSprite('healt');
            var oHealtBar = createBitmap(oHealtSprite);
            oHealtBar.x = _pHealtBarPos.x;
            oHealtBar.y = _pHealtBarPos.y - 65;
            oHealtBar.regX = oHealtSprite.width;
            oHealtBar.scaleX = 0.59;
            oHealtBar.scaleY = 0.5;
            oHealtBar.alpha = 0.9;
            _oContainer.addChild(oHealtBar);

            var oHealtSprite = s_oSpriteLibrary.getSprite('energy_bar');
            var oHealt = createBitmap(oHealtSprite);
            oHealt.x = _pHealtBarContainerPos.x;
            oHealt.y = _pHealtBarContainerPos.y - 65;
            oHealt.scaleX = 0.6;
            oHealt.scaleY = 0.6;
            oHealt.regX = oHealtSprite.width;
            _oContainer.addChild(oHealt);

        } else if (_iHelpType === CONFIRMATION_ON_EXIT) {

            var oSpriteBg = s_oSpriteLibrary.getSprite('various_help_box_2');
            _oBg = createBitmap(oSpriteBg);
            _oBg.regX = oSpriteBg.width / 2;
            _oBg.regY = oSpriteBg.height / 2;
            _oContainer.addChild(_oBg);

            _oMsgText = new createjs.Text(_szText, " 30px " + FONT, "#ffb400");
            _oMsgText.x = 0;
            _oMsgText.y = _iTextY + 50;
            _oMsgText.textAlign = "center";
            _oMsgText.textBaseline = "alphabetic";
            _oMsgText.lineWidth = 300;
            _oContainer.addChild(_oMsgText);

            _oButNo = createBitmap(s_oSpriteLibrary.getSprite('but_exit'));
            _oButNo.x = -50;
            _oButNo.y = _iButtonY;
            _oButNo.regX = 30;
            _oButNo.regY = 43;
            _oButNo.scaleX = -1;
            _oButNo.cursor = "pointer";
            _oContainer.addChild(_oButNo);

            _oButYes = createBitmap(s_oSpriteLibrary.getSprite('but_yes'));
            _oButYes.x = 50;
            _oButYes.y = _iButtonY;
            _oButYes.regX = 30;
            _oButYes.regY = 43;
            _oButYes.cursor = "pointer";
            _oContainer.addChild(_oButYes);
        } else if (_iHelpType === CONFIRMATION_ON_CAREER_RESET) {

            var oSpriteBg = s_oSpriteLibrary.getSprite('various_help_box_2');
            _oBg = createBitmap(oSpriteBg);
            _oBg.regX = oSpriteBg.width / 2;
            _oBg.regY = oSpriteBg.height / 2;
            _oContainer.addChild(_oBg);

            _oMsgText = new createjs.Text(_szText, " 30px " + FONT, "#ffb400");
            _oMsgText.x = 0;
            _oMsgText.y = _iTextY + 10;
            _oMsgText.textAlign = "center";
            _oMsgText.textBaseline = "alphabetic";
            _oMsgText.lineWidth = 300;
            _oContainer.addChild(_oMsgText);

            _oButNo = createBitmap(s_oSpriteLibrary.getSprite('but_exit'));
            _oButNo.x = -50;
            _oButNo.y = _iButtonY + 30;
            _oButNo.regX = 30;
            _oButNo.regY = 43;
            _oButNo.scaleX = -1;
            _oButNo.cursor = "pointer";
            _oContainer.addChild(_oButNo);

            _oButYes = createBitmap(s_oSpriteLibrary.getSprite('but_yes'));
            _oButYes.x = 50;
            _oButYes.y = _iButtonY + 30;
            _oButYes.regX = 30;
            _oButYes.regY = 43;
            _oButYes.cursor = "pointer";
            _oContainer.addChild(_oButYes);
        }

        s_oStage.addChild(_oContainer);

        this.show();
    };

    this._initListener = function() {
        if (_iHelpType === CONFIRMATION_ON_EXIT) {
            _oButNo.addEventListener("click", this._onNo);
            _oButYes.addEventListener("click", this._onYes);
        } else if (_iHelpType === CONFIRMATION_ON_CAREER_RESET) {
            _oButNo.addEventListener("click", this._onNoCareerReset);
            _oButYes.addEventListener("click", this._onYesCareerReset);
        }
    };

    this.show = function() {

        createjs.Tween.get(_oContainer).to({
            alpha: 1
        }, 500).call(function() {
            _oParent._initListener();
        });
    };

    this._onNo = function() {
        s_oGame.unloadVariousHelp(_iHelpType);
    };

    this._onYes = function() {
        s_oGame.onExit();
    };

    this._onNoCareerReset = function() {
        s_oMenu.unloadVariousHelp();
    };

    this._onYesCareerReset = function() {
        s_oMenu.onContinue();
    };

    this._onClick = function() {
        if (_iHelpType === WAIT_FOR_GAME_START) {
            s_oGame.unloadVariousHelp(CONFIRMATION_ON_EXIT);
        }
    };


    this.unload = function() {
        createjs.Tween.get(_oContainer).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(_oContainer);
        });

        s_oStage.removeChild(_oShape);

    };

    this._init();

    s_oVariousHelp = this;

    return this;
}

var s_oVariousHelp = null;