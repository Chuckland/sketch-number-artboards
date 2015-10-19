var com = com || {};

com.adordzheev = {
    alert : function(message, title) {
        title = title || 'Alert';
        var app = [NSApplication sharedApplication];
        [app displayDialog:message withTitle:title];
    },

    getArtboard : function(layer) {
    	if (layer.className() == 'MSArtboardGroup') {
    		return layer;
    	}
    	var artboard = layer;
        var parent;
    	while (artboard) {
            parent = artboard.parentGroup();
            if (parent.className() == 'MSArtboardGroup') {
                artboard = parent;
                break;
            } else if (parent.className() == 'MSPage') {
                break;
            }
    		artboard = parent;
    	}
    	if (!artboard) {
    		throw new Error("Layer is outside of any artboard");
    	}
    	return artboard;
    },

    init : function(context) {
        com.adordzheev.context = context;
        com.adordzheev.doc = context.document;
    },

    setArtboardNumber : function(artboard, number) {
        // Get current name.
        // If it contains number with the same formatting, then erase it.
        var curNameWONumber = artboard.name().replace(/^\d+_/, '');

        // Set new name
        artboard.setName((number < 9 ? '0' : '') + (number+1) + '_' + curNameWONumber);
    },

    sendBackward : function() {
        [NSApp sendAction:'moveBackward:' to:nil from:com.adordzheev.doc];
    },

    sortIndices : function(array) {
        for (var i = 0; i < array.length - 1; i++) {
            // get two array
            var a = array[i];
            var b = array[i + 1];

            // check if both layers are in the same group
            var parent_a = a.parentGroup();
            var parent_b = b.parentGroup();

            if (parent_a !== parent_b) {
                throw new Error("Couldn’t sort indices");
            }

            var parent = parent_a;

            if (parent.indexOfLayer(a) < parent.indexOfLayer(b)) {
                // swap index
                com.adordzheev.swapIndex(b, a);
            }
        }
    },

    sortTopAndLeft : function(a,b) {
        var dif = a.left - b.left;
        if (dif == 0) {
            return a.top - b.top;
        }
        return dif;
    },

    swapIndex : function(a, b) {
        // check if both layers are in the same group
        var parent_a = a.parentGroup();
        var parent_b = b.parentGroup();

        if (parent_a !== parent_b) {
            throw new Error("Select layers of the same group");
        }

        var parent = parent_a;

        com.adordzheev.doc.currentPage().deselectAllLayers();
        a.setIsSelected(true);

        var steps = Math.abs(parent.indexOfLayer(b) - parent.indexOfLayer(a));

        for (var i = 0; i < steps; i++) {
            com.adordzheev.sendBackward();
        }
    }
};
