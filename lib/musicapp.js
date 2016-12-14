/*
 musicapp.js
   this is very ugly code!!
	 I need to rewrite it to make it easy to swap out other quartets...


*/


	Videos= [

	  {id: 'Cantus', src: 'video/Cantus.mp4', part:'Cantus'},
		{id: 'Altus', src: 'video/Altus.mp4', part:'Altus'},
		{id: 'Tenor', src: 'video/Tenor.mp4', part:'Tenor'},
		{id: 'Bassus' , src: 'video/Bassus.mp4', part:'Bassus' },
		{id: 'Master', src: 'video/Master.mp4', part:'All' }

    ];

		Parts = [
			{id: 'CantusPart', src: 'video/cantus.mov', part:'Cantus'},
			{id: 'AltusPart', src: 'video/cantus.mov', part:'Altus'},
			{id: 'TenorPart', src: 'video/cantus.mov', part:'Tenor'},
			{id: 'BassusPart' , src: 'video/cantus.mov', part:'Bassus' },
			{id: 'AllParts', src: 'video/fullscore.mov', part:'All' }
		];

		findPart = function(id){
			switch(id){
				case "Cantus": return("#CantusPart");
				case "Altus": return("#AltusPart");
				case "Tenor": return("#TenorPart");
				case "Bassus": return("#BassusPart");
				case "#Master": case "Master": return("#AllParts");
				default: return("Error");

			}
		}


	function loadUser() {
	  var template1 = $('#template1').html();
	  Mustache.parse(template1);   // optional, speeds up future uses
	  var rendered = Mustache.render(template1, {videos: Videos});
	  $('#target1').html(rendered);
	  $("Master").attr("muted","false");

		var template0 = $('#template0').html();
		Mustache.parse(template0);
		var rendered0 = Mustache.render(template0, {parts: Parts});
	  $('#target0').html(rendered0);

	  var template2 = $('#template2').html();
	  Mustache.parse(template2);   // optional, speeds up future uses
	  var rendered = Mustache.render(template2, {videos: Videos});
	  $('#target2').html(rendered);

	}

	loadUser();

    show = function (id){
		$(".view").attr("width","20%");
		$(id).attr("width","75%");
		visible.mute();
		visible = Popcorn(id);
		visible.unmute();
	}

	show2 = function (id){
		console.dir(id);
		$(".view").attr("width","0%");
		$(id).attr("width","100%");
		console.log("the id = "+id);
		console.log("show2("+JSON.stringify(id)+")");
		visible.mute();
		visible = Popcorn(id);
		visible.unmute();
		var zz = id.id || id;
		console.log("zz= "+zz);
		var part = findPart(id.id || id);

		console.log("id="+id+" id.id="+id.id+", part= "+part);
		$(part).attr("width","100%");
		Popcorn(part);
	}

	show3 = function (id){
		$(".view").attr("width","0%");
		$(id).attr("width","100%");
		console.log("the id = "+id);
		console.log("show3("+JSON.stringify(id)+")");
		//visible.mute();
		//visible = Popcorn(id);
		//visible.unmute();
		//var part = findPart(id);

		//console.log("id="+id+", part= "+part);
		//$(part).attr("width","100%");
	}

	showAll = function(){
		$(".view").attr("width","24%");
		$("#Master").attr("width","100%");
		visible.mute();
		visible = Popcorn("#Master");
		visible.unmute();
	}

	mainVideo = Popcorn("#FullScore");
	//mainAudio = Popcorn("#AllParts");

	var popVideos =Videos.map(function (obj) {
		var pop = Popcorn("#"+obj.id);
		return pop ;
	})

	var partVideos = Parts.map(   //Parts
		function (obj) {
			console.dir(obj); console.log("#"+obj.id);
			var pop2 = Popcorn("#"+obj.id);
			return pop2 ;
	  }
	);

	popVideos = popVideos.concat(partVideos);

	visible = popVideos[0];
	visible.unmute();

	scrub = $("#scrub");
	loadCount = 0;
	events = "play pause timeupdate seeking".split(/\s+/g);

	// iterate both media sources
	Popcorn.forEach( popVideos, function( media, type ) {

	    // when each is ready...
	    media.on( "canplayall", function() {

	        // trigger a custom "sync" event
	        this.emit("sync");

	        // set the max value of the "scrubber"
	        scrub.attr("max", this.duration() );

	        // Listen for the custom sync event...
	    }).on( "sync", function() {

	        // Once all items are loaded, sync events
	        if ( ++loadCount == 5 ) {
				visible.unmute();
				//popVideos[0].unmute();
	            // Iterate all events and trigger them on the video B
	            // whenever they occur on the video A
	            events.forEach(function( event ) {

	                // look for events on the main video controller
	                  mainVideo.on(event, function(){
	                    // Avoid overkill events, trigger timeupdate manually
	                    if ( event === "timeupdate" ) {
	                        if ( !this.media.paused ) {
	                            return;
	                        }
	                        for(i=0 ; i<popVideos.length; i++){
	                            popVideos[i].emit("timeupdate");
	                        }

	                        // update scrubber
	                        scrub.val( this.currentTime() );

	                        return;
	                    }


	                    if ( event === "seeking" ) {
	                        for(i=0;i<popVideos.length;i++){
	                            popVideos[i].currentTime( this.currentTime());
	                        }

	                    }

	                    if ( event === "play" || event === "pause" ) {
	                      //if (event == "pause"){
	                        for(i=0;i<popVideos.length;i++){
	                            popVideos[i][ event ] ();
	                        }


	                    }
	                });
	            });
	        }
	    });
	});


	scrub.bind("change", function() {
	    var val = this.value;

	        for(i=0;i<popVideos.length;i++){
	        popVideos[i].currentTime( val);
	         }

	});

	// With requestAnimationFrame, we can ensure that as
	// frequently as the browser would allow,
	// the video is resync'ed.

	var start = null;

	sync = function (timestamp) {
		if (!start) start = timestamp;
		var progress = timestamp-start;

		if (progress <1000) { return;}
		start = timestamp;

	    var t = popVideos[0].currentTime();
	    for ( i=1; i<popVideos.length;i++){
	        if (popVideos[i].media.readyState === 4 ) {
	            popVideos[i].currentTime( t);
	        }
	    }
		window.requestAnimationFrame(sync);

	}

	show2("#Master");
	$("#AllParts").attr("width","100%");


	window.requestAnimationFrame(sync)
