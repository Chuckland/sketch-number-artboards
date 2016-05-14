@import 'shared.js'

var onRun = function(context) {
    var doc = context.document;
    var selection = context.selection;

    com.adordzheev.init(context);

    if (selection.count() === 0) {
        doc.showMessage('Select at least one layer');
        return false;
    }

    var layersMeta = [];
    var layer, left, top, parent;
    for (var i = 0; i < selection.count(); i++) {
        layer = selection[i];

        // parent layer should be the one
        if (parent && parent != layer.parentGroup()) {
            doc.showMessage('Select layers on one artboard and one layer');
            return false;
        }
        parent = layer.parentGroup();

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
