@import 'shared.js'

var onRun = function(context) {
    var sketch = context.api(),
        selectedLayers = sketch.selectedDocument.selectedLayers;

    if (selectedLayers.length === 0) {
        sketch.message("Select at least one artboard");
        return;
    }

    var artboardsMeta = com.adordzheev.collectArtboardsMeta(selectedLayers);

    try {
        // sort artboards by their top and left position
        artboardsMeta.sort(com.adordzheev.sortByColumns);

        // convert the array of meta objects to a flat array of artboard layers
        var artboardsMetaArray = [];

        var layer;
        for (var i = 0; i < artboardsMeta.length; i++) {
            layer = artboardsMeta[i].layer;
            artboardsMetaArray.push(layer);
        }

        // sort layer list
        com.adordzheev.sortIndices(artboardsMetaArray);
    } catch(e) {
        sketch.message(e.message);
    }
}
