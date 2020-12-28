var saveArrayTemp;

function loadData() {
	console.log("loadData")
	var sValue = sessionStorage.getItem("scat");
	var cValue = sessionStorage.getItem("cat");
	var h2 = document.getElementById("h2_lernen");
	var h3 = document.getElementById("h3_lernen");
	h2.innerHTML = cValue;
	h3.innerHTML = sValue;


	$.ajax({
		type: 'GET',
		url: 'https://projektseminarlfrb.herokuapp.com/questions',
		data: {
			"category_name": cValue,
			"subcategory_name": sValue
		},
		dataType: 'json',
		success: function (data) {
			if (data == undefined || data == null || data.length == 0) {
				alert('Zu dieser Kategorie gibt es keine Fragen!');
				window.location.href = './lernen.html';
			} else {
				generateSaveArray(data);
			}
		},
		error: function (result) {
			console.log(result);
			alert("Es gab einen Fehler beim Laden der Daten!");
		}

	})
}

function generateSaveArray(json) {
	console.log("generateSaveArray")
	parseLearningQuestions(json, function (response) {
		questions = response;
		checkSaveArray(questions);
	});
}

function parseLearningQuestions(jsonFile, callback) {
	console.log("parseLearningQuestions")
	var questions = new Array();
	var questionNumber = 0;
	for (var i = 0; i < jsonFile.length; i++) {
		questions[questionNumber] = new Array();
		questions[questionNumber][0] = jsonFile[questionNumber].question;
		questions[questionNumber][1] = new Array();
		questions[questionNumber][2] = jsonFile[questionNumber]._id;
		for (var j = 0; j < jsonFile[i].answers.length; j++) {
			questions[questionNumber][1][j] = new Array();
			questions[questionNumber][1][j][0] = j;
			questions[questionNumber][1][j][1] = jsonFile[i].answers[j].aText;

			var questToF = jsonFile[i].answers[j].trueOrFalse;
			if (questToF) {
				questions[questionNumber][1][j][2] = true;
			} else {
				questions[questionNumber][1][j][2] = false;
			}
			//selected Or not
			questions[questionNumber][1][j][4] = false;

		}
		questionNumber++;
	}
	callback(questions);
}

function checkSaveArray(data) {
	console.log("checkSaveArray")
	var saveArray;
	/*if (localStorage.getItem('saveArrayLernen') !== null) {
	  saveArray = JSON.parse(localStorage.getItem("saveArrayLernen"));
	  init(data, saveArray);
	}else{ */
	var saveArray = [Number(0), Number(0)];
	localStorage.setItem("saveArrayLernen", JSON.stringify(saveArray));
	init(data, saveArray);
}

function init(questions, saveArray) {
	console.log('init');

	var currentQuestion = 1;
	startQuestion('div_answer', questions);
}

function startQuestion(answerDiv, questions, saveArray) {
	console.log("startQuestion")
	var questionNumber = 0;
	replace_question_text(questions[questionNumber][0]);
	question_number('div_questionCount', questionNumber, questions.length);
	fillAnswers(answerDiv, questions, questionNumber);
}

function fillAnswers(answerDiv, questions, questionNumber) {
	console.log("fillAnswers")
	var savedString = localStorage.getItem("saveArrayLernen");
	var saveArray = JSON.parse(savedString);
	var answer = null;

	for (var j = 0; j < 4; j++) {
		if (answer === null) {
			answer = '<div class="w-full mb-4 answer">' +
				'<div class="p_question break-words pl-3 py-3 ">' + questions[questionNumber][1][j][1] + ' </div> <div class ="div_Img"> <image class="aImg" /> </div>' +
				'</div>';
		} else {
			answer = answer + '<div class="w-full mb-4 answer">' +
				'<div class="p_question break-words pl-3 py-3">' + questions[questionNumber][1][j][1] + ' </div> <div class ="div_Img"> <image class="aImg" /> </div>' +
				'</div>';
		}
	}
	document.getElementById(answerDiv).innerHTML = answer;
	var aButtons = document.getElementsByClassName("answer");
	var aImg = document.getElementsByClassName("aImg");

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
				}
				transformButtonsSelected(questions, questionNumber);
			}
		}
	}


	var button = document.getElementById('btn_weiter');
	var btn_Abgeben = document.getElementById('nextButtonText');
	btn_Abgeben.innerHTML = "Abgeben";
	button.onclick = function () {
		if (btn_Abgeben.innerHTML == "Abgeben") {

			for (var i = 0; i < aButtons.length; i++) {
				if (questions[questionNumber][1][i][4] && questions[questionNumber][1][i][2] || !questions[questionNumber][1][i][4] && !questions[questionNumber][1][i][2]) {
					aImg[i].setAttribute("src", "./images/check_circle.png");
					aImg[i].style.display = "block";
					saveArray[0] = saveArray[0] + 1;


				} else if (!questions[questionNumber][1][i][4] && questions[questionNumber][1][i][2] || questions[questionNumber][1][i][4] && !questions[questionNumber][1][i][2]) {
					aImg[i].setAttribute("src", "./images/check_x.png");
					aImg[i].style.display = "block";
					saveArray[1] = saveArray[1] + 1;
				}
			}

			for (var i = 0; i < aButtons.length; i++) {
				if (questions[questionNumber][1][i][2]) {
					questions[questionNumber][1][i][3].style.background = "#abdcc4";
				}
				else if (!questions[questionNumber][1][i][2]) {
					questions[questionNumber][1][i][3].style.background = "#d9b3b3";
				}
				console.log(aButtons[i])
			}
			btn_Abgeben.innerHTML = "Weiter";

		} else if (btn_Abgeben.innerHTML == 'Weiter') {
			questionNumber++;
			if (questionNumber == questions.length) {
				localStorage.setItem("saveArrayLernen", JSON.stringify(saveArray));
				window.location.href = './studentPerformanceLernen.html';
			} else {
				localStorage.setItem("saveArrayLernen", JSON.stringify(saveArray));
				question_number('questionCount', questionNumber, questions.length);
				loadNextQuestion(questions, questionNumber);
			}
		}
	}
}


function transformButtonsSelected(questions, questionNumber) {
	console.log("transformButtonsSelected");
	for (var i = 0; i < questions[questionNumber][1].length; i++) {
		if (questions[questionNumber][1][i][4] == true) {
			questions[questionNumber][1][i][3].style.background = "#c8c8c8";
		} else if (!questions[questionNumber][1][i][4]) {
			questions[questionNumber][1][i][3].style.background = "#e2e8f0";
		}
	}
}

function replace_question_text(qString) {
	console.log("replace_question_text")
	var test = document.getElementById('div_question');
	if (test !== null) {
		test.innerHTML = qString;
	} else {
		console.log("question is null");
		alert("Es gab einen Fehler beim Laden der Daten!");
	}
}

function question_number(questionId, questionNumber, maxQuestion) {
	console.log("question_number");
	//var question = document.getElementById(questionId);
	questionNumber++;
	//question.innerHTML = 'Frage ' + questionNumber + '/' + maxQuestion;
}

function loadNextQuestion(questions, questionNumber) {
	console.log("loadNextQuestion");
	replace_question_text(questions[questionNumber][0]);
	fillAnswers('div_answer', questions, questionNumber);
}