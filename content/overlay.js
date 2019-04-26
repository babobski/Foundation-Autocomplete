/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.foundation_auto) === 'undefined') extensions.foundation_auto = {
	version: '1.0.0'
};
(function() {
	var notify = require("notify/notify"),
		$ = require("ko/dom"),
		self = this,
		editor = require("ko/editor");

	this._calculateXpos = function() {
		var currentWindowPos = editor.getCursorWindowPosition(true);
			
		return currentWindowPos.x;
	}

	this._calculateYpos = function() {
		var currentWindowPos = editor.getCursorWindowPosition(true),
			defaultTextHeight = (ko.views.manager.currentView.scimoz.textHeight(0) - 10);
			
			defaultTextHeight = defaultTextHeight;
		
		return (currentWindowPos.y + defaultTextHeight);
	}

	insertFoundationVar = function() {
		var scimoz = ko.views.manager.currentView.scimoz,
			currentLine =	scimoz.lineFromPosition(scimoz.currentPos),
			input = $('#foundation_auto');

		if (input.length > 0) {
			var val = input.value(),
				valLength = val.length;

			if (valLength > 0) {
                scimoz.replaceSel('');
                scimoz.insertText(scimoz.currentPos, val);
                scimoz.gotoPos(scimoz.currentPos + valLength);
                ko.views.manager.currentView.setFocus();
                
                setTimeout(function(){
                    if (scimoz.lineFromPosition(scimoz.currentPos) > currentLine) {
                        scimoz.homeExtend();
                        scimoz.charLeftExtend();
                        scimoz.replaceSel('');
                    }
                }, 50);
			}
			input.parent().remove();
		}
	}

	abortFoundationVarCompletion = function() {
		var comp = $('#foundation_wrapper');

		if (comp.length > 0) {
			comp.remove();
			ko.views.manager.currentView.setFocus();
		}
	}

	blurFoundationComletion = function() {
		clearFoundationCompletion = setTimeout(function() {
			abortFoundationVarCompletion();
		}, 1000);
	}

	focusFoundationCompletion = function() {
		if (typeof clearFoundationCompletion !== 'undefined') {
			clearTimeout(clearFoundationCompletion);
		}
	}
	
	this._getAutoCompletions = function() {
        var completions = [];
        var defaults = [
            'auto',
            'small-auto',
            'medium-auto',
            'large-auto',
            'align-right',
            'align-center',
            'align-justify',
            'align-spaced',
            'show',
            'show-for-small',
            'show-for-medium',
            'show-for-large',
            'hide',
            'hide-for-medium',
            'hide-for-large',
            'show-for-small-only',
            'show-for-medium-only',
            'show-for-large-only',
            'hide-for-small-only',
            'hide-for-medium-only',
            'hide-for-large-only',
            'invisible',
            'visible',
            'show-for-landscape',
            'show-for-portrait',
            'float-left',
            'float-right',
            'float-center',
            'text-left',
            'text-right',
            'text-center',
            'text-justify',
            'no-bullet',
            'stat',
            'tiny',
            'small',
            'large',
            'expanded',
            'small-only-expanded',
            'medium-only-expanded',
            'large-only-expanded',
            'medium-expanded',
            'large-expanded',
            'medium-down-expanded',
            'large-down-expanded',
            'primary',
            'secondary',
            'success',
            'alert',
            'warning',
            'button',
            'button-group',
            'stacked-for-small',
            'hollow',
            'disabled',
            'clear',
            'dropdown',
            'arrow-only',
            'menu',
            'vertical',
            'simple',
            'nested',
            'is-active',
            'menu-text',
            'form-error',
            'subheader',
            'lead',
            'data-equalizer',
            'data-equalizer-watch',
            'data-abide',
            'novalidate',
            'data-abide-error',
            'data-interchange',
            'data-toggler',
            'data-smooth-scroll',
            'data-sticky-container',
            'data-sticky',
            'data-margin-top',
            'data-top-anchor',
            'data-btm-anchor',
            'data-stick-to',
            'data-options',
            'data-tooltip',
            'data-click-open',
            'data-position',
            'data-alignment',
            'responsive-embed',
            'widescreen',
            'panorama',
            'label',
            'data-orbit',
            'data-toggle',
            'data-dropdown',
            'data-auto-focus',
            'data-hover',
            'data-hover-pane',
            'data-off-canvas',
            'off-canvas',
            'position-left',
            'position-right',
            'position-top',
            'position-bottom',
            'off-canvas-content',
            'data-off-canvas-content',
            'off-canvas-wrapper',
            'data-close',
            'close-button',
            'reveal',
            'data-reveal',
            'data-open',
            'data-tabs',
            'tabs',
            'tabs-title',
            'tabs-content',
            'data-tabs-content',
            'tabs-panel',
            'data-active-collapse',
            'data-tabs-content',
            'data-deep-link',
            'data-update-history',
            'data-deep-link-smudge',
            'accordion',
            'data-responsive-accordion-tabs',
            'accordion-item',
            'data-accordion',
            'data-accordion-item',
            'accordion-title',
            'accordion-content',
            'data-tab-content'
        ];
        var collTypes = [
            'small',
            'medium',
            'large',
            'small-offset',
            'medium-offset',
            'large-offset',
            'small-order',
            'medium-order',
            'large-order',
        ];
        
        for (var o = 0; o < defaults.length; o++) {
            var completion = {
                "value": defaults[o],
            };
            completions.push(completion);
        }
        
        for (var i = 0; i < collTypes.length; i++) {
            for (var e = 1; e <= 12; e++) {
                 var completion = {
                    "value": collTypes[i] + '-' + e,
                };
                completions.push(completion);
            }
        }
        
        completions.sort();
        
		return JSON.stringify(completions);
	}

	this.autoComplete = function() {
		var completions = self._getAutoCompletions(),
			mainWindow = document.getElementById('komodo_main'),
			popup = document.getElementById('foundation_wrapper'),
			autocomplete = document.createElement('textbox'),
			currentView = ko.views.manager.currentView,
			x = self._calculateXpos(),
			y = self._calculateYpos();

		if (popup == null) {
			popup = document.createElement('tooltip');
			popup.setAttribute('id', 'foundation_wrapper');
			autocomplete.setAttribute('id', 'foundation_auto');
			autocomplete.setAttribute('type', 'autocomplete');
			autocomplete.setAttribute('showcommentcolumn', 'true');
			autocomplete.setAttribute('autocompletesearch', 'foundation_auto-autocomplete');
			autocomplete.setAttribute('highlightnonmatches', 'true');
			autocomplete.setAttribute('ontextentered', 'insertFoundationVar()');
			autocomplete.setAttribute('ontextreverted', 'abortFoundationVarCompletion()');
			autocomplete.setAttribute('ignoreblurwhilesearching', 'true');
			autocomplete.setAttribute('minresultsforpopup', '0');
			autocomplete.setAttribute('onblur', 'blurFoundationComletion()');
			autocomplete.setAttribute('onfocus', 'focusFoundationCompletion()');
			popup.appendChild(autocomplete);

			mainWindow.appendChild(popup);
		}

		if (completions.length > 0) {
			if (currentView.scintilla.autocomplete.active) {
				currentView.scintilla.autocomplete.close();
			}
			autocomplete.setAttribute('autocompletesearchparam', completions);
			popup.openPopup(mainWindow, "", x, y, false, false);
			autocomplete.focus();
			autocomplete.value = "";
			autocomplete.open = true;
		}

	}
	
	//var features = "chrome,titlebar,toolbar,centerscreen,dependent";
	//this.OpenLessSettings = function() {
	//	window.openDialog('chrome://foundation_auto/content/pref-overlay.xul', "lessSettings", features);
	//}
	
}).apply(extensions.foundation_auto);












