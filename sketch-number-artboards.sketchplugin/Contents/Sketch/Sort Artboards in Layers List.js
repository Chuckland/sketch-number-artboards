@import 'shared.js'

var getParameters = function(defaults) {
    var window = COSAlertWindow.new();
    window.setMessageText("Sort Artboards in Layers List")
    window.addTextLabelWithValue("Order:")
    window.addAccessoryView(com.adordzheev.createButtons(["By Columns", "By Rows"], defaults.values.order));
    window.addButtonWithTitle("OK");
    window.addButtonWithTitle("Cancel");

    return {
        button: window.runModal(),
        order: [[[window viewAtIndex:1] selectedCell] tag],
        sort: sortBox.state()
    };
}

var onRun = function(context) {
    var doc = context.document;
    var selection = context.selection;

    com.adordzheev.init(context);

    // Если ничего не выбрано, выбираем все артборды на текущей странице
    if (selection.count() === 0) {
        doc.showMessage("Select at least one artboard");
        return;
    }

    var layersMeta = [];
    var layer, left, top;
    for (var i = 0; i < selection.count(); i++) {
        layer = com.adordzheev.getParentArtboard(selection[i]);
        left = layer.frame().x();
        top = layer.frame().y();
        layersMeta.push({
            layer: layer,
            left: left,
            top: top
        });
    }

    try {
        // sort artboards by their top and left position
        layersMeta.sort(com.adordzheev.sortByColumns);

        // convert the array of meta objects to a flat array of artboard layers
        var layersMetaArray = [];

        var layer;
        for (var i = 0; i < layersMeta.length; i++) {
            layer = layersMeta[i].layer;
            layersMetaArray.push(layer);
        }

        // sort layer list
        com.adordzheev.sortIndices(layersMetaArray);
    } catch(e) {
        doc.showMessage(e.message);
    }
}
