var app = angular.module('myApp', ['ui.router']).controller('namesCtrl', function($scope,$http) {

			$("#head").show();

				$http.get('/api/index')
				.then(function(response) {
					if(!response.data.error){
						$scope.newrelease = response.data;
					}
				},function(response) {
					console.log("err index");
				})

				$scope.viewbtn = "View All"
				$scope.viewall = function() {
					if($scope.viewbtn=="View All"){
						$(".scrollhere").addClass('pre-scrollable');
						$scope.viewbtn = "View less"
						$http.get('/api/index/all')
						.then(function(response) {
							if(!response.data.error){
								$scope.newrelease = response.data;
							}
						},function(response) {
							console.log("err index");
						})
					}
					else{
						$(".scrollhere").removeClass('pre-scrollable');
						$scope.viewbtn = "View All"
						$http.get('/api/index/')
						.then(function(response) {
							if(!response.data.error){
								$scope.newrelease = response.data;
							}
						},function(response) {
							console.log("err index");
						})
					}
				}//end of viewall function

					$http.get('/api/index/moments')
					.then(function(response) {
						if(!response.data.error){
							$scope.moments = response.data;
						}
					},function(response) {
						console.log("err");
					})
					$scope.three = function(songs) {
						var arr = [];
						var c = 0;
						for(var k in songs){
							if(c>2){
								break;
							}
							c+=1;
							if(songs[k]!=""){
								arr.push(songs[k]);
							}
						}
						return arr;
					}
				$scope.play = function(i,x) {
						// audio = new Audio();
						console.log("click");
						for(var k in $scope.moments[i].songs){
							if($scope.moments[i].songs[k]==x){
								audio.src = '/uploads/songs/'+$scope.moments[i].username;
								audio.play();
							}
						}
						playbtn.style.backgroundPosition = '-91px -2px';
				}

				$scope.productmodal = function() {
								 $('#productmodal').modal('toggle')
				}

				$scope.formmodal = function() {
								 $('#myModal').modal('toggle')
				}
				$scope.profilelink = "/"
				$scope.loginerror = false;
        $scope.username = ""
        $scope.logged = true;
        $http.get('/api/auth')
        	.then(function(res) {
            if(res.data.logged==true){
                $scope.logged = true;
                $scope.username = res.data.username
								$scope.profilelink = '/'+res.data.type
            }
            else{
                $scope.logged = false;
            }
        });
        $scope.loginform=function(){
            var user=$scope.login.username;
            var pass=$scope.login.password;
            var data = {
                'username': $scope.login.username,
                'password':$scope.login.password,
                'type':$scope.login.type
            }
            var config = {
                headers : {
                    // 'Content-Type': 'application/x-www-form-urlencoded;'
                    'Content-Type': 'application/json;'
                }
            }
            $http.post('/api/users/login',data)
           .then(
               function(response){
                $scope.login.username = "";
                $scope.login.password = "";
                 // success callback
                 if(response.data.logged==true){
                    $scope.logged = true
                    $scope.username = response.data.username
										if(response.data.type=="artist"){
											$scope.profilelink = "/artist"
										}
										if(response.data.type=="user"){
											$scope.profilelink = "/user"
										}
                    $('#myModal').modal('toggle')
                    $scope.loginerror = false;
                 }
                 else{
                    $scope.loginerror = true;
                    $scope.loginerrormsg = "Invalid Username/Password"
                 }
               },
               function(response){
                 // failure callback
                $scope.loginerror = true;
                $scope.loginerrormsg = "Server Error"
               }
            );
        }
				$scope.signup = {}
				$scope.signup.form = function() {
					var data = {
							'username': $scope.signup.username,
							'password':$scope.signup.password,
							'type':$scope.signup.type,
							'name': $scope.signup.name,
							'email': $scope.signup.email,

					}
					$http.post('/api/users/register',data)
				 .then(
						 function(response){
							 $scope.signup.username = "";
							 $scope.signup.name = "";
							 $scope.signup.email = "";
							 $scope.signup.password = "";
							 $scope.signup.type = "";
							 // success callback
							 console.log("suc register")
							 console.log(response)
							 if(response.data.msg){
									// $('#myModal').modal('toggle')
									$scope.signup.loginerror = false;
							 }
							 else{
									$scope.signup.loginerror = true;
									$scope.signup.loginerrormsg = "Please check everythin again."
							 }
						 },
						 function(response){
							 // failure callback
							 console.log("err")
							 console.log(response)
							$scope.signup.loginerror = true;
							$scope.signup.loginerrormsg = "Server Error! Try again later"
						 }
					);
				}//signup function end


});

app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
	// $locationProvider.html5Mode(true)
	// For any unmatched url, redirect to /state1
	// $urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	// Now set up the states
	$stateProvider

		.state('home',{
			url:"/",
			templateUrl:"artists.html",
			controller: function() {
				$("#head").show();
				$("#mainNav").addClass("affix-top");
				$("#mainNav").removeClass("affix");

			}
		})
		.state('artist', {
			url: "/artist",
			templateUrl: "/artist.html",
			controller: artistProfilectrl
		})

		.state('user', {
			url: "/user",
			templateUrl: "/user.html",
			controller: userProfileCtrl
		})

		.state('profile', {
			url: "/profile/:name",
			templateUrl: "/profile.html",
			 controller: artistCtrl
		})

});


function artistProfilectrl($scope,$http) {
		$("#head").hide();
		$("#mainNav").removeClass("affix-top");
		$("#mainNav").addClass("affix");

		$scope.pwd = {}
		$scope.pwd.o = ""
		$scope.pwd.btn = "Submit"

		$scope.pwd.save = function() {
			if($scope.pwd.o!=$scope.pwd.n){
				if($scope.pwd.n==$scope.pwd.c){
					var data = {
							pass: $scope.pwd.o,
							newpass: $scope.pwd.n
					}
					$http.post('/api/artistprofile/pass',data)
					.then(function(response) {
						if(!response.data.error){
								$scope.pwd.err = "Saved"
						}
						else {
							$scope.pwd.err = "Something went wrong! please check again"
						}
					},function(response) {
						$scope.pwd.err = "Something went wrong! please check again"
						console.log("pass err",response);
					});

				}
			}
		}

		var dummyprofile;
		$scope.profile={}
		$scope.profileC={}
		$scope.profileC.btn = "Edit";
		$scope.profileC.cancel = false
		$http.get('/api/artistprofile/personal')
		.then(function(response) {
			 if(!response.data.error){
				 var p = response.data;
				 $scope.profile.name = p.name;
				 $scope.profile.email=p.email;
				 $scope.profile.genre=p.song_type;
				 $scope.profile.contact=p.contact;
				 $scope.profile.band = p.band;
				 dummyprofile = p;
			 }
			 if(response.data.error){
				 $scope.profile.error = "Something went wrong!! Please contact us"
			 }
	 },function(response) {
		 $scope.profile.error = "Something went wrong!! Please try again."
	 });

		$scope.profileC.edit = function(){
			if($scope.profileC.btn=="Edit"){
				$scope.profileC.btn = "Save";
				$scope.profileC.cancel = true;
				$("#name").attr('disabled', !$("#name").attr('disabled'));
				$("#email").attr('disabled', !$("#email").attr('disabled'));
				$("#genre").attr('disabled', !$("#genre").attr('disabled'));
				$("#band").attr('disabled', !$("#band").attr('disabled'));
				$("#contact").attr('disabled', !$("#contact").attr('disabled'));
			}
			else if($scope.profileC.btn=="Save" ){
				var data = {
					'name': $scope.profile.name,
					'email': $scope.profile.email,
					'song_type': $scope.profile.genre,
					'band': $scope.profile.band,
					'contact': $scope.profile.contact
				}
				$http.post('/api/artistprofile/personal',data)
				.then(function(response) {
					if(!response.data.error){
						$scope.profileC.btn="Edit";
						$scope.profileC.cancel=false;
						dummyprofile.name=$scope.profile.name;
						dummyprofile.email=$scope.profile.email;
						dummyprofile.song_type=$scope.profile.genre;
						dummyprofile.band=$scope.profile.band;
						dummyprofile.contact=$scope.profile.contact;
						$("#name").attr('disabled', !$("#name").attr('disabled'));
						$("#email").attr('disabled', !$("#email").attr('disabled'));
						$("#genre").attr('disabled', !$("#genre").attr('disabled'));
						$("#band").attr('disabled', !$("#band").attr('disabled'));
						$("#contact").attr('disabled', !$("#contact").attr('disabled'));
						console.log("updated",response.data);
					}
					else {
						$scope.profile.error = "Something went wrong!! Please contact us"
						console.log("error",response);
					}
				},function(response) {
					$scope.profile.error = "Something went wrong!! Please Try again"
				})
			}
		}
		$scope.profileC.cancelbtn = function(){
			$scope.profile.name = dummyprofile.name;
			$scope.profile.email = dummyprofile.email;
			$scope.profile.genre = dummyprofile.song_type;
			$scope.profile.contact = dummyprofile.contact;
			$scope.profile.band = dummyprofile.band;
			setInterval(function(){console.log(dummyprofile.song_type); }, 1000);
			$scope.profileC.btn = "Edit";
			$scope.profileC.cancel = false;
			$("#name").attr('disabled', !$("#name").attr('disabled'));
			$("#email").attr('disabled', !$("#email").attr('disabled'));
			$("#genre").attr('disabled', !$("#genre").attr('disabled'));
			$("#band").attr('disabled', !$("#band").attr('disabled'));
			$("#contact").attr('disabled', !$("#contact").attr('disabled'));
		}

		$scope.artistSongs = {
			'1':"",
			'2':"",
			'3':"",
			'4':"",
			'5':"",
			'6':"",
			'7':"",
			'8':""
		}
		$http.get('/api/artistprofile/song')
		.then(function(response) {
			if(response.data){
				var p = response.data;
				$.each(p, function(k, v) {
					$scope.artistSongs[k] = v;
				});
			}
		},function(response) {
			console.log("song loading error");
		});

		$scope.songrm = function(id) {
			$http.get('/api/artistprofile/songrm?id='+id)
			.then(function(response) {
				if(!response.data.error){
					$scope.artistSongs[id] = '';
				}
			},function(response) {
				console.log("songrm err",response);
			})
		}

		$scope.requests = {}
		$http.get('/api/artistprofile/products')
		.then(function(response) {
			if(!response.data.error){
				$scope.requests = response.data;
			}
		},function(response) {
			console.log("err",response);
		});

		$scope.accept = function(id,i) {
			$http.get('/api/artistprofile/accept?id='+id)
			.then(function(response) {
				if(!response.data.error){
					$scope.requests[i].accepted = true;
				}
			},function(response) {
				console.log("err",response);
			})
		}
		$scope.remove = function(id,i) {
			$http.get('/api/artistprofile/remove?id='+id)
			.then(function(response) {
				if(!response.data.error){
					$scope.requests.splice(i, 1);
				}
			},function(response) {
				console.log("err",response);
			})
		}
}

function userProfileCtrl($scope,$http) {
		$("#head").hide();
		$("#mainNav").removeClass("affix-top");
		$("#mainNav").addClass("affix");
		var dummyprofile;
		$scope.profile={}
		$scope.profileC={}
		$scope.profileC.btn = "Edit";
		$scope.profileC.cancel = false
		$http.get('/api/userprofile/personal')
		.then(function(response) {
			 if(!response.data.error){
				 var p = response.data;
				 $scope.profile.name = p.name;
				 $scope.profile.email=p.email;
				 $scope.profile.contact=p.contact;
				 dummyprofile = p;
			 }
			 if(response.data.error){
				 $scope.profile.error = "Something went wrong!! Please contact us"
			 }
	 },function(response) {
		 $scope.profile.error = "Something went wrong!! Please try again."
	 });

		$scope.profileC.edit = function(){
			if($scope.profileC.btn=="Edit"){
				$scope.profileC.btn = "Save";
				$scope.profileC.cancel = true;
				$("#name").attr('disabled', !$("#name").attr('disabled'));
				$("#email").attr('disabled', !$("#email").attr('disabled'));
				$("#contact").attr('disabled', !$("#contact").attr('disabled'));
			}
			else if($scope.profileC.btn=="Save" ){
				var data = {
					'name': $scope.profile.name,
					'email': $scope.profile.email,
					'contact': $scope.profile.contact
				}
				$http.post('/api/userprofile/personal',data)
				.then(function(response) {
					if(!response.data.error){
						$scope.profileC.btn="Edit";
						$scope.profileC.cancel=false;
						dummyprofile.name=$scope.profile.name;
						dummyprofile.email=$scope.profile.email;
						dummyprofile.contact=$scope.profile.contact;
						$("#name").attr('disabled', !$("#name").attr('disabled'));
						$("#email").attr('disabled', !$("#email").attr('disabled'));
						$("#contact").attr('disabled', !$("#contact").attr('disabled'));
						console.log("updated",response.data);
					}
					else {
						$scope.profile.error = "Something went wrong!! Please contact us"
						console.log("error",response);
					}
				},function(response) {
					$scope.profile.error = "Something went wrong!! Please Try again"
				})
			}
		}
		$scope.profileC.cancelbtn = function(){
			$scope.profile.name = dummyprofile.name;
			$scope.profile.email = dummyprofile.email;
			$scope.profile.contact = dummyprofile.contact;
			$scope.profileC.btn = "Edit";
			$scope.profileC.cancel = false;
			$("#name").attr('disabled', !$("#name").attr('disabled'));
			$("#email").attr('disabled', !$("#email").attr('disabled'));
			$("#contact").attr('disabled', !$("#contact").attr('disabled'));
		}

		$scope.product = {};
		$scope.productadd = function() {
			$('#productaddmodal').modal('toggle');
		}
		$scope.productsubmit = function() {
			var data = {
				name: $scope.product.name,
				img: $scope.product.img,
				link: $scope.product.link,
				cost: $scope.product.cost,
			}
			$http.post('/api/userprofile/productadd',data)
			.then(function(response) {
				if(!response.data.error){
					$scope.products.push(data);
					$('#productaddmodal').modal('toggle');
					$scope.product.name = "";
					$scope.product.img = "";
					$scope.product.link = "";
					$scope.product.cost = "";
				}
			},function(response) {
				$scope.product.name = "Something went wrong try again";
				$scope.product.img = "";
				$scope.product.link = "";
				$scope.product.cost = "";
			})
		}
		$scope.products = []
		$http.get('/api/userprofile/product')
		.then(function(response) {
			if(!response.data.error){
				$scope.products = response.data;
			}
		},function(response) {
			console.log("err ",response);
		})
}



function artistCtrl($scope,$http,$stateParams,$state,$location) {
		$("#head").hide();
		$("#mainNav").removeClass("affix-top");
		$("#mainNav").addClass("affix");
		$scope.songi = 0;
	var name = $stateParams.name;
	$('.panel .panel-body .bg').css("background-image","url('/uploads/pics/"+name+"')");
	$http.get('/api/artist?u='+name)
	.then(function(response) {
		if(!response.data.error){
			$scope.artist = response.data;
		}
	},function(response) {
		console.log("error",response);
	})
	$scope.playsong = function(i) {
		mc(name,i,$scope.artist.songs);
	}
	$scope.view_products = function() {
		if(!$scope.logged)
		return $('#myModal').modal('toggle')
		$http.get('/api/userprofile/product')
		.then(function(response) {
			if(!response.data.error){
				$scope.product = response.data;
			}
		},function(response) {
			console.log("Error ",response);
		})
			$('#view_products').modal('toggle')
	}
	$scope.request = function(id) {
		$http.get('/api/artist/request?id='+id+'&username='+name)
		.then(function(response) {
			if(!response.data.error){
				console.log("AHOY");
				// $scope.product[i].sent = true;

			}
		},function(response) {
			console.log("err ",response);
		});
	}
	$scope.product_ads = [],
	$http.get('/api/artist/products?username='+name)
	.then(function(response) {
		if(!response.data.error){
			$scope.product_ads = response.data;
		}
	},function(response) {
		console.log("Err",response);
	})
}
