var com = com || {};

com.adordzheev = {
    alert : function(message, title) {
        title = title || 'Alert';
        var app = [NSApplication sharedApplication];
        [app displayDialog:message withTitle:title];
    },

    getParentArtboard : function(layer) {
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

    simpleNumberArtboards : function(artboard, number) {
        // Delete old number from artboard name
        var currentName = artboard.name();
        var numsFreeName = currentName.replace(/^\d+_/, '');

        // Add new number
        artboard.setName((number < 9 ? '0' : '') + (number + 1) + '_' + numsFreeName);
    },

    numberArtboardsBySeries: function(artboard, serie, number) {
        var currentName = artboard.name();
        var numsFreeName = currentName.replace(/^\d+\-\d+_/, '');

        artboard.setName("" + (serie + 1) + "-" + (number < 9 ? '0' : '') + (number + 1) + '_' + numsFreeName);
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

    sortByColumns : function(a, b) {
        var dif = a.left - b.left;
        return (dif === 0) ? a.top - b.top : dif;
    },

    sortByRows : function(a, b) {
        var dif = a.top - b.top;
        return (dif === 0) ? a.left - b.left : dif;
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

var DefaultsManager = function(pluginDomain) {
    this.pluginDomain = pluginDomain;
    this.values = {};
};

DefaultsManager.prototype = {
    init: function(initialValues) {
        var defaults = [[NSUserDefaults standardUserDefaults] objectForKey:this.pluginDomain];
        var defaultValues = {};
        var dVal;

        for (var key in defaults) {
            defaultValues[key] = defaults[key];
        }

        for (var key in initialValues) {
            dVal = defaultValues[key];
            if (!dVal) {
                defaultValues[key] = initialValues[key];
            }
        }

        this.values = defaultValues;
    },

    save: function(values) {
        if (this.pluginDomain) {
            var defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:values forKey:this.pluginDomain];
        }
    }
}
