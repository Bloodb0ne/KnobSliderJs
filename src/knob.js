;( function( $, window, document, undefined ) {

		// "use strict";
		// var self;
		var radCoef = 180 / Math.PI;
		// Create the defaults once
		var pluginName = "Knob",
			defaults = {
				position:0,
				isMoving: false,
				centerCoord: {x:0,y:0},
				currentAngle: 0,
				lastPos: {x:0,y:0},
				minAngle: 0,
				maxAngle: 360
			};

		
	   // The actual plugin constructor
		function Plugin ( element, options ) {

			this.element = element;
			this.indicator = $(this.element).find('.ui-knob-indicator');
			this.container = $(this.element).find('.ui-knob-container');

			this._defaults = defaults;
			this._name = pluginName;
			this.init(options);
			this.initEvents();
		}
		

		// Avoid Plugin.prototype conflicts
		Plugin.prototype ={
			_isPossiblePosition: function(pos){
				if(pos < this._settings.maxAngle &&
					pos > this._settings.minAngle){
					return true;
				}

				return false;
			},
			init: function(options) {
				// var self = this;
				this._settings = $.extend(true, {}, defaults, options );

				var el = $(this.element);
				var cont = this.container;
				var offset = el.offset();

				$(this.element).addClass('ui-knob');
				this._settings.centerCoord.x = el.outerWidth() / 2;
				this._settings.centerCoord.y = el.outerHeight() / 2;
				
				this._settings.lastPos.x = this._settings.centerCoord.x;
				this._settings.lastPos.y = 0;//this._settings.centerCoord.y + this.indicator.height()/2;
				this.indicator.css('margin-left',(el.outerWidth() / 2) - this.indicator.width()/2);
				
				$(this.element).trigger('knob:change',this);
				return this;
			},
			initEvents: function(){
				var self = this;
				var el = $(self.element);
				var offset = el.offset();

				el.on('mouseup mouseleave',function(e){
					self._settings.isMoving = false;
				})

				el.on('mousedown',function(e){
					self._settings.isMoving = true;
					var posData = self.calculatePosition(e);
					var angle = posData.angle;
					var orientation = posData.orientation;

				    self._settings.currentAngle = angle;

				   if(angle != NaN){
				        if(orientation < 0){
							self._settings.position += angle;
				      	}else{
							self._settings.position -= angle;
				      	}


					    if(self._isPossiblePosition(self._settings.position)){
						    self.rotate(self._settings.position);

						    self._settings.lastPos.x = e.pageX - offset.left;
						    self._settings.lastPos.y = e.pageY - offset.top;
					    }
					}
				});

				el.on('mousemove',function(e){
					if(self._settings.isMoving === true){

						var posData = self.calculatePosition(e);
						if(!posData){
							self._settings.isMoving = false;
							return;							
						}
						var angle = posData.angle;
						var orientation = posData.orientation;
						var offset = el.offset();

						 if(angle != NaN){
					    	if(orientation < 0){
					          if( self._settings.position+angle > 360 ){
					              self._settings.position = self._settings.position+angle-360;
					          }else{
					              self._settings.position = self._settings.position+angle;
					          }
					      	}else{
					          if(self._settings.position-angle < 0){
					              self._settings.position = 360 + self._settings.position-angle;
					          }else{
					              self._settings.position = 0 + self._settings.position-angle;
					          }
						    }
						    if(self._isPossiblePosition(self._settings.position)){
							    self.rotate(self._settings.position);

							    self._settings.lastPos.x = e.pageX - offset.left;
						    	self._settings.lastPos.y = e.pageY - offset.top;
						    }
						}
					}
				});
			},
			
			updateCenter:function(){
				$(this.element).trigger('knob:updateCenter',this);

				var el		=	$(this.element);
				var offset	=	el.offset();
				var oldX	=	this._settings.centerCoord.x;
				var oldY	=	this._settings.centerCoord.y;

				this._settings.centerCoord.x = offset.left	+ el.outerWidth() / 2;
				this._settings.centerCoord.y = offset.top	+ el.outerHeight() / 2;

				this._settings.lastPos.x += (oldX - this._settings.centerCoord.x);
				this._settings.lastPos.y += (oldY - this._settings.centerCoord.y);

				this.indicator.css('margin-left',(el.outerWidth() / 2) - this.indicator.width()/2);
			},
			calculatePosition:function(e){
				var offset = $(this.element).offset();
				var aX =	e.pageX - offset.left - this._settings.centerCoord.x;
				var aY =	e.pageY - offset.top - this._settings.centerCoord.y;
				var bX =	this._settings.lastPos.x - this._settings.centerCoord.x;
				var bY =	this._settings.lastPos.y - this._settings.centerCoord.y;

				var sX =	Math.sqrt((aX*aX)+(aY*aY));
				var sY =	Math.sqrt((bX*bX)+(bY*bY));

				if(sX <= 10 || sY <= 10){
					return false;
				}else{
					var dotProd = ((aX*bX)+(aY*bY))/(sX*sY);

					//The value becomes 1.000000002 and thats > 0 -_-
					if(dotProd > 1){
						dotProd = 1;
					}

					var angle = Math.acos(dotProd)*radCoef;
					var orientation = ((aX*bY)-(bX*aY));
				}
				

				return {
					angle: angle,
					orientation: orientation
				}
			},
			rotate: function(angle){
				$(this.element).trigger('knob:change',this);

				var rot = "rotate("+angle+"deg)";
				$(this.container).css("transform",rot)
					.css("-ms-transform",rot)
					.css("-moz-transform",rot)
					.css("-webkit-transform",rot)
					.css("-o-transform",rot);
			},
			getPercentage: function(){
				return this._settings.position;
			},
			setPercentage: function(percentage){
				this._settings.position = percentage;
				this.rotate(percentage);
			},
			movePercentage: function(percentage){
				this._settings.position += percentage;
				if(this._settings.position > 360){
					this._settings.position = 0;
				}
				this.rotate(this._settings.position);
			},
			getIndicator: function(){
				return this.indicator;
			},
			getIndicatorContainer: function(){
				return this.container;
			},
			getCenter: function(){
				return this._settings.centerCoord;
			}

		};


		$.fn.Knob = function(options) {
		    var args = arguments;

			if (options === undefined || typeof options === 'object') {
			   return this.each(function() {
			       if (!$.data(this, 'plugin_' + pluginName)) {
			           $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			       }
			   });

			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			   var returns;
			   this.each(function() {
			       var instance = $.data(this, 'plugin_' + pluginName);
			       if (instance instanceof Plugin && typeof instance[options] === 'function') {
			           returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
			       }

			       if (options === 'destroy') {
			           $.data(this, 'plugin_' + pluginName, null);
			       }
			   });

			   return returns !== undefined ? returns : this;
			}
	  };
		

} )( jQuery, window, document );