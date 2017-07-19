var com = com || {};

com.adordzheev = {
    getParentArtboard : function(layer) {
        if (layer.isArtboard) {
            return layer;
        } else {
            return getParentArtboard(layer.container);
        }
    },

    simpleNumberArtboards : function(artboard, number) {
        // Delete old number from artboard name
        var currentName = artboard.name;
        var numsFreeName = currentName.replace(/^\d+_/, '');

        // Add new number
        artboard.name = (number < 9 ? '0' : '') + (number + 1) + '_' + numsFreeName;
    },

    numberArtboardsBySeries: function(artboard, serie, number) {
        var currentName = artboard.name;
        var numsFreeName = currentName.replace(/^\d+\_\d+_/, '');

        artboard.name = (serie < 9 ? '0' : '') + (serie + 1) + "_" + (number < 9 ? '0' : '') + (number + 1) + '_' + numsFreeName;
    },

    sortIndices : function(array) {
        for (var i = 0; i < array.length - 1; i++) {
            var a = array[i];
            var b = array[i + 1];

            if (a.index < b.index) {
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
        var steps = Math.abs(b.index - a.index);
        for (var i = 0; i < steps; i++) {
            a.moveBackward();
        }
    },

    createButtons : function(options, selectedItem) {
        var rows = 1;
        var columns = options.length;

        var selectedRow = 0;
        var selectedColumn = selectedItem;

        var buttonCell = [[NSButtonCell alloc] init];
        [buttonCell setButtonType:NSRadioButton];

        var buttonMatrix = [[NSMatrix alloc]
            initWithFrame:NSMakeRect(20.0, 20.0, 300.0, rows*25.0)
            mode:NSRadioModeMatrix
            prototype:buttonCell
            numberOfRows:rows
            numberOfColumns:columns];
        [buttonMatrix setCellSize:NSMakeSize(140, 20)];

        for (var i = 0; i < options.length; i++) {
            [[[buttonMatrix cells] objectAtIndex:i] setTitle:options[i]];
            [[[buttonMatrix cells] objectAtIndex:i] setTag:i];
        }

        [buttonMatrix selectCellAtRow:selectedRow column:selectedColumn];

        return buttonMatrix;
    },

    collectArtboardsMeta : function(selectedLayers) {
        var layersMeta = [], left, top;

        selectedLayers.iterate(function (layer) {
            layer = com.adordzheev.getParentArtboard(layer);
            left = layer.frame.x;
            top = layer.frame.y;
            layersMeta.push({
                layer: layer,
                left: left,
                top: top
            });
        });

        return layersMeta;
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
