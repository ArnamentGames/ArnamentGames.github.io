function CModeSelect() {
    var _iModeSelected = 1;

    var _oButContinue;
    var _oButtonEasy;
    var _oButtonNormal;
    var _oButtonHard;

    var _oLevelText;

    var _oBg;
    var _oButExit;
    var _oAudioToggle;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosContinue;

    this._init = function() {

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_team'));
        s_oStage.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('select_challenge');
        var oBox = createBitmap(oSprite);
        oBox.x = CANVAS_WIDTH / 2;
        oBox.y = CANVAS_HEIGHT / 2;
        oBox.regX = oSprite.width / 2;
        oBox.regY = oSprite.height / 2;
        s_oStage.addChild(oBox);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
            y: (oSprite.height / 2) + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oExitX = CANVAS_WIDTH - (oSprite.width / 2) - 90;
        _pStartPosAudio = {
            x: oExitX,
            y: (oSprite.height / 2) + 10
        };

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        _oLevelText = new createjs.Text(TEXT_MODE, " 20px " + FONT, "#ffffff");
        _oLevelText.x = CANVAS_WIDTH / 2 - 180;
        _oLevelText.y = 128;
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.lineWidth = 1000;
        s_oStage.addChild(_oLevelText);

        var _oSpriteEasy = s_oSpriteLibrary.getSprite('100_m');
        _oButtonEasy = new CToggle((CANVAS_WIDTH / 2) - 180, (CANVAS_HEIGHT / 2) - 25, _oSpriteEasy, true);
        _oButtonEasy.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, EASY);

        var _oSpriteNormal = s_oSpriteLibrary.getSprite('200_m');
        _oButtonNormal = new CToggle((CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2) - 25, _oSpriteNormal, false);
        _oButtonNormal.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, NORMAL);

        var _oSpriteHard = s_oSpriteLibrary.getSprite('400_m');
        _oButtonHard = new CToggle((CANVAS_WIDTH / 2) + 180, (CANVAS_HEIGHT / 2) - 25, _oSpriteHard, false);
        _oButtonHard.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, HARD);

        var oSprite = s_oSpriteLibrary.getSprite('but_continue_small');
        _pStartPosContinue = {
            x: (CANVAS_WIDTH / 2),
            y: (CANVAS_HEIGHT / 2) + 125
        };
        _oButContinue = new CGfxButton(_pStartPosContinue.x, _pStartPosContinue.y, oSprite, s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButNextRelease, this);

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this._onModeToggle = function(iMode) {
        _iModeSelected = iMode;

        switch (_iModeSelected) {
            case EASY:
                _oButtonEasy.setActive(true);
                _oButtonNormal.setActive(false);
                _oButtonHard.setActive(false);
                break;
            case NORMAL:
                _oButtonEasy.setActive(false);
                _oButtonNormal.setActive(true);
                _oButtonHard.setActive(false);
                break;
            case HARD:
                _oButtonEasy.setActive(false);
                _oButtonNormal.setActive(false);
                _oButtonHard.setActive(true);
                break;
        }
    };

    this._onExit = function() {
        s_oMain.gotoMenu();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };

    this._onAudioToggle = function() {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.unload = function() {
        _oButtonEasy.unload();
        _oButtonNormal.unload();
        _oButtonHard.unload();

        s_oStage.removeAllChildren();
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
    };

    this._onButNextRelease = function() {
        this.unload();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            createjs.Sound.play("click");
        }
        s_iModeSelected = _iModeSelected;

        s_oMain.gotoSelectLevel();
    };

    s_oModeSelect = this;

    this._init();

};

var s_oModeSelect = null;