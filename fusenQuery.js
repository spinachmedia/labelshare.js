/*!
 * jQuery Plugin
 * LabelShare.js
 * 
 * Glodia inc
 */

(function($) {

	var $baseURL = "http://spinachmedia.ciao.jp/labelshare";
	var $maxWidth;
	var $maxHeight;
	var $minWidth;
	var $minHeight;


	/**
	 * 付箋API初期化
	 */
    $.fn.fusenInit = function($options){
    
    	$maxWidth  = $options.maxwidth;
		$maxHeight = $options.maxheight;
		$minWidth  = $options.minwidth;
		$minHeight = $options.minheight;
    	
    	/** Adding FusenForm **/
    	$(".fusenForm").append('<form action="'+$baseURL+'/fusenSet.php">\
    							<input id="apikey" type="hidden" name="apikey" value="'+$options.key+'" ></input>\
    							<input id="url" type="hidden" name="url" value="'+location.href+'" ></input>\
    							</form>\
    							<button id="createNote" value="Create Note">Create Note</button>');
    	getStickyNote($("#apikey").val(),$("#url").val());
    	$("#createNote").click(function() {
			createStickyNote($("#apikey").val(), $("#url").val(),"",null,null,300,30);
    	});
	}//fusenInit
	
	
	function createStickyNote($apikey,$url,$text,$x,$y,$width,$height){
		$("#createNote").after('<p id="fusen-loading">loading</p>');
		$.ajax({
		
			type: "POST",
			url: $baseURL+"/fusenSet.php",
			data: { apikey: $apikey, url: $url, text: $text, x: $x, y: $y, width: $width, height: $height }
			
		}).done(function( msg ) {
			$("#fusen-loading").remove();
			$(".fusenZone").prepend(
			
			
    			'<div class="fusen-box fusen-box-msg" style="left: 15px; width:'+$width+'px; height:'+$height+'px;" memo_id="'+msg+'">\
    				<div class="fusen">\
    					<div class="fusen-msg" style="padding-left:10px;padding-top:5px;">messages.</div>\
    				</div>\
    			</div>'
    			
    			
    		);
			

    		$(".fusen-box-msg").draggable({
    				containment: '.fusenZone',
    				stop:function(e) {
    					var position = $(this).position();
    					updateStickyNote($("#apikey").val(), $("#url").val(),$(this).attr("memo_id"),$(this).text(),position.left,position.top,$(this).width(),$(this).height());
    				}
    			});//draggable

		    $(".fusen-box-msg").dblclick(function() {
		    	var position = $(this).position();
		    	$id = $(this).attr("memo_id");
		    	$width = $(this).width();
		    	$height = $(this).height();
	 		     $(this).children(".fusen").children(".fusen-msg").wrapInner('<textarea class="fusen-text-area"></textarea>')
			          .find('textarea')
			          .focus()
			          .select()
			          .blur(function() {
			          	updateStickyNote($("#apikey").val(), $("#url").val(),$id,$(this).val(),position.left,position.top,$width,$height);
			            $(this).parent().html($(this).val());
			          });
	 		       
			});//dbclick
			    
			$(".fusen-box-msg").resizable({
    			stop:function(e) {
    				var position = $(this).position();
    				updateStickyNote($("#apikey").val(), $("#url").val(),$(this).attr("memo_id"),$(this).text(),position.left,position.top,$(this).width(),$(this).height());
    			}
    		});//resizable
    		
    		$(".fusen-box-msg").resizable({ 
			    maxHeight: $maxHeight,
			    maxWidth : $maxWidth,
			    minHeight: $minHeight,
			    minWidth : $minWidth,
			  });
			
		});
    }//function
    
    function updateStickyNote($apikey,$url,$id,$text,$x,$y,$width,$height){
		$.ajax({
			type: "POST",
			url: $baseURL+"/fusenUpdate.php",
			data: { apikey: $apikey,  url: $url, id: $id, text: $text, x: $x, y: $y, width: $width, height: $height }
		}).done(function( msg ) {
		
		});
    }//function
    
    /**
     * Get Stick Notes From Server.
     */
     function getStickyNote($apikey,$url){
		$.ajax({
			type: "POST",
			url: $baseURL+"/fusenGet.php",
			data: { 
			        apikey: $apikey,
			        url: $url
			      }
		}).done(function( json ) {
			var msg = JSON.parse(json);
			var len = msg.length;
		    for(var i=0; i < len; i++){
		      	$(".fusenZone").prepend(
    				'<div class="fusen-box" visible-flg="1" \
    				memo_id="'+msg[i].memo_id+'" \
    				style="\
    					width:'+msg[i].memo_width+'px;\
    					height:'+msg[i].memo_height+'px;\
    					top:'+msg[i].memo_y+'px;\
    					left:'+msg[i].memo_x+'px;\
    				">\
    					<div class="fusen">\
    						<div style="padding-left:10px;padding-top:5px;overflow: hidden;">\
    							'+msg[i].memo_text+'\
    						</div>\
    					</div>\
    				</div>'
    			);
    		}
    		
    		$(".fusen-box").draggable({
    				containment: '.fusenZone',
    			});//draggable
    			
    		$(".fusen-box").resizable({
    		});//resizable
    		
    		$(".fusen-box").resizable({ 
			    maxHeight: $maxHeight,
			    maxWidth : $maxWidth,
			    minHeight: $minHeight,
			    minWidth : $minWidth,
			  });
    		
    		$(".fusen-box").click(function(){
    			if($(this).attr("visible-flg") == "1"){
    				$(this).css("opacity","0.25");
    				$(this).attr("visible-flg","0");
    			}else{
    				$(this).css("opacity","0.9");
    				$(this).attr("visible-flg","1");
    			}
    		});
    		
		});//ajax
    }//function
})(jQuery);