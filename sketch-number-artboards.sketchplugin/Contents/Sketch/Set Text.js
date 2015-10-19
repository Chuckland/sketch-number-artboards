@import "shared.js"

var onRun = function(context) {
    // Взять все выбранные слои
    // Проверить, что они текстовые
    var doc = context.document;
    var selection = context.selection;
    var APPLY = 1000;
    var READY_TO_SET = true;
    var CANCELLED = false;
    var NOT_READY = null;
    var textToSet;
    var useOldValue;

    if (selection.count() == 0) {
        doc.showMessage('Select at least one text layer');
        return;
    }

    userInterfaceLoop();

    function userInterfaceLoop() {

        var uiResponse = NOT_READY;

        while (uiResponse === NOT_READY) {

            // Creatte the interface
            var modal = createUserInterface();

            // Show it and process the form
            uiResponse = processButtonClick(modal, modal.runModal());

            // Process the response
            switch (uiResponse) {

                // Reload the interface
                case NOT_READY:
                alert("Find or replace cannot be blank");
                break;

                // Let's go
                case READY_TO_SET:
                doSetText();
                break;

                // Cancelled
                case CANCELLED:
                doc.showMessage("Cancelled");
                break;
            }
        }
    }

    function createUserInterface() {
        var userInterface = COSAlertWindow.new();

        userInterface.setMessageText("Set Text");

        userInterface.addTextFieldWithValue("");

        userInterface.addButtonWithTitle("Apply");
        userInterface.addButtonWithTitle("Cancel");

        return userInterface;
    }

    function processButtonClick(modal, buttonClick) {
        var result;

        if (buttonClick === APPLY) {

            // Найти *, если есть, выставить флаг «Использовать текущий текст»
            var stringValue = [[modal viewAtIndex: 0] stringValue];
            useOldValue = stringValue.match(/\*/g) ? true : false;

            // Grab the data from the form
            textToSet = stringValue;

            // Make sure we have both text to find and replace
            if (textToSet != "") {

                // Yeah, ready to go
                result = READY_TO_SET;

            } else {

                // Need something in find and replace
                result = NOT_READY;

            }

        } else {

            // Cancel button pressed
            result = CANCELLED;

        }

        return result;
    }

    function doSetText() {
        var layer;
        var oldValue;

        for (var i=0; i<selection.count(); i++) {
            layer = selection[i];
            if (layer.class() == MSTextLayer) {
                if (useOldValue) {
                    oldValue = layer.stringValue();
                    textToSet = textToSet.replace(/\*/g, oldValue);
                }
                layer.setStringValue(textToSet);
                layer.setName(textToSet);
            }
        }
    }
}
