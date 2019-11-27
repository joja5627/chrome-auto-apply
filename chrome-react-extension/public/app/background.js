// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // console.log(request)
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {

        var activeTab = tabs[0];
      //   chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
       
        chrome.tabs.executeScript(activeTab.id, {
            file: 'hoverinspect.js'
         }, function() {
            chrome.tabs.sendMessage(activeTab.id, {
               action: 'activate'
            });
         }.bind(this));

   });
});