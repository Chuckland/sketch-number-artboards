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
			return;
        }
    }

    var layersMeta = [];
	var layer, left, top;
    for (var i = 0; i < selection.count(); i++) {
        layer = com.adordzheev.getArtboard(selection[i]);
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
        layersMeta.sort(com.adordzheev.sortTopAndLeft);

        var layer;
        for (var i = 0; i < layersMeta.length; i++) {
            layer = layersMeta[i].layer;
            com.adordzheev.setArtboardNumber(layer, i);
        }
    } catch(e) {
        doc.showMessage(e.message);
    }
}
