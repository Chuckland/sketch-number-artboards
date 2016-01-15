@import 'shared.js'

var onRun = function(context) {
    var doc = context.document;
    var selection = context.selection;

    com.adordzheev.init(context);

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

        var layer;
        for (var i = 0; i < layersMeta.length; i++) {
            layer = layersMeta[i].layer;
            com.adordzheev.simpleNumberArtboards(layer, i);
        }
    } catch(e) {
        doc.showMessage(e.message);
    }
}
