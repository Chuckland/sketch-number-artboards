@import 'shared.js'

var onRun = function(context) {
    var doc = context.document;
    var selection = context.selection;

    com.adordzheev.init(context);

    // Если ничего не выбрано, выбираем все артборды на текущей странице
    if (selection.count() === 0) {
        selection = doc.currentPage().artboards();
        if (selection.count() === 0) {
            doc.showMessage("There is no artboards");
        }
    }

    var layersMeta = [];
    for (var i = 0; i < selection.count(); i++) {
        var layer = com.adordzheev.getArtboard(selection[i]);
        var left = layer.frame().x();
        var top = layer.frame().y();
        layersMeta.push({
            layer: layer,
            left: left,
            top: top
        });
    }

    try {
        // sort artboards by their top and left position
        layersMeta.sort(com.adordzheev.sortTopAndLeft);

        // convert the array of meta objects to a flat array of artboard layers
        var layersMetaArray = [];

        var layer;
        for (var i = 0; i < layersMeta.length; i++) {
            layer = layersMeta[i].layer;
            com.adordzheev.setArtboardNumber(layer, i);
            layersMetaArray.push(layer);
        }

        // sort layer list
        com.adordzheev.sortIndices(layersMetaArray);
    } catch(e) {
        doc.showMessage(e.message);
    }
}
