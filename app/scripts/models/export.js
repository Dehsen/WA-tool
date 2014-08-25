'use strict';
/**
 * Originally created by Justin Marsan
 * https://github.com/justinmarsan/wcag.json
 */
angular.module('wcagReporter')
.factory('wcagReporterExport', function(evalModel, reportStorage) {

	function getJsonLd () {
		var jsonLd = {
			'@context': evalModel.context,
			type: 'evaluation',
			'id': evalModel.id
		};
		
		jsonLd.evaluationScope =  evalModel.scopeModel.exportData();
		jsonLd.auditResult =  evalModel.testModel.exportData();

		angular.extend(jsonLd, 
			evalModel.reportModel.exportData(),
			evalModel.sampleModel.exportData(),
			evalModel.exploreModel.exportData());
		
		return jsonLd;
	}
	
	var exportModel = {

		storage: reportStorage,

		saveToUrl: function () {
			return reportStorage.post(exportModel.getJson());
		},

		getJson: function () {
			return { 
				'@graph': [getJsonLd()].concat(evalModel.otherData)
			};
		},

		getString: function () {
			return angular.toJson(this.getJson(), true);
		},

		getBlob: function () {
			return exportModel.makeBlob(
				exportModel.getString(),
				'application/json;charset=utf-8'
			);
		},

		makeBlob: function (data, type) {
			// Create a blob for that URL
			var blob =  new Blob([ data ],{ type : type });
			// Take the URL
			return (window.URL || window.webkitURL).createObjectURL(blob);
		},

		getFileName: function () {
			var title = evalModel.reportModel.title;
			if (title === '') {
				title = 'evaluation';
			}
			return title.replace(/(^\-+|[^a-zA-Z0-9\/_| -]+|\-+$)/g, '')
            .toLowerCase()
            .replace(/[\/_| -]+/g, '-') + '.json';
		}
	};

	reportStorage.exportModel = exportModel;

	return exportModel;
});