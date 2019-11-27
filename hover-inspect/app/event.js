/*
*  Hover inspect extension for Chrome
*  https://github.com/NV0/hover-inspect
*/

(function() {

	var tabs = {};


	var inspect = {
		activate: function(id) {

			this.id = id;

			chrome.tabs.executeScript(this.id, {
				file: 'prism.js'
			});
			chrome.tabs.executeScript(this.id, {
				file: 'hoverinspect.js'
			}, function() {
				chrome.tabs.sendMessage(this.id, {
					action: 'activate'
				});
			}.bind(this));

			chrome.browserAction.setIcon({
				tabId: this.id,
				path: {
					19: "icon_active.png"
				}
			});
			chrome.runtime.onMessage.addListener((msg, sender, response) => {
				console.log(msg)
				console.log(sender)
				console.log(response)
				// // First, validate the message's structure.
				// if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
				//   // Collect the necessary data. 
				//   // (For your specific requirements `document.querySelectorAll(...)`
				//   //  should be equivalent to jquery's `$(...)`.)
				//   var domInfo = {
				// 	total: document.querySelectorAll('*').length,
				// 	inputs: document.querySelectorAll('input').length,
				// 	buttons: document.querySelectorAll('button').length,
				//   };
			  
				//   // Directly respond to the sender (popup), 
				//   // through the specified callback.
				//   response(domInfo);
				// }
			  });
		},

		deactivate: function() {

			chrome.tabs.sendMessage(this.id, {
				action: 'deactivate'
			});

			chrome.browserAction.setIcon({
				tabId: this.id,
				path: {
					19: "icon.png"
				}
			});
		}

	};

	function toggle(tab) {

		if (!tabs[tab.id]) {
			tabs[tab.id] = Object.create(inspect);
			tabs[tab.id].activate(tab.id);
		} else {
			tabs[tab.id].deactivate();
			for (var tabId in tabs) {
				if (tabId == tab.id) delete tabs[tabId];
			}
		}
	}

	chrome.browserAction.onClicked.addListener(toggle);

})();
