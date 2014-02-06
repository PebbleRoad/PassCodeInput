/**
 * Plugin Name: passcodeInput
 * Author : Vinay@PebbleRoad
 * Date: 06/02/2014
 * Description: Creates a passcode entry field
 */

;(function($, window, undefined){

	var defaults = {
		
		onComplete : null,		

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

			var clipBoardValues = window.clipboardData? 
						window.clipboardData.getData('Text').split('') : 
						event.originalEvent.clipboardData.getData('text/plain').split('')

			
			/* Loop through inputs */

			self.$inputs.each(function(index, el){
				
				this.value = clipBoardValues[index]

			});


			/* Trigger onPaste Handler */

			self.$el.trigger('passcodeInput.paste', [clipBoardValues.join('')])


			/* Trigger onComplete */
			
			self.options.onComplete.call(self, self.getvalue())

			/* Prevent the default action */

			event.preventDefault()

		})



		/**
		 * Keyup Event
		 */
		
		.on('keyup', function(event){

			var focusPrevious = (event.shiftKey || event.which == 16) ? true: false;

			if(focusPrevious) return         
			
			var $this = $(this),
				$next = $this.next(),
				val = this.value


			/**
			 * Trigger Passcode enter
			 */
			
			self.$el.trigger('passcodeInput.paste', self.getvalue())


			/**
			 * Check if we reached the end of passcode
			 */

			if(!$next.length) {
				
				/**
				 * On Complete Callback
				 */
				
				self.options.onComplete.call(self, self.getvalue())

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