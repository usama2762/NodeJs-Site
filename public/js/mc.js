var audio, playbtn, mutebtn, seek_bar,elem,i=0,username,q,p,n;
	audio = new Audio();
	 playbtn = document.getElementById("play");
	 mutebtn = document.getElementById("mute");
	 track = $('.x-name .name')
	 xend = $('.x-track .x-end')
	 xstart = $('.x-track .x-start')
	 bar = $('.x-track #bar')
	 ball = $('.x-track #ball')
	 progress = $('.x-track #progress')
	 vol = $('.x-vol .x-range');
	 vol.val(100);
function mc(username,a,q) {
	this.username = username;
	i = a;
	this.q = q;
	audio.src = '/uploads/songs/'+username+'-'+a;
	audio.play();
	setname(i);
	playbtn.style.backgroundPosition = '-91px -2px';
}
function setname(a) {
	track.html('<a href="/profile/'+username+'">'+q[a]+'</a>')
}
vol.change(function(e) {
	audio.volume = parseFloat(vol.val()/100);
});
progress.on('click',function(e) {
	var posX = $(this).offset().left;
	var seek = e.pageX-posX;
	if(seek<0){
		seek = 0;
	}
	seek = seek*100/800;
	audio.currentTime = seek*audio.duration/100;
});
audio.onended = function() {
		a = parseInt(i);
		if(a>=8){
			a = 0;
		}
		if(a<1){
			a = 0;
		}
		i = a+1;
		setname(i);
		audio.src = '/uploads/songs/'+username+'-'+i;
		audio.play();
};
audio.ondurationchange = function () {
	seconds = audio.duration;
	sec = Math.floor( seconds );
	min = Math.floor( sec / 60 );
	min = min >= 10 ? min : '0' + min;
	sec = Math.floor( sec % 60 );
	sec = sec >= 10 ? sec : '0' + sec;
	xend.text(min + ':' + sec);
}
audio.ontimeupdate = function() {
	seconds = audio.currentTime;
	sec = Math.floor( seconds );
	min = Math.floor( sec / 60 );
	min = min >= 10 ? min : '0' + min;
	sec = Math.floor( sec % 60 );
	sec = sec >= 10 ? sec : '0' + sec;
	xstart.text(min + ':' + sec);
	var t = (seconds*100)/audio.duration;
	bar.width(t+'%');
	t = 99.5 - (seconds*100)/audio.duration;
	ball.css("right",t+'%');
}
audio.onerror = function() {
	a = parseInt(i);
	if(a>=8){
		a = 0;
	}
	if(a<=1){
		a = 0;
	}
	if(n==1){
		i = a+1;
	}
	else if(p==1){
		i = a-1;
	}
	else{
		i = a+1;
	}
	setname(i);
	audio.src = '/uploads/songs/'+username+'-'+i;
	audio.play();
}
	function play(){
		if(audio.paused){
		    audio.play();
		     playbtn.style.backgroundPosition  = '-91px -2px';
			 }
			 else {
		    audio.pause();
		     playbtn.style.backgroundPosition  = '-28px -2px';
	    }
	}
	function next() {
		n=1;
		p=0;
		a = parseInt(i);
		if(a>=8){
			a = 0;
		}
		i = a+1;
		setname(i);
		audio.src = '/uploads/songs/'+username+'-'+i;
		audio.play();
	}
	function prev() {
		n=0;
		p=1;
		a = parseInt(i);
		if(a<=1){
			a = 2;
		}
		i = a-1;
		setname(i)
		audio.src = '/uploads/songs/'+username+'-'+i;
		audio.play();
	}
