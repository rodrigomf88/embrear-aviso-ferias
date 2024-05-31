/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"brcomembraer/aviso-de-ferias/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
