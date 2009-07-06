/*
 * OptionList 1.1 - jQuery Plugin
 * http://www.smartango.com/blog/jquery-optionlist-plugin
 * Copyright (c) 2009 Daniele Cruciani
 * Dual licensed under the MIT and GPL licenses
 */
/*
  option with default is:
	    method: 'install',
	    mode:'multiple', // or 'single'
	    express: 1, // exclude present
	    target: '#optionlist',
	    input:'#iptvalues',
	    items:{},
	    optional: $("<input>").attr("type","text"),
	    autocompletedata: '',
	    alertfun: function(msg){alert(msg);},
	    preset:[]
*/

;(function($){

    $.optionlist={msg : {
	nocomma:"Non inserire virgole",
	nonumber:"Il valore non puo' essere un numero",
	express:"Elemento gia' presente nella lista"
    }};

    optionlist = function(o) {
	this.avail = o.avail;
	this.o = o;

	this.start = function(){
	    if (typeof o.preset == 'object' &&
		o.preset instanceof Array) {
		for(var i=0;i<this.o.preset.length;i++) {
		    this.add(this.o.preset[i]);
		}
	    }
	    this.update()
	    this.update_avail();
	}

	this.update = function() {
	    var idlist = $(this.o.target).data("idlist");
	    if (idlist) {
		if (this.o.mode != 'single'){
		    var ol = this;
		    $(this.o.input).val(idlist);
		    var idarr = idlist.split(",");
		    var html = "";
		    $(ol.o.target).html('');
		    for (var i=0;i< idarr.length;i++) {
			var id = idarr[i];
			var item = $("<div>").addClass("optionlist_item")
			    .append(
				$("<span>").html(this.o.items[id])
				//this.o.items[id]
			    )
			    .append(
				$("<a>").attr('title','rimuovi '+ this.o.items[id])
				    .addClass("optionlist_rmitm").html("x")
				    .attr("id","optionlist_rmitm_"+id)
				    .click(function() {
					var myid = this.id.replace("optionlist_rmitm_","");
					ol.remove(myid);
					return false;
				    })
			    )
			    .hover(function() { // in
				var pos = $(this).position();
				var width = $(this).children("span").width();
				$(this).children(".optionlist_rmitm").css('top',pos.top)
				    .css('left',pos.left+width-5).show();
			    },
				   function() { // out
				       $(this).children(".optionlist_rmitm").hide();
				   });
			$(this.o.target).append(item);
		    }
		    var clear = $("<div>").css("clear","both");
		    $(this.o.target).append(clear);
		} else { // mode == single
		    $(this.o.input).val(idlist);
		    if (this.o.targetmode == 'val') {
			$(this.o.target).val(this.o.items[idlist]);
		    } else {
			$(this.o.target).html(this.o.items[idlist]);
		    }
		}
	    } else {
		$(this.o.input).val("");
		$(this.o.target).html('');
	    }
	};

	this.add=function(id){
	    if (this.o.mode != 'single') {
		var funcz = $(this.o.target).data("idlist");
		var funcarr = [];
		if(funcz)funcarr = funcz.split(",");
		funcarr.push(id);
		funcz = funcarr.join(",");
		$(this.o.target).data("idlist",funcz);
		$(this.o.input).val(funcz);
	    } else { // mode single
		//var funcz = $(this.o.target).data("idlist");
		$(this.o.target).data("idlist",id.toString());
		$(this.o.input).val(id);
	    }
	    this.update()
	    this.update_avail();
	};

	this.remove=function(id) {
	    var funcz = $(this.o.target).data("idlist");
	    var nfuncz = funcz.replace(id,"")
		.replace(",,",",")
		.replace(/^,/,"").replace(/,$/,"");
	    $(this.o.target).data("idlist",nfuncz);	  
	    $(this.o.input).val(nfuncz);
	    this.update();
	    this.update_avail();
	};

	this.empty=function() {
	    $(this.o.target).data("idlist","");
	    $(this.o.input).val('');
	}

	this.update_avail=function() {
	    var idlist = $(this.o.target).data("idlist");
	    idlist = ","+idlist+",";
	    var ol = this;
	    this.avail.html("");
	    $.each(this.o.items,function(i,v) {
		var match = ","+i+",";
		if (!idlist.match(match)) {
		    var ael = $("<a>").html(v).click(function(){
			ol.add(i);
			ol.o.avail.hide();
			$("#optionlist_overlay").remove();
		    }).addClass("optionlist_additem");
		    ol.avail.append(ael);
		    ol.avail.append($("<br />"));
		}
	    });
	    if(this.o.optional) {
		var ol = this;
		ol.o.optional.val('');
		opt = ol.o.optional;
		act = $("<button />").click(function(){
		    var val = ol.o.optional.val();
		    var msg = $.optionlist.msg;
		    if (val.match(",")) {
			ol.o.alertfun(msg.nocomma);
			return false;
		    }
		    if (val.match(/^[0-9]+$/)) {
			ol.o.alertfun(msg.nonumber);
			return false;
		    }
		    if (ol.o.express) {
			var matched=false;
			$.each(ol.o.items, function(k,v) {
			    if (val == v) {
				ol.o.alertfun(msg.express);
				matched = true;
			    }
			    });
			if (matched) return false;
		    }
		    if(val) {
			ol.o.items[val]=val;
			ol.add(val);
		    } else {
			return false;
		    }
		    ol.o.avail.hide();
		    $("#optionlist_overlay").remove();
		    return false;
		}).html("+");
		this.avail.append(opt).append(act);
		if (ol.o.autocompletedata) {
		    opt.autocomplete(ol.o.autocompletedata);
		}
	    }
	}
	this.getAvailNum = function() {
	    var idlist = $(this.o.target).data("idlist");
	    idlist = ","+idlist+",";
	    var count=0;
	    $.each(this.o.items,function(i,v) {
		if(!idlist.match(","+i+",")) count++;
	    });
	    return count;
	}
    }

    getDimensions = function () {
        var el = $(window);
	
        // fix a jQuery/Opera bug with determining the window height
        var h = $.browser.opera && $.browser.version > '9.5' && $.fn.jquery <= '1.2.6' ?
            document.documentElement['clientHeight'] : 
            el.height();
	
        return [h, el.width()];
    }

    createavail = function(el) {
	var pos=el.position();
	var avail = $("<div/>").addClass("optionlist_itemlist")
	.css({position:'absolute',
	      top:pos.top,
	      left:pos.left,
	      display:'none'});
	el.before(avail);
	return avail;
    }

    clickevent = function(e) {
	var o  = e.data;
	var ol = o.ol;
	var optional = (typeof o.optional == 'object');
	if(!((ol.getAvailNum() > 0) || optional)) return;
	var w = getDimensions();
	$("<div>").attr("id","optionlist_overlay")
	    .css({zIndex:3000,
		  position:'fixed',
		  height:w[0],
		  width: w[1],
		  top:0,
		  left:0
		 })
	    .click(function(){
		$(this).remove();
		o.avail.hide();
	    }).appendTo("body");
	o.avail.show();
	return false;	
    }

$.fn.optionlist=function(opt) {
    var o = $.extend({
	    method: 'install',
	    mode:'multiple',
	    express: 1,
	    target: '#optionlist',
	    targetmode: 'html',
	    input:'#iptvalues',
	    items:{},
	    optional: $("<input>").attr("type","text"),
	    autocompletedata: '',
	    alertfun: function(msg){alert(msg);},
	    preset:[]
    },opt);
    if(o.items == null) o.items={};
    //if(typeof o.preset != 'array') o.preset =[];
    o.lelement = this;

    switch(o.method) {
    case 'install':
	// remove if present
	if (o.lelement.data('optionlist')) {
	    var curo = o.lelement.data('optionlist')

	    // clean target container
	    var ol = new optionlist(curo);
	    ol.empty();
	    ol.start();

	    $(curo.target).removeData('idlist');
	    curo.avail.remove();
	    o.lelement.removeData('optionlist');
	}
	o.lelement.unbind('click',clickevent);
	// install
	o.avail = createavail(this);
	o.lelement.data('optionlist',o);
	var ol = new optionlist(o);
	ol.start();
	o.ol = ol;
	this.bind("click",o,clickevent);
	//$(o.target).bind("click",o,clickevent);
	return o.lelement;
	break;
    case 'destroy':
	if (o.lelement.data('optionlist')) {
	    var curo = o.lelement.data('optionlist')
	    $(curo.target).removeData('idlist');
	    curo.avail.remove();
	    o.lelement.removeData('optionlist');
	}
	o.lelement.unbind('click',clickevent);
	return o.lelement;
	break;
    case 'loaditems':
	if(o.lelement.data('optionlist')) {
	    var items = o.items;
	    var curo = o.lelement.data('optionlist');
	    curo.items = items;
	    curo.preset = o.preset;
	    o.lelement.data('optionlist',curo);
	    var ol = new optionlist(curo);
	    ol.empty();
	    ol.start();    
	}
	return o.lelement;
	break;
    case 'emptylist':
	if(o.lelement.data('optionlist')) {
	    o = o.lelement.data('optionlist');
	    o.preset = [];
	    var ol = new optionlist(o);
	    ol.empty();
	    ol.start();
	}
	return o.lelement;
	break;
    }

}
})(jQuery);
