function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;

    var _oPreloader;
    var _oMenu;
    var _oSelectTeam;
    var _oSelectLevel;
    var _oPlayerProgress;
    var _oHelp;
    var _oGame;

    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function(e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };

    this.preloaderReady = function() {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };

    this.soundLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();

            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundtrack = createjs.Sound.play("soundtrack", {
                    loop: -1
                });
            }
            this.gotoMenu();
        }
    };

    this._initSounds = function() {
        if (!createjs.Sound.initializeDefaultPlugins()) {
            return;
        }

        if (navigator.userAgent.indexOf("Opera") > 0 || navigator.userAgent.indexOf("OPR") > 0) {
            createjs.Sound.alternateExtensions = ["mp3"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

            createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack");
            createjs.Sound.registerSound("./sounds/applauses.ogg", "applauses");
            createjs.Sound.registerSound("./sounds/press_button.ogg", "click");
            createjs.Sound.registerSound("./sounds/crowd-cheers.ogg", "crowd_cheers");
            createjs.Sound.registerSound("./sounds/crowd.ogg", "crowd");
            createjs.Sound.registerSound("./sounds/dive.ogg", "dive");
            createjs.Sound.registerSound("./sounds/stop_bar.ogg", "stop_bar");

        } else {
            createjs.Sound.alternateExtensions = ["ogg"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

            createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");
            createjs.Sound.registerSound("./sounds/applauses.mp3", "applauses");
            createjs.Sound.registerSound("./sounds/press_button.mp3", "click");
            createjs.Sound.registerSound("./sounds/crowd-cheers.mp3", "crowd_cheers");
            createjs.Sound.registerSound("./sounds/crowd.mp3", "crowd");
            createjs.Sound.registerSound("./sounds/dive.mp3", "dive");
            createjs.Sound.registerSound("./sounds/stop_bar.mp3", "stop_bar");
        }

        RESOURCE_TO_LOAD += 7;

    };

    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_continue_small", "./sprites/but_continue_small.png");

        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");

        s_oSpriteLibrary.addSprite("left_button", "./sprites/left_button.png");
        s_oSpriteLibrary.addSprite("right_button", "./sprites/right_button.png");

        s_oSpriteLibrary.addSprite("but_skip", "./sprites/but_skip.png");

        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_select_team", "./sprites/bg_select_team.jpg");
        s_oSpriteLibrary.addSprite("bg_podium", "./sprites/bg_podium.jpg");
        s_oSpriteLibrary.addSprite("result_panel", "./sprites/result_panel.png");
        s_oSpriteLibrary.addSprite("upgrade_panel", "./sprites/upgrade_panel.png");
        s_oSpriteLibrary.addSprite("select_challenge", "./sprites/select_challenge.png");
        s_oSpriteLibrary.addSprite("various_help_box", "./sprites/various_help_box.png");
        s_oSpriteLibrary.addSprite("various_help_box_2", "./sprites/various_help_box_2.png");
        s_oSpriteLibrary.addSprite("final_score", "./sprites/final_score.png");

        s_oSpriteLibrary.addSprite("logo_credits", "./sprites/logo_credits.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");

        s_oSpriteLibrary.addSprite("100_m", "./sprites/but_100m.png");
        s_oSpriteLibrary.addSprite("200_m", "./sprites/but_200m.png");
        s_oSpriteLibrary.addSprite("400_m", "./sprites/but_400m.png");

        s_oSpriteLibrary.addSprite("level_sprite", "./sprites/level_sprite.png");

        s_oSpriteLibrary.addSprite("energy_bar", "./sprites/energy_bar.png");
        s_oSpriteLibrary.addSprite("healt", "./sprites/healt.png");

        s_oSpriteLibrary.addSprite("arrow_keys", "./sprites/arrow_keys.png");
        s_oSpriteLibrary.addSprite("vertical_bar", "./sprites/vertical_bar.png");
        s_oSpriteLibrary.addSprite("horizontal_bar", "./sprites/horizontal_bar.png");

        s_oSpriteLibrary.addSprite("arrival_panel", "./sprites/arrival_panel.png");

        s_oSpriteLibrary.addSprite("bar-1", "./sprites/bar-1.png");
        s_oSpriteLibrary.addSprite("bar-2", "./sprites/bar-2.png");

        s_oSpriteLibrary.addSprite("gold_medal", "./sprites/gold_medal.png");
        s_oSpriteLibrary.addSprite("silver_medal", "./sprites/silver_medal.png");
        s_oSpriteLibrary.addSprite("bronze_medal", "./sprites/bronze_medal.png");

        s_oSpriteLibrary.addSprite("right_bar", "./sprites/right_bar.png");
        s_oSpriteLibrary.addSprite("arrow_bar", "./sprites/arrow_bar.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");

        s_oSpriteLibrary.addSprite("splash_sprite", "./sprites/splash_sprite.png");

        for (var i = 0; i < NUM_SWIMMERS; i++) {
            s_oSpriteLibrary.addSprite("flag_swimmer_" + i, "./sprites/flag_swimmer_" + i + ".png");
            s_oSpriteLibrary.addSprite("flag_swimmer_" + i + "_game", "./sprites/flag_swimmer_" + i + "_game.jpg");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_dive", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_dive.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_swimming_back", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_swimming_back.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_swimming_front", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_swimming_front.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_turn_back", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_turn_back.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_turn_front", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_turn_front.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_idle", "./sprites/swimmer/swimmer_" + i + "/swimmer_" + i + "_idle.png");
            s_oSpriteLibrary.addSprite("swimmer_" + i + "_pose", "./sprites/swimmer/poses/swimmer_" + i + ".png");
        }

        s_oSpriteLibrary.addSprite("glow", "./sprites/glow.png");

        s_oSpriteLibrary.addSprite("blue_rope", "./sprites/blue_lane_rope.png");
        s_oSpriteLibrary.addSprite("green_rope", "./sprites/green_lane_rope.png");
        s_oSpriteLibrary.addSprite("yellow_rope", "./sprites/yellow_lane_rope.png");

        s_oSpriteLibrary.addSprite("pool_0", "./sprites/pool/01.png");
        s_oSpriteLibrary.addSprite("pool_1", "./sprites/pool/02.png");
        s_oSpriteLibrary.addSprite("pool_2", "./sprites/pool/03.png");
        s_oSpriteLibrary.addSprite("pool_3", "./sprites/pool/04.png");

        s_oSpriteLibrary.addSprite("water_0", "./sprites/pool/water/water_00.jpg");
        s_oSpriteLibrary.addSprite("water_1", "./sprites/pool/water/water_01.jpg");
        s_oSpriteLibrary.addSprite("water_2", "./sprites/pool/water/water_02.jpg");
        s_oSpriteLibrary.addSprite("water_3", "./sprites/pool/water/water_03.jpg");
        s_oSpriteLibrary.addSprite("water_4", "./sprites/pool/water/water_04.jpg");
        s_oSpriteLibrary.addSprite("water_5", "./sprites/pool/water/water_05.jpg");
        s_oSpriteLibrary.addSprite("water_6", "./sprites/pool/water/water_06.jpg");
        s_oSpriteLibrary.addSprite("water_7", "./sprites/pool/water/water_07.jpg");
        s_oSpriteLibrary.addSprite("water_8", "./sprites/pool/water/water_08.jpg");
        s_oSpriteLibrary.addSprite("water_9", "./sprites/pool/water/water_09.jpg");

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();

            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundtrack = createjs.Sound.play("soundtrack", {
                    loop: -1
                });
            }

            this.gotoMenu();
        }
    };

    this._onAllImagesLoaded = function() {

    };

    this.onAllPreloaderImagesLoaded = function() {
        this._loadImages();
    };

    this.gotoMenu = function() {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoTeamSelect = function() {
        _oSelectTeam = new CSelectTeam();
        _iState = STATE_MENU;
    };

    this.gotoModeSelect = function() {
        _oSelectTeam = new CModeSelect();
        _iState = STATE_MENU;
    };

    this.gotoSelectLevel = function() {
        _oSelectLevel = new CLevelMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function(iModeSelected, iLevel) {
        _oGame = new CGame(_oData, iModeSelected, iLevel);
        _iState = STATE_GAME;
    };

    this.gotoPlayerProgress = function() {
        _oPlayerProgress = new CPlayerProgress();
        _iState = STATE_MENU;
    };

    this.gotoHelp = function() {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function() {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
    };

    this.startUpdate = function() {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
    };

    this._update = function(event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;

    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_bIsIphone = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iMode;
var s_iLevelReached = 1;
var s_iModeSelected = 0;
var s_iPlayerMoney = 0;
var s_iSpeedBought = 0;
var s_iEnergyBought = 0;
var s_iSpeedAdder = 0;
var s_iEnergyAdder = 0;
var s_iTeamSelected = 0;
var s_szTeamSelectedSprite = "swimmer_0";
var s_aSwimmersScore = [0, 0, 0, 0, 0, 0, 0, 0];

var s_oCityInfos = null;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack;
var s_oCanvas;