;(function ($, window, document, undefined) {

"use strict";

var locale = {

	weekDays : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
	minutes : 'Minutes',
	hours : 'Hours'
};

var states = {
	
	hidden:{
		enter:function(){
			this.$table.hide();
		},
		exit:function(){
			this.$table.show();
		},
	},
	
	date:{
		
		enter:function(){
			
			this.$table.addClass('seven column');
			
			var weekDays = this.locale.weekDays;
			
			for(var i=0;i<7;i++){
				
				this.$header.append($('<th>',{
					class:'center aligned',
					html:weekDays[i]
				}));
			}
			
			var self = this;
			var date = 0;
			var startOfMonth = moment(this.date).date(1).day();
			var daysInMonth = this.date.daysInMonth();
			
			if(!startOfMonth){
				startOfMonth = 6;
			}else{
				startOfMonth--;
			}
			
			for(var i=0;i<6;i++){
			
				var $tr = $('<tr>');
				
				for(var j=0;j<7;j++){
					
					if(!date && j === startOfMonth){
						date++;
					}
					
					if(date && date <= daysInMonth){
					
						$tr.append($('<td>',{
						
							class:'center aligned',
							
							'data-id':date,
							
							html:$('<div>',{
								
								class:'active item',
								
								html:date,
								
							}),
							
							on:{
								click:function(event){
									
									var id = $(this).data('id');
									
									self.date.date(id);
									self.refreshDate();
									self.transitionTo('hidden');
								},
								
								mouseover:function(){
									
									var $this = $(this);
									
									if(!$this.hasClass('active')){
										$this.addClass('active hovering');
									}
								},
								
								mouseout:function(){
									
									var $this = $(this);
									
									if($this.hasClass('hovering')){
									
										$this.removeClass('active hovering');
									}
								}
								
							}
						}).css('cursor','pointer'));
						
						date++;
						
					}else{
						$tr.append($('<td>',{
							html:'&nbsp'
						}));
					}
				}
				
				this.$body.append($tr);
			}
			
			this.select(this.date.date());
		},
		
		exit:function(){
			
			this.$table.removeClass('seven column');
			this.$header.children().remove();
			this.$body.children().remove();
		},
	},
	
	hour:{
	
		enter:function(){
		
			this.$table.addClass('4 column');
			
			this.$header.append($('<th>',{
				class:'center aligned',
				colspan:4,
				html:this.locale.hours
			}));
			
			var self = this;
			var hour = 0 ;
		
			for(var i=0;i<6;i++){
			
				var $tr = $('<tr>');
				
				for(var j=0;j<4;j++){
					
					var str = "";
					
					if(hour < 10){
						str = "0" + hour + ":00";
					}else{
						str = hour + ":00";
					}
					
					var $td = $('<td>',{
						class:'center aligned',
						html:str,
						'data-id':hour,
						on:{
							click:function(event){
							
								var id = $(event.target).data('id');
								self.date.hour(id);
								self.refreshTime();
								self.transitionTo('minute');
							},
							
							mouseover:function(){
								
								var $this = $(this);
								
								if(!$this.hasClass('active')){
									$this.addClass('active hovering');
								}
							},
							
							mouseout:function(){
								
								var $this = $(this);
								
								if($this.hasClass('hovering')){
								
									$this.removeClass('active hovering');
								}
							}
						}
					}).css('cursor','pointer');
					
					$tr.append($td);
					
					hour++;
				}
				
				this.$body.append($tr);
			}
			
			this.select(this.date.hour());
		},
		
		exit:function(){
			this.$table.removeClass('four column');
			this.$header.children().remove();
			this.$body.children().remove();
		},
	},
	
	minute:{
	
		enter:function(){
		
			this.$header.append($('<th>',{
				class:'center aligned',
				colspan:2,
				html:this.locale.minutes
			}));
			
			var self = this;
			var minute = 0 ;
		
			for(var i=0;i<6;i++){
			
				var $tr = $('<tr>');
				
				for(var j=0;j<2;j++){
					
					var $td = $('<td>',{
						class:'center aligned',
						html:minute,
						'data-id':minute,
						on:{
							click:function(){
								
								var id = $(event.target).data('id');
								self.date.minute(id);
								self.refreshTime();
								self.transitionTo('hidden');
							},
							
							mouseover:function(){
								
								var $this = $(this);
								
								if(!$this.hasClass('active')){
									$this.addClass('active hovering');
								}
							},
							
							mouseout:function(){
								
								var $this = $(this);
								
								if($this.hasClass('hovering')){
								
									$this.removeClass('active hovering');
								}
							}
						}
					}).css('cursor','pointer');
					$tr.append($td);
					
					minute+=5;
				}
				this.$body.append($tr);
			}
			
			this.select(this.date.minute());
		},
		
		exit:function(){
			this.$header.children().remove();
			this.$body.children().remove();
		},
	}
	
};

$.fn.datetimepicker = function(parameters) {

	var self = this;
	
	this.dateFormat = 'MMM Do, YYYY';
	
	this.timeFormat = 'HH:mm';
	
	this.locale = (parameters && parameters.locale) || locale;
	
	this.onChange = parameters.onChange;
	
	this.init = function(){
		
		var now = moment().seconds(0).milliseconds(0);
		var minute = now.minute();
		var date = parameters.date;
		
		now.minute(minute + (5 - (minute % 5)));
		
		if(!date){
			date = now;
		}
		
		this.date = date;

		var $dateStr = $('<span>');
		
		var $dateBtn = $('<div>',{
			
			class:'ui labeled icon button',
			
			html:$('<i>',{
				class:'calendar icon'
				
			}),
			
			on:{
				
				click:function(){
				
					self.transitionTo('date');
				}
			}
		}).append($dateStr);
	
		var $timeStr = $('<span>');
		
		var $timeBtn = $('<div>',{
			
			class:'ui labeled icon button',
			
			html:$('<i>',{
				class:'time icon'
			}),
			
			on:{
				
				click:function(){
					
					self.transitionTo('hour');
				}
			}
		}).append($timeStr);
		
		var $header = $('<tr>',{
			
		});
		
		var $thead = $('<thead>',{
			html:$header
		});
		
		var $body = $('<tbody>',{
		});
		
		var $table = $('<table>',{
			
			class:'ui small compact table'
			
		}).append($thead,$body);
		
		this.$dateStr = $dateStr;
		this.$timeStr = $timeStr;
		this.$table = $table;
		this.$header = $header;
		this.$body = $body;
		
		this.append($dateBtn,$timeBtn);
		
		$timeBtn.after($table);
		$table.hide();
		
		this.refreshDate();
		this.refreshTime();
		
		this.transitionTo('hidden');
	};
	
	this.refreshDate = function(){
		
		this.$dateStr.html(this.date.format(this.dateFormat));
		this.onChange(moment(this.date));
	};
	
	this.refreshTime = function(){
		
		this.$timeStr.html(this.date.format(this.timeFormat));
		this.onChange(moment(this.date));
	};
	
	this.toggleTable = function(){
		
		var $table = this.$table;
					
		if($table.is(':visible')){
		
			$table.hide();
		}else{
		
			$table.show();
		}
	};
	
	this.transitionTo = function(nextState){
		
		if(this.currentState){
			states[this.currentState].exit.call(this);
		}
		
		if(this.currentState == nextState){
			
			this.transitionTo('hidden');

		}else{
		
			states[nextState].enter.call(this);
			this.currentState = nextState;
		}
	};
	
	this.select = function(id){
		this.$body.find('td').removeClass('active');
		this.$body.find('[data-id="'+id+'"]').addClass('active');
	};
	
	this.init();
	
	return this;
};

})( jQuery, window , document );