'use strict';

var $ = require( "jquery" ),
	settingsConvertor = require( "settings-convertor" );

module.exports = function( mod ) {

	mod.controller( "NoiseCtrl", [ "$scope", "synth", function( $scope, synth ) {
		var self = this,
			settingsChangeHandler = function() {
				synth.noiseSettings = {
					enabled: self.enabled,
					level: settingsConvertor.transposeParam( self.level, settings.level.range ),
					type: self.type
				};
			},
			settings = synth.noiseSettings;

		self.enabled = settings.enabled;
		self.level = settingsConvertor.transposeParam( settings.level, [ 0, 100 ] );
		self.type = settings.type;

		[
			"noise.enabled.value",
			"noise.level.value",
			"noise.type.value"
		].forEach( function( path ) {
			$scope.$watch( path, settingsChangeHandler );
		} );

		// fix problem with bad init state
		$( ".noise webaudio-switch" )[ 0 ].setValue( self.enabled.value );

		// fix the lack of attr 'value' update
		$( ".noise webaudio-switch" )
			.add( ".noise webaudio-knob" )
			.add( ".noise webaudio-slider" )
		.on( "change", function( e ) {
			if ( parseFloat( $( e.target ).attr( "value" ) ) !== e.target.value ) {
				$( e.target ).attr( "value", e.target.value );
			}
		} );

	} ] );

	mod.directive( "noise", [ "$templateCache", function( $templateCache ) {
		return {
			restrict: "E",
			replace: true,
			template: $templateCache.get( "noise.html" )
		};
	} ] );

};