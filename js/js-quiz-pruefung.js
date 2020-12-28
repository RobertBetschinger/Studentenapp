function loadData() {
	console.log("loadData")
	$.ajax({
		type: 'GET',
		url: 'https://projektseminarlfrb.herokuapp.com/categorys',
		dataType: 'json',
		success: function (data) {
			if (data == undefined || data == null || data.length == 0) {
				alert('Fehler beim Laden');
				window.location.href = './index.html';
			} else {
				createStatArray();
				generateArray(data);
			}
		},
		error: function (result) {
			console.log(result);
			alert("Es gab einen Fehler beim Laden der Daten!");

		},
		complete: function () {
			//$('#divLodaingGif').hide();

		}
	});
}

function generateArray(jsonFile) {
	console.log("generateArray")
	var maxQuestion = 10;
	parseTestQuestions(jsonFile, maxQuestion, function (response) {
		questions = response;

		init(questions, maxQuestion);
	});
}

async function parseTestQuestions(jsonFile, maxQuestions, callback) {
	console.log("parseTestQuestions")
	var questions = [];
	var json;
	create: for (var i = 0; i < maxQuestions; i++) {
		console.log("check " + i); 
		var rndCat = Math.floor(Math.random() * jsonFile.length);
		var subCatLength = jsonFile[rndCat].sub_categories.length;
		var rndSubCat = Math.floor(Math.random() * subCatLength);
		var cValue = jsonFile[rndCat].category_name;
		var sValue = jsonFile[rndCat].sub_categories[rndSubCat].subcategory_name;
		questions[i] = new Array();

		json = await doAjax(cValue, sValue, i);

		if (json.length === 0) {
			i--;
			console.log("json length was 0")
			continue create;
		} else {
			var questLength = json.length;
			var rndQuest = Math.floor(Math.random() * questLength);
			if (questions != undefined) {
				check:for (var v = 0; v < questions.length-1; v++) {
					if (questions[v][4] == json[rndQuest]._id) {
						console.log("Double Quest Found " + json[rndQuest]);
						i--; 
						continue create; 
					}
				}
			}
			var countAnswers = json[rndQuest].answers.length;
			questions[i][0] = json[rndQuest].question;
			questions[i][1] = new Array();
			questions[i][2] = json[rndQuest].category_name;
			questions[i][3] = json[rndQuest].subcategory_name;
			questions[i][4] = json[rndQuest]._id;

			for (var j = 0; j < countAnswers; j++) {
				questions[i][1][j] = new Array();
				questions[i][1][j][0] = j;
				questions[i][1][j][1] = json[rndQuest].answers[j].aText;
				var questToF = json[rndQuest].answers[j].trueOrFalse;
				if (questToF) {
					questions[i][1][j][2] = true;
				} else {
					questions[i][1][j][2] = false;
				}
				questions[i][1][j][4] = false;
			}
			console.log("question an Stelle  " + i + questions[i]); 
		}
	}
	console.log(questions)
		document.getElementById("divLoadingImage").style.display = "none";
	callback(questions);
}

async function doAjax(cValue, sValue, i) {
	const result = await $.ajax({
		type: 'GET',
		url: 'https://projektseminarlfrb.herokuapp.com/questions',
		data: {
			"category_name": cValue,
			"subcategory_name": sValue
		},
		dataType: 'json',
		beforeSend: function(){
		$('#divLoadingImage').show();
		},
		/*complete: function(){
		$('#img_load').hide();
		},*/
		success: function (data) {
		},
		error: function (result) {
			alert("Es gab einen Fehler: " + result)
			window.location.href = './index.html';
		}
	});
	return result;
}

function init(questions, maxQuestion) {
	console.log('init');
	var time_in_minutes = 10;
	start_countdown('div_clock', time_in_minutes);
	var currentQuestion = 0;
	fillAnswers('div_answer', questions, currentQuestion, maxQuestion);
}

function replace_question_text(string) {
	console.log("replace_question_text");
	document.getElementById('p_question').innerHTML = string;
}

function start_countdown(clockid, time_in_minutes) {
	console.log("start_countdown");
	//start the countdown
	var current_time = Date.parse(new Date());
	var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
	run_clock(clockid, deadline);
}

function time_remaining(endtime) {
	console.log("time_remaining")
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
}

function run_clock(id, endtime) {
	console.log("run_clock");
	var clock = document.getElementById(id);
	function update_clock() {
		var t = time_remaining(endtime);
		clock.innerHTML = ((t.minutes).toString()).padStart(2, '0') + ':' + ((t.seconds).toString()).padStart(2, '0');
		if (t.total <= 0) {
			alert("Zeit abgelaufen")
			clearInterval(timeinterval);
			window.location.href = 'studentPerformance.html';
		}
	}
	update_clock(); // run function once at first to avoid delay
	var timeinterval = setInterval(update_clock, 1000);
}

function question_number(questionId, currentQuestion, maxQuestion) {
	console.log("question_number");
	var question = document.getElementById(questionId);
	var nmb = currentQuestion + 1;
	question.innerHTML = 'Frage ' + nmb + '/' + maxQuestion;
}

function checkButton(nextButtonText, backButton, currentQuestion, maxQuestion) {
	console.log("checkButton")
	//Button Text
	if (currentQuestion == 0) {
		backButton.style.display = 'none';
	} else {
		backButton.style.display = 'block';
	}
	if (currentQuestion == (maxQuestion - 1)) {
		nextButtonText.innerHTML = 'Fertig';
	} else {
		nextButtonText.innerHTML = 'Weiter';
	}
	if (currentQuestion > (maxQuestion - 1)) {
		return true;
	}
	return false;
}

function fillAnswers(divID, questions, questionNumber, maxQuestion) {
	console.log("fillAnswers");
	question_number('div_questionCount', questionNumber, maxQuestion);
	var answer = null;
	replace_question_text(questions[questionNumber][0]);
	for (var i = 0; i < 4; i++) {
		if (answer === null) {
			answer = '<div class="w-full mb-4 bg-gray-500 p-3 answer">' +
				'<p id="u2009-2" class="break-words">' + questions[questionNumber][1][i][1] + '</p>' +
				'</div>';
		} else {
			answer = answer + '<div class="w-full mb-4 bg-gray-500 p-3 answer">' +
				'<p id="u2009-2" class="break-words">' + questions[questionNumber][1][i][1] + '</p>' +
				'</div>';
		}
	}

	document.getElementById(divID).innerHTML = answer;
	var aButtons = document.getElementsByClassName("answer");

	for (var i = 0; i < aButtons.length; i++) {
		questions[questionNumber][1][i][3] = aButtons[i];
		questions[questionNumber][1][i][3].style.cursor = 'pointer';
		questions[questionNumber][1][i][3].style.background = "#e2e8f0";
		questions[questionNumber][1][i][3].onclick = function () {
			for (var i = 0; i < questions[questionNumber][1].length; i++) {
				if (this == questions[questionNumber][1][i][3]) {
					if (questions[questionNumber][1][i][4] == false) {
						questions[questionNumber][1][i][4] = true;
					} else {
						questions[questionNumber][1][i][4] = false;
					}
					transformButtonsSelected(questions, questionNumber);
				}
			}
		}
	}

	transformButtonsSelected(questions, questionNumber);
	var btnBack = document.getElementById("btn_back");
	var btnForth = document.getElementById("btn_prue");

	btnForth.onclick = function () {
		checkAnswers(questions, questionNumber, "answer");
		questionNumber++;
		var finish = checkButton(btnForth, btnBack, questionNumber, maxQuestion);
		if (finish) {
			window.location.href = 'studentPerformance.html';
		} else {
			loadNextQuestion(questions, questionNumber, maxQuestion);
		}
	}

	btnBack.onclick = function () {
		questionNumber--;
		checkButton(btnForth, btnBack, questionNumber, maxQuestion)
		loadNextQuestion(questions, questionNumber, maxQuestion);
	}
}

function transformButtonsSelected(questions, questionNumber) {
	console.log("transformButtonsSelected")
	//transform selected buttons
	for (var i = 0; i < questions[questionNumber][1].length; i++) {
		if (questions[questionNumber][1][i][4] == true) {
			questions[questionNumber][1][i][3].style.background = "#c8c8c8";
		} else if (questions[questionNumber][1][i][4] == false) {
			questions[questionNumber][1][i][3].style.background = "#e2e8f0";
		}
	}
}

function checkAnswers(questions, questionNumber, htmlEl) {
	console.log("checkAnswers")
	var aButtons = document.getElementsByClassName(htmlEl);
	var statArray = localStorage.getItem("statArray");

	var stats = JSON.parse(statArray);
	stats[questionNumber][1] = questions[questionNumber][2];
	stats[questionNumber][2] = questions[questionNumber][3];
	stats[questionNumber][3] = 0;
	stats[questionNumber][4] = 0;
	for (var j = 0; j < aButtons.length; j++) {
		if (questions[questionNumber][1][j][4] && questions[questionNumber][1][j][2] || !questions[questionNumber][1][j][4] && !questions[questionNumber][1][j][2]) {
			stats[questionNumber][3] = stats[questionNumber][3] + 1;
		} else if (!questions[questionNumber][1][j][4] && questions[questionNumber][1][j][2] || questions[questionNumber][1][j][4] && !questions[questionNumber][1][j][2]) {
			stats[questionNumber][4] = stats[questionNumber][4] + 1;
		}

	}
	localStorage.setItem("statArray", JSON.stringify(stats));
}


function loadNextQuestion(questions, questionNumber, maxQuestion) {
	console.log("loadNextQuestion")
	fillAnswers('div_answer', questions, questionNumber, maxQuestion);
}


async function createStatArray() {
	console.log("createStatArray")
	var statArray = new Array();

	for (var i = 0; i < 10; i++) {
		statArray[i] = new Array();
		statArray[i][1] = null;
		statArray[i][2] = null;
		statArray[i][3] = 0;
		statArray[i][4] = 0;
	}
	localStorage.setItem("statArray", JSON.stringify(statArray));
}