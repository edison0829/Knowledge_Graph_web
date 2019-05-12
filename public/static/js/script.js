document.getElementsByName("search")[0].addEventListener('change',bringBackImage);
function similarity(s1, s2) {
		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength === 0) {
			return 1.0;
		}
		return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
	}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
		return costs[s2.length];
	}

function bringBackImage(){
	console.log(this.value,this.value.trim.length);
	if (this.value.trim.length==0)
	{
		document.getElementById("bgid").style.backgroundImage = 'url(http://localhost:3001/static/img/d.jpg)';
		document.getElementById("footerid").style.display = "block";

	}
}
		var app = new Vue({
				el: '#app',
				data: {
						message: 'Hello Vue!',
						hidden_result:[],
						results: [],
						results2: [],
						results3: [],
						source:[],
						query: ''
				},
				methods: {
						search: function() {
								axios.get("http://127.0.0.1:3001/search?q=" + this.query)
										.then(response => {
												data = response.data;
												//var n = document.getElementById("d");
												//while (n)
												var elems = document.querySelectorAll("[id='d']");
												for(var i = 0; i <elems.length;i++)
												{
													elems[i].remove();
												}
												// $("#d").remove()
												// console.log(this.source.length);

												var query  = document.getElementsByName("search")[0].value;
												// console.log(query);
												var list = []
												for(var i in data){
													var values = $.map(data[i]["_source"],function(value,key){return value});
													var simi = []
													for (var j in values){
														cur_sim = Math.round(similarity(query,values[j].toString())*10000)/100;
														simi.push(cur_sim)
														}
													var s_value = simi.sort((a,b) => a>b).slice(0,5);
													var s_sum = s_value.reduce(function(a,b){return a+b;},0);
													list.push({key:data[i],value:s_sum});
													}

												list.sort((a, b) => (a.value < b.value) ? 1 : -1)
												// list_sort = Object.keys(list).sort(function(a,b){return list[b]-list[a]});
												console.log(this.results.length);
												len = list.length
												for(var i in list)
												{
													// console.log("aaa");
													// console.log(list[i].key);
													// var count = Object.keys(data[i]["_source"]).length ;
													// console.log(count);
													if(list[i].key["_source"]["tags"].includes("cal"))
													{
														if (this.source.indexOf(list[i].key["_id"]) < 0) {
															this.results.push(list[i].key);
															this.source.push(list[i].key["_id"]);
															$('#result_box').append("<div class=\"col-md-3\"  id=\"d\" ><div class=\" panel panel-default \"><div class=\"panel-heading\" style=\"background-color:#91ffa1;\">"+list[i].key["_source"]["startDate"]+", "+list[i].key["_source"]["endDate"]+", <br>"+list[i].key["_source"]["DayOfWeek"]+"</div><div class=\"panel-body\" style = \"color:#000000;\"><p><b>Event: </b> "+list[i].key["_source"]["name"]+", <br><b>tags: </b>"+list[i].key["_source"]["tags"]+".</p></div></div>")
														}
													}
													else {
														if(list[i].key["_source"]["tags"].includes("housing"))
														{
															if (this.source.indexOf(list[i].key["_id"]) < 0){
															this.results.push(list[i].key);
															this.source.push(list[i].key["_id"]);
															var array = JSON.stringify(list[i].key["_source"]["ApartmentType"], null, 2);
															// var array = strin.replace(/\\n/g, '');
															console.log(array);
															$('#result_box').append("<div class=\"col-md-3\"  id=\"d\" ><div class=\" panel panel-default \"><div class=\"panel-heading\" style=\"background-color:#ff965e;\"><legend>"+list[i].key["_source"]["name"]+"</legend>"+list[i].key["_source"]["address"]+"</div><div class=\"panel-body\" style = \"color:#000000;\"><p><b>Wehave: </b>"+array+", <br><b>Description: </b>"+list[i].key["_source"]["description"]+", <br><b>tags: </b>"+list[i].key["_source"]["tags"]+".</p></div></div>")
														}
														}
														else{
															if (this.source.indexOf(list[i].key["_id"]) < 0){
																this.results.push(list[i].key);
																this.source.push(list[i].key["_id"]);
																var key_words = JSON.stringify(list[i].key["_source"]["keywords"],null,2)
															$('#result_box').append("<div class=\"col-md-3\"  id=\"d\" ><div class=\" panel panel-default \"><div class=\"panel-heading\" style=\"background-color:#a5fcff;\"><legend>"+list[i].key["_source"]["name"]+"</legend>"+list[i].key["_source"]["address"]+"<br>"+list[i].key["_source"]["phone"]+"</div><div class=\"panel-body\" style = \"color:#000000;\"><p><b>keywords: </b>"+key_words+", <br><b>Description: </b>"+list[i].key["_source"]["description"]+", <br><b>tags: </b>"+list[i].key["_source"]["tags"]+".</p></div></div>")
															}
														}
													}
												}
												// {
												//   // var count = Object.keys(data[i]["_source"]).length ;
												//   // console.log(count);
												//   if(data[i]["_source"]["tags"].includes("cal"))
												//   {
												// 		if (this.source.indexOf(data[i]["_id"]) < 0) {
											 // 				this.results.push(data[i]);
												// 			this.source.push(data[i]["_id"]);
												// 		}
												//   }
												//   else {
												//     if(data[i]["_source"]["tags"].includes("dining"))
												//     {
												// 			if (this.source.indexOf(data[i]["_id"]) < 0){
												//       this.results3.push(data[i]);
												// 			this.source.push(data[i]["_id"]);
												// 		}
												//     }
												//     else{
												// 			if (this.source.indexOf(data[i]["_id"]) < 0){
												// 				this.results2.push(data[i]);
												// 				this.source.push(data[i]["_id"]);
												// 			}
												//     }
												//   }
												// }
												// this.results = [];
												this.source = [];
												if (this.query.length > 0)
												{
													document.getElementById("bgid").style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2000px-Solid_white.svg.png)';
													document.getElementById("footerid").style.display = "none";
												}
												else
												{
													document.getElementById("bgid").style.backgroundImage = 'url(http://localhost:3001/static/img/d.jpg)';
													document.getElementById("footerid").style.display = "block";
												}
										})
						}
				},
				watch: {
						query: function(){
							this.search();
						}
				}

		})
