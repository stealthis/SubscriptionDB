 var SG = window.SG || {};
SG.Set = {
	init: function(){
		this.container		= $('section').eq(0);
		this.header			= $('header div, hgroup');
		
		this.user			= this.getURLParameter('user');

		this.adData			= [{uri:'sponsors/brit-air.png'}, {uri:'sponsors/brit-air.png'}, {uri:'sponsors/brit-air.png'}, {uri:'sponsors/brit-air.png'}];
		this.adIndex        = 0;
		this.adFrequency    = 20;

		this.constrainX		= $('html').width();
		this.colWidth 		= 192;
		this.gutter    		= 9;
		this.msg            = {top:$('div.msg.to-top'), load:$('div.msg.loading')};
		
		this.rpcIndex  		= 0;
		this.rpcIncrement 	= 20;
		
//		this.contentTypes	= 'Video,Blog,Article,Gallery';
		this.contentTypes	= $('fieldset input', this.header).serialize().replace(/=on/g, '').replace(/&/g, ',');
		
		this.duration		= 300;
		
		this.placedClips 	= [];
		
		this.fetch();	
		this.bind();
		var user = this.user;
		$('title').html( (user && user.length > 0) ? 'Recommendations for '+user : '?user=myUserName <<Add this to the end of the URL for personalized recommendations');
	},

	getURLParameter: function (name) {
    	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
	},
	
	fetch: function(count){
		
		if (this.container.data('loading') === true){
			return;
		}
		
		this.container.data('loading', true);
		
		this.container.triggerHandler({type: 'fetch.open'});

		var _this		= this,
			temp 		= $('<div/>'),
			urlBase     = urlBase = 'http://www.washingtonpost.com/rf/image_296w/';
		
		var URI = 'http://bullpen.digitalink.com/search-recommendation/recommend.jsonp?wpniuser='+this.user+'&types='+this.contentTypes+'&startat='+this.rpcIndex+'&count='+this.rpcIncrement+'&callback=?';
		//$.getJSON('http://beta.washingtonpost.com/search-recommendation/videos-test.jsonp?url=http://www.washingtonpost.com/blogs/capitals-insider/post/washington-capitals-season-review-forwards-part-ii/2012/05/25/gJQAUh15pU_blog.html&_=1337978061793&count=25&callback=?', 
		$.getJSON(URI,	
			function(data){
				var start_at	= _this.container.children().length,
					imgTotal    = 0,
					imgLoaded   = 0;
				_this.rpcIndex += _this.rpcIncrement;
				
				$.each(data.results, function(i, el){
					if (start_at + i !== 0 && (i + start_at) % _this.adFrequency === 0 && _this.adData[_this.adIndex]){
						_this.Template.ad(_this.adData[_this.adIndex])
							.fadeOut()
							.appendTo(temp);

						_this.adIndex++;
					}
					if (el.url && el.headline){
						el.urlBase = urlBase;
						_this.Template.wp(el)
							.fadeOut()
							.appendTo(temp)
					}
				});

				imgTotal = temp.find('img').length
				_this.container.append(temp.children());
				_this.container.find('img').load(
					function(){
						imgLoaded++;
						if (imgLoaded === imgTotal){
							_this.place(start_at);
							_this.container.triggerHandler({type: 'fetch.close'});
						}
					}
				)
				.error(function(){
					$(this).attr('src', 'assets/img/'+$(this).attr('title')+'.png');
				});
				
				
		});
	}
};
//$(window).ready
$(function(){SG.Set.init();if(window.chrome && !navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)){$('html').css('zoom', 1)}});