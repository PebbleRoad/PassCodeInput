/**
 * Plugin Name: passcodeInput
 * Author : Vinay@PebbleRoad
 * Date: 06/02/2014
 * Description: Creates a passcode entry field
 */

;(function($, window, undefined){

	var defaults = {
		
		onComplete : null,
		onChange: null,
		numbersOnly : false

	};


	/**
	 * Constructor
	 */
	
	function PassCodeInput(el, options){

		var self = this

		this.el = el

		this.$el = $(el)


		/* Inputs */

		this.$inputs = this.$el.find(':input')

		/* Passcode length */

		this.passCodeLength = this.$inputs.length


		/**
		 * Extend options
		 */
		
		this.options = $.extend({}, defaults, options)		


		/**
		 * Paste Event
		 */
		
		this.$inputs.on('paste', function(event){

			var clipBoardValue = window.clipboardData? 
						window.clipboardData.getData('Text') : 
						event.originalEvent.clipboardData.getData('text/plain'),
				clipBoardArray = clipBoardValue.split('')

			/**
			 * Numbers only
			 */
			
			if(self.options.numbersOnly && isNaN(clipBoardValue)){
				
				event.preventDefault()

				return
			}
			
			/* Loop through inputs */

			self.$inputs.each(function(index, el){
				
				this.value = clipBoardArray[index]

			});


			/* Trigger onPaste Handler */

			self.$el.trigger('passcodeInput.paste', self.getvalue())


			/* Trigger Change event */

			$.isFunction(self.options.onChange) && self.options.onChange.call(self, self.getvalue())

			/* Trigger onComplete */
			
			$.isFunction(self.options.onComplete) && self.options.onComplete.call(self, self.getvalue())

			/* Prevent the default action */

			event.preventDefault()

		})



		/**
		 * Keyup Event
		 */
		
		.on('keyup', function(event){


			/**
			 * Numbers Only
			 */
			
			if(	
				self.options.numbersOnly && 
				event.which != 8 &&
				event.which != 16 && 
				isNaN(String.fromCharCode(event.which))
				){				

				//if(typeof event.target.value == 'string') this.value = ''
				

				event.preventDefault()

				return 
			}

			/* Check if tab + shift is pressed */

			if(event.shiftKey || event.which == 16)  return         


			/* Continue */
			
			var $this = $(this),
				$next = $this.next(),
				val = this.value


			/**
			 * Trigger Passcode change
			 */
			
			$.isFunction(self.options.onChange) && self.options.onChange.call(self, self.getvalue())


			/**
			 * Check if we reached the end of passcode
			 */

			if(!$next.length) {
				
				/**
				 * On Complete Callback
				 */
				
				$.isFunction(self.options.onComplete) && self.options.onComplete.call(self, self.getvalue())

				return
			}


			
			/**
			 * Focus the next field
			 */
			
			if(this.value && event.which != 9) {

				$next.focus().select()

			}
		})




	}



	/**
	 * Get Values
	 */
	

	PassCodeInput.prototype.getvalue = function(){

		var token = ''

		this.$inputs.each(function(){

			token+= this.value

		});        

		return token
	}



	/**
	 * Registers the plugin
	 */
	
	$.fn.extend({

		passcodeInput: function(options){

			return this.each(function(){

				var $this = $(this),
					passcodeInput = $this.data('passcodeInput')


				if(!passcodeInput) $this.data('passcodeInput', new PassCodeInput(this, options))

			})
		}

	});



})(jQuery, window);