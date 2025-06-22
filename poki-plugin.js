var $gvRdH$phaser = require("phaser");

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $66a613ab66341f23$exports = {};

$parcel$export($66a613ab66341f23$exports, "EVENT_INITIALIZED", () => $66a613ab66341f23$export$7d17243235f36b85);
$parcel$export($66a613ab66341f23$exports, "PokiPlugin", () => $66a613ab66341f23$export$176a0ece5b97d00d);

const $66a613ab66341f23$export$7d17243235f36b85 = "poki:initialized";

// Mock Poki SDK for offline functionality
const MockPokiSDK = {
    init: () => Promise.resolve(),
    gameLoadingStart: () => console.log('[Poki] Game loading started'),
    gameLoadingFinished: () => console.log('[Poki] Game loading finished'),
    gameplayStart: () => console.log('[Poki] Gameplay started'),
    gameplayStop: () => console.log('[Poki] Gameplay stopped'),
    commercialBreak: () => Promise.resolve(false),
    rewardedBreak: () => Promise.resolve(false)
};

class $66a613ab66341f23$export$176a0ece5b97d00d extends (0, $gvRdH$phaser.Plugins).BasePlugin {
    init({ loadingSceneKey: loadingSceneKey , gameplaySceneKey: gameplaySceneKey , autoCommercialBreak: autoCommercialBreak  }) {
        this._loadingSceneKey = loadingSceneKey;
        this._gameplaySceneKey = gameplaySceneKey;
        this._autoCommercialBreak = autoCommercialBreak;
        this._scriptLoaded = true; // Always true for offline mode
        this._initializeHooks = [];
        this._queue = [];
        this.initialized = true; // Always initialized for offline mode
        this.hasAdblock = true; // Always true for offline mode
        this.sdk = MockPokiSDK; // Use mock SDK
        
        // Emit initialized event immediately
        this.game.events.emit($66a613ab66341f23$export$7d17243235f36b85, this);
        this._initializeHooks.forEach((f)=>f(this));
        this._initializeHooks = undefined;
        
        this._currentScenes = [];
    }
    runWhenInitialized(callback) {
        if (this.initialized) callback(this) // eslint-disable-line node/no-callback-literal
        ;
        else this._initializeHooks.push(callback);
    }
    // Called by Phaser, do not use
    start() {
        this.game.events.on("step", this._update, this);
    }
    // Called by Phaser, do not use
    stop() {
        this.game.events.off("step", this._update);
    }
    _update() {
        // Detect if new actives scenes are added or removed:
        const names = this.game.scene.getScenes(true).map((s)=>s.constructor.name);
        this._currentScenes.forEach((name)=>{
            if (names.indexOf(name) === -1) {
                this._currentScenes.splice(this._currentScenes.indexOf(name), 1);
                if (name === this._loadingSceneKey) this.gameLoadingFinished();
                if (name === this._gameplaySceneKey) this.gameplayStop();
            }
        });
        names.forEach((name)=>{
            if (this._currentScenes.indexOf(name) === -1) {
                this._currentScenes.push(name);
                if (name === this._loadingSceneKey) this.gameLoadingStart();
                if (name === this._gameplaySceneKey) {
                    // Skip commercial breaks in offline mode
                    this.gameplayStart();
                }
            }
        });
    }
    // Manually call the gameLoadedStart event in the PokiSDK, this is done
    // automatically if you've set the loadingSceneKey in the plugin data.
    gameLoadingStart() {
        if (this._scriptLoaded) this.sdk.gameLoadingStart();
        else this._queue.push(()=>{
            this.sdk.gameLoadingStart();
        });
    }
    // Manually call the gameLoadingFinished event in the PokiSDK, this is done
    // automatically if you've set the loadingSceneKey in the plugin data.
    gameLoadingFinished() {
        if (this._scriptLoaded) this.sdk.gameLoadingFinished();
        else this._queue.push(()=>{
            this.sdk.gameLoadingFinished();
        });
    }
    // Manually call the gameplayStart event in the PokiSDK, this is done
    // automatically if you've set the gameplaySceneKey in the plugin data.
    gameplayStart() {
        if (this._scriptLoaded) this.sdk.gameplayStart();
        else this._queue.push(()=>{
            this.sdk.gameplayStart();
        });
    }
    // Manually call the gameplayStop event in the PokiSDK, this is done
    // automatically if you've set the gameplaySceneKey in the plugin data.
    gameplayStop() {
        if (this._scriptLoaded) this.sdk.gameplayStop();
        else this._queue.push(()=>{
            this.sdk.gameplayStop();
        });
    }
    // Manually request a commercialBreak via the PokiSDK, this is done
    // automatically if you've set autoCommercialBreak to true in the plugin data
    // and the configured gameplayScene started/resumed.
    commercialBreak() {
        return this._break("commercial");
    }
    // Trigger a rewardedBreak via the PokiSDK when called.
    rewardedBreak() {
        return this._break("rewarded");
    }
    _break(type) {
        if (type !== "commercial" && type !== "rewarded") throw new Error('type must be "commercial" or "rewarded"');
        // In offline mode, always return false (no ads)
        return Promise.resolve(false);
    }
}


$parcel$exportWildcard(module.exports, $66a613ab66341f23$exports);

// Browser compatibility - make PokiPlugin available globally
if (typeof window !== 'undefined') {
    window.PokiPlugin = $66a613ab66341f23$export$176a0ece5b97d00d;
    window.EVENT_INITIALIZED = $66a613ab66341f23$export$7d17243235f36b85;
}

//# sourceMappingURL=phaser-poki.js.map
